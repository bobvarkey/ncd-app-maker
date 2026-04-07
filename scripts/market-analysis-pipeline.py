#!/usr/bin/env python3
"""
Market Analysis Pipeline — Quantitative mispricing detection for Polymarket
Combines live Gamma API data + wallet activity + Kelly criterion sizing

Usage:
    python3 market-analysis-pipeline.py              # Full analysis
    python3 market-analysis-pipeline.py --watch     # Monitor wallet
    python3 market-analysis-pipeline.py --wallet ADDRESS  # Track specific wallet
"""

import requests
import json
import math
import sys
from datetime import datetime, date
from collections import defaultdict
import argparse

# ═══════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════
GAMMA_API = 'https://gamma-api.polymarket.com/markets'
TRADES_API = 'https://data-api.polymarket.com/trades'
LIMIT = 200

# Base rate historical data (Polymarket resolvers + public sources)
# Historically, YES markets in these ranges resolve:
HISTORICAL_BASE_RATES = {
    (0.00, 0.10): 0.15,  # Very unlikely
    (0.10, 0.20): 0.25,  # Unlikely
    (0.20, 0.30): 0.38,  # Less likely
    (0.30, 0.40): 0.52,  # Slight lean
    (0.40, 0.50): 0.58,  # True coin flip
    (0.50, 0.60): 0.62,  # Lean yes
    (0.60, 0.70): 0.71,  # Likely
    (0.70, 0.80): 0.78,  # Probable
    (0.80, 0.90): 0.83,  # Highly likely
    (0.90, 0.95): 0.88,  # Near certain
    (0.95, 1.00): 0.93,  # Virtually certain
}

def get_base_rate(price):
    for (low, high), rate in HISTORICAL_BASE_RATES.items():
        if low <= price < high:
            return rate
    return 0.5

def get_active_markets(limit=LIMIT):
    params = {'active': True, 'limit': limit, 'order': 'volume', 'ascending': False}
    r = requests.get(GAMMA_API, params=params, timeout=15)
    return r.json()

def get_trades(limit=LIMIT):
    r = requests.get(f'{TRADES_API}?limit={limit}', timeout=15)
    return r.json()

def parse_price(market):
    try:
        prices = json.loads(market.get('outcomePrices', '["0.5"]'))
        return float(prices[0])
    except:
        return 0.5

def kelly_fraction(p, q, b, cap=0.04):
    """Kelly criterion: f = (b*p - q) / b. Cap at `cap` of bankroll."""
    f = (b * p - q) / b
    return max(0, min(f, cap))

def analyze_market(market, bankroll=1000):
    """Full quantitative analysis of a single market."""
    price = parse_price(market)
    vol = float(market.get('volume') or 0)
    question = market.get('question', '')
    outcomes = market.get('outcomes', [])
    end_date = market.get('endDate', '')[:10]
    url = market.get('url', '')

    if vol < 1000:
        return None  # Skip low volume

    base_rate = get_base_rate(price)
    divergence = price - base_rate
    abs_div = abs(divergence)

    # Kelly sizing
    # Payout if YES: 1-price pays (1-price)/price
    # Payout if NO: price pays price/(1-price)
    if price < 0.99:
        b_yes = (1 - price) / price  # Odds on YES
    else:
        b_yes = 10  # Cap for near-100% markets

    if price > 0.01:
        b_no = price / (1 - price)  # Odds on NO
    else:
        b_no = 10

    p_yes = price
    p_no = 1 - price

    # f = (b*p - q) / b
    f_yes = kelly_fraction(p_yes, p_no, b_yes)
    f_no = kelly_fraction(p_no, p_yes, b_no)

    # Conditional probability check: related markets
    conditional_flags = []
    if 'rain' in question.lower() and 'outdoor' in question.lower():
        conditional_flags.append('rain AND outdoor may be inconsistent')

    return {
        'question': question,
        'price': price,
        'volume': vol,
        'base_rate': base_rate,
        'divergence': divergence,
        'abs_div': abs_div,
        'flag': abs_div > 0.10,
        'flag_type': 'OVERPRICED' if divergence > 0.10 else ('UNDERPRICED' if divergence < -0.10 else None),
        'kelly_yes_pct': round(f_yes * 100, 2),
        'kelly_no_pct': round(f_no * 100, 2),
        'kelly_yes_dollar': round(f_yes * bankroll, 2),
        'kelly_no_dollar': round(f_no * bankroll, 2),
        'outcomes': outcomes,
        'end_date': end_date,
        'url': url,
    }

def analyze_wallet(trades, wallet_addr):
    """Analyze trading performance of a specific wallet."""
    wallet_trades = [t for t in trades if t.get('proxyWallet', '').lower() == wallet_addr.lower()]
    if not wallet_trades:
        return None

    wins = losses = pending = 0
    pnl = 0.0
    by_market = defaultdict(lambda: {'trades': [], 'volume': 0})

    for t in wallet_trades:
        side = t.get('side', '')
        size = float(t.get('size', 0))
        price = float(t.get('price', 0))
        outcome = t.get('outcome', '')
        slug = t.get('slug', 'unknown')
        title = t.get('title', slug)

        by_market[slug]['trades'].append(t)
        by_market[slug]['title'] = title
        by_market[slug]['volume'] += size * price

        if outcome == 'WON':
            wins += 1
            pnl += size * (1 - price)
        elif outcome == 'LOST':
            losses += 1
            pnl -= size * price
        else:
            pending += 1

    total = wins + losses
    wr = wins / total * 100 if total > 0 else 0

    return {
        'wallet': wallet_addr,
        'pseudonym': wallet_trades[0].get('pseudonym', 'Unknown'),
        'total_trades': len(wallet_trades),
        'resolved': total,
        'pending': pending,
        'wins': wins,
        'losses': losses,
        'win_rate': wr,
        'pnl': pnl,
        'markets': len(by_market),
        'top_markets': sorted(by_market.items(), key=lambda x: x[1]['volume'], reverse=True)[:5],
    }

def run_analysis(bankroll=1000, min_volume=5000):
    print(f"╔══════════════════════════════════════════════════════════════════╗")
    print(f"║          MARKET ANALYSIS PIPELINE — Polymarket                   ║")
    print(f"║  {datetime.now().strftime('%Y-%m-%d %H:%M UTC'):<57}║")
    print(f"╚══════════════════════════════════════════════════════════════════╝")
    print(f"\nBankroll: ${bankroll} | Kelly cap: 4% | Base rate divergence threshold: 10%\n")

    markets = get_active_markets(LIMIT)
    trades = get_trades(LIMIT)

    # Filter to future-dated active markets
    today = date.today()
    active = []
    for m in markets:
        end_str = m.get('endDate', '')[:10]
        if not end_str:
            continue
        try:
            end_date = date.fromisoformat(end_str)
            if end_date >= today:
                m['_end_date'] = end_date
                active.append(m)
        except:
            pass

    print(f"Active markets with future dates: {len(active)}")
    print(f"Recent trades fetched: {len(trades)}\n")

    if not active:
        print("No future-dated active markets found. Showing all by volume:")
        active = markets[:50]

    # Analyze each market
    analyzed = []
    for m in active:
        result = analyze_market(m, bankroll)
        if result and result['abs_div'] >= 0.10:
            analyzed.append(result)

    analyzed.sort(key=lambda x: x['abs_div'], reverse=True)

    # Print mispriced markets
    print("═" * 90)
    print("MISPRICED MARKETS — sorted by absolute divergence (base rate vs price)")
    print("═" * 90)

    if analyzed:
        print(f"\n{'Div':>6} | {'Price':>6} | {'Base%':>6} | {'Kelly Y/N':>9} | Volume   | Question")
        print("-" * 90)
        for a in analyzed[:20]:
            div_str = f"{a['divergence']:+.0%}"
            kelly_str = f"{a['kelly_yes_pct']:.1f}/{a['kelly_no_pct']:.1f}"
            print(f"{div_str:>6} | ${a['price']:>5.2f} | {a['base_rate']:>5.0%} | {kelly_str:>9} | ${a['volume']:>8,.0f} | {a['question'][:45]}")
    else:
        print("\nNo markets with >10% divergence from base rate found.")

    # Print all active markets table
    print(f"\n\n{'='*90}")
    print(f"ALL ACTIVE MARKETS — sorted by volume (min ${min_volume:,})")
    print(f"{'='*90}\n")

    all_active = []
    for m in active:
        result = analyze_market(m, bankroll)
        if result and result['volume'] >= min_volume:
            all_active.append(result)

    all_active.sort(key=lambda x: x['volume'], reverse=True)

    print(f"{'Price':>6} | {'Kelly Y/N':>9} | Volume     | End Date  | Question")
    print("-" * 90)
    for a in all_active[:30]:
        kelly_str = f"{a['kelly_yes_pct']:.1f}/{a['kelly_no_pct']:.1f}"
        print(f" ${a['price']:>5.2f} | {kelly_str:>9} | ${a['volume']:>9,.0f} | {a['end_date']} | {a['question'][:45]}")

    return analyzed, all_active, trades

def track_wallet_cli(address, trades):
    result = analyze_wallet(trades, address)
    if not result:
        print(f"No trades found for wallet: {address[:20]}...")
        return

    print(f"\n{'═'*60}")
    print(f"WALLET ANALYSIS: {result['pseudonym']}")
    print(f"{'═'*60}")
    print(f"Address: {result['wallet']}")
    print(f"Total trades: {result['total_trades']} ({result['pending']} pending)")
    print(f"Win rate: {result['win_rate']:.1f}% ({result['wins']}W / {result['losses']}L)")
    print(f"Net P&L: ${result['pnl']:,.2f}")
    print(f"Markets traded: {result['markets']}")

    print(f"\nTop markets by volume:")
    for slug, data in result['top_markets']:
        print(f"  ${data['volume']:>8.2f} | {data['title'][:55]}")

    return result

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Polymarket Market Analysis Pipeline')
    parser.add_argument('--bankroll', type=float, default=1000, help='Bankroll for Kelly sizing (default: $1000)')
    parser.add_argument('--min-volume', type=float, default=5000, help='Minimum market volume (default: $5000)')
    parser.add_argument('--wallet', type=str, help='Track specific wallet address')
    parser.add_argument('--top-wallets', action='store_true', help='Show top wallets by activity')
    args = parser.parse_args()

    if args.wallet:
        trades = get_trades(500)
        track_wallet_cli(args.wallet, trades)
    elif args.top_wallets:
        trades = get_trades(500)
        wallets = defaultdict(lambda: {'count': 0, 'pseudonym': ''})
        for t in trades:
            w = t.get('proxyWallet', '')
            if w:
                wallets[w]['count'] += 1
                wallets[w]['pseudonym'] = t.get('pseudonym', '')
        top = sorted(wallets.items(), key=lambda x: x[1]['count'], reverse=True)[:15]
        print(f"\n{'═'*60}")
        print(f"TOP WALLETS BY RECENT TRADE COUNT")
        print(f"{'═'*60}\n")
        print(f"{'Trades':>6} | Pseudonym              | Wallet")
        print("-" * 60)
        for wallet, data in top:
            print(f"{data['count']:>6} | {data['pseudonym']:<22} | {wallet}")
    else:
        mispriced, all_markets, trades = run_analysis(bankroll=args.bankroll, min_volume=args.min_volume)
