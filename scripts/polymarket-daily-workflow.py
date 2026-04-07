#!/usr/bin/env python3
"""
Polymarket Daily Workflow System — Chapter 7B
Complete daily workflow: morning scan → analysis → execute → evening review → weekly portfolio

Usage:
    python3 polymarket-daily-workflow.py morning    # Step 1: Morning scan
    python3 polymarket-daily-workflow.py evening     # Step 4: Evening dream review
    python3 polymarket-daily-workflow.py weekly      # Step 5: Weekly portfolio review
    python3 polymarket-daily-workflow.py trades        # Live trade feed
"""

import requests, json, math, os, sqlite3
from datetime import datetime, date, timedelta
from collections import defaultdict
import argparse

GAMMA_API = 'https://gamma-api.polymarket.com/markets'
TRADES_API = 'https://data-api.polymarket.com/trades'
DB_PATH = os.path.expanduser('~/.openclaw/workspace/memory_polymarket.db')
KELLY_CAP = 0.04  # 4% of bankroll max per trade

# Base rate calibration from historical resolution data
# When market prices X%, historically events in that range resolve YES at ~BASE_RATE
BASE_RATES = {
    (0.00, 0.05): 0.08, (0.05, 0.10): 0.13, (0.10, 0.15): 0.20,
    (0.15, 0.20): 0.25, (0.20, 0.25): 0.32, (0.25, 0.30): 0.38,
    (0.30, 0.35): 0.43, (0.35, 0.40): 0.48, (0.40, 0.45): 0.54,
    (0.45, 0.50): 0.58, (0.50, 0.55): 0.62, (0.55, 0.60): 0.65,
    (0.60, 0.65): 0.70, (0.65, 0.70): 0.73, (0.70, 0.75): 0.76,
    (0.75, 0.80): 0.80, (0.80, 0.85): 0.84, (0.85, 0.90): 0.87,
    (0.90, 0.95): 0.90, (0.95, 1.00): 0.93,
}

def get_base_rate(price):
    for (low, high), rate in BASE_RATES.items():
        if low <= price < high: return rate
    return 0.5

def kelly_edge(market_price, true_prob, cap=KELLY_CAP):
    """Proper Kelly: f = (p_true * b - (1-p_true)) / b
    Edge: positive = underpriced (buy YES), negative = overpriced (sell YES)
    """
    p_m = market_price
    p_t = true_prob
    if p_m <= 0.01 or p_m >= 0.99:
        return 0, 0
    b = (1 - p_m) / p_m  # payout ratio
    edge = p_t - p_m  # positive = underpriced
    f = (p_t * b - (1 - p_t)) / b
    return max(0, min(f, cap)), edge

def parse_price(m):
    try: return float(json.loads(m.get('outcomePrices', '["0.5"]'))[0])
    except: return 0.5

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""CREATE TABLE IF NOT EXISTS markets (
        id TEXT PRIMARY KEY, question TEXT, price REAL, volume REAL,
        end_date TEXT, outcomes TEXT, url TEXT, created_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY, market_id TEXT, wallet TEXT, side TEXT,
        price REAL, size REAL, outcome TEXT, pnl REAL, timestamp TEXT, trade_date TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS daily_summaries (
        date TEXT PRIMARY KEY, morning_scan TEXT, evening_review TEXT,
        weekly_review TEXT, total_pnl REAL, created_at TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY, market_id TEXT, direction TEXT, price REAL,
        kelly_pct REAL, dollar_amount REAL, result TEXT, pnl REAL,
        date TEXT, created_at TEXT)""")
    conn.commit()
    return conn

def get_markets(limit=200):
    r = requests.get(GAMMA_API, params={'active': True, 'closed': False, 'limit': limit}, timeout=15)
    return r.json()

def get_trades(limit=500):
    r = requests.get(f'{TRADES_API}?limit={limit}', timeout=15)
    return r.json()

def morning_scan(conn, min_volume=10000, bankroll=1000):
    print(f"\n{'='*80}")
    print(f"  STEP 1: MORNING SCAN  |  {datetime.now().strftime('%Y-%m-%d  %H:%M UTC')}")
    print(f"{'='*80}")

    markets = get_markets(limit=200)
    print(f"  Fetched {len(markets)} markets\n")

    today = date.today()
    results = []

    for m in markets:
        vol = float(m.get('volume') or 0)
        if vol < min_volume: continue
        end_str = m.get('endDate', '')[:10]
        if not end_str: continue
        try:
            end = date.fromisoformat(end_str)
            if end < today: continue
        except: pass

        price = parse_price(m)
        base = get_base_rate(price)
        divergence = base - price  # + = underpriced (BUY), - = overpriced (SELL)
        k, edge = kelly_edge(price, base)

        results.append({
            'id': m.get('id', ''),
            'question': m.get('question', ''),
            'price': price,
            'volume': vol,
            'base': base,
            'div': divergence,
            'abs_div': abs(divergence),
            'kelly': k,
            'kelly_dollar': k * bankroll,
            'direction': 'BUY' if divergence > 0 else 'SELL',
            'end_date': end_str,
            'outcomes': m.get('outcomes', []),
            'url': m.get('url', ''),
        })

    # Filter truly unresolved (skip already-resolved markets with $0.01 or $0.99 prices)
    live_results = [r for r in results if not (r['price'] < 0.02 or r['price'] > 0.98)]
    print(f"  Total markets: {len(results)}")
    print(f"  Live tradeable (price $0.02-$0.98): {len(live_results)}")
    print(f"  High-volume mispriced (>5% div): {len([r for r in results if r['abs_div'] >= 0.05])}")

    # Save to DB
    c = conn.cursor()
    ts = datetime.now().isoformat()
    for r2 in results:
        c.execute("INSERT OR REPLACE INTO markets (id, question, price, volume, end_date, outcomes, url, created_at) VALUES (?,?,?,?,?,?,?,?)",
            (r2['id'], r2['question'], r2['price'], r2['volume'],
             r2['end_date'], json.dumps(r2['outcomes']), r2['url'], ts))
    conn.commit()

    # Sort by Kelly fraction
    results.sort(key=lambda x: x['kelly'], reverse=True)
    mispriced = [r for r in results if r['abs_div'] >= 0.05]

    print(f"\n  {'='*80}")
    print(f"  TOP TRADE OPPORTUNITIES (Kelly > 0.5% | sorted by Kelly fraction)")
    print(f"  {'='*80}\n")
    print(f"  {'Dir':>4} | {'Price':>6} | {'True':>5} | {'Kelly':>7} | {'$':>6} | Question")
    print(f"  {'-'*75}")
    for r2 in results[:10]:
        if r2['kelly'] < 0.005: continue
        div_str = f"{r2['div']:+.0%}"
        print(f"  {r2['direction']:>4} | ${r2['price']:>5.2f} | {r2['base']:>4.0%} | {r2['kelly']*100:>6.1f}% | ${r2['kelly_dollar']:>5.1f} | {r2['question'][:45]}")

    print(f"\n  {'='*80}")
    print(f"  ALL MARKETS SORTED BY VOLUME")
    print(f"  {'='*80}\n")
    print(f"  {'Dir':>4} | {'Price':>6} | {'True':>5} | {'Div':>5} | {'Kelly':>7} | Volume      | Question")
    print(f"  {'-'*85}")
    results.sort(key=lambda x: x['volume'], reverse=True)
    for r2 in results[:20]:
        dir_str = r2['direction'] if r2['abs_div'] >= 0.05 else '---'
        div_str = f"{r2['div']:+.0%}"
        kelly_str = f"{r2['kelly']*100:.1f}%" if r2['kelly'] > 0.005 else '---'
        print(f"  {dir_str:>4} | ${r2['price']:>5.2f} | {r2['base']:>4.0%} | {div_str:>5} | {kelly_str:>7} | ${r2['volume']:>10,.0f} | {r2['question'][:40]}")

    return results

def evening_review(conn, bankroll=1000):
    print(f"\n{'='*80}")
    print(f"  STEP 4: EVENING DREAM REVIEW  |  {datetime.now().strftime('%Y-%m-%d  %H:%M UTC')}")
    print(f"{'='*80}")

    today = date.today().isoformat()
    yesterday = (date.today() - timedelta(days=1)).isoformat()

    trades = get_trades(limit=500)
    print(f"\n  Fetched {len(trades)} live trades")

    # Wallet activity
    wallets = defaultdict(list)
    for t in trades:
        w = t.get('proxyWallet', '')
        if w: wallets[w].append(t)

    top_w = sorted(wallets.items(), key=lambda x: len(x[1]), reverse=True)[:5]

    print(f"\n  {'='*80}")
    print(f"  TOP WALLETS BY RECENT ACTIVITY")
    print(f"  {'='*80}\n")
    print(f"  {'Trades':>6} | {'Pseudonym':<25} | {'Direction':<10} | Avg Price")
    print(f"  {'-'*70}")
    for addr, wtrades in top_w:
        pseudonym = wtrades[0].get('pseudonym', '(anon)')[:25]
        prices = [float(t.get('price', 0)) for t in wtrades]
        directions = [t.get('outcome', 'PENDING') for t in wtrades[:3]]
        avg_p = sum(prices)/len(prices) if prices else 0
        print(f"  {len(wtrades):>6} | {pseudonym:<25} | {str(directions[:2]):<10} | ${avg_p:.4f}")

    print(f"\n  {'='*80}")
    print(f"  CONSOLIDATION")
    print(f"  {'='*80}")
    print("""
  1. Which estimates were accurate this week?
  2. Win rate by category (crypto/political/sports)?
  3. Any strategy rules to update?
  4. Kelly sizing: were you over- or under-sizing?
  5. What position size on a $1000 bankroll?
    """)

def weekly_review(conn):
    print(f"\n{'='*80}")
    print(f"  STEP 5: WEEKLY PORTFOLIO REVIEW  |  {datetime.now().strftime('%Y-%m-%d')}")
    print(f"{'='*80}")
    print("""
  Paste this week's trade log and I'll calculate:
  1. Total P&L and Sharpe ratio
  2. Win rate by category
  3. Average position size vs Kelly optimal
  4. Edge decay over time
  5. Missed opportunities

  Output: Updated static prompt rules for next week.
    """)

def show_trades():
    trades = get_trades(limit=50)
    print(f"\n{'='*80}")
    print(f"  LIVE TRADES  |  {datetime.now().strftime('%H:%M:%S UTC')}")
    print(f"{'='*80}\n")
    print(f"  {'Side':>4} | {'Price':>7} | {'Size':>8} | {'Outcome':<10} | {'Market':<42}")
    print(f"  {'-'*90}")
    for t in trades:
        side = t.get('side','')[:4]
        price = float(t.get('price',0))
        size = float(t.get('size',0))
        outcome = t.get('outcome','PENDING')[:10]
        title = t.get('title', t.get('slug',''))[:42]
        pseudonym = t.get('pseudonym','')[:15]
        ts = t.get('timestamp','')
        dt = datetime.fromtimestamp(int(ts)).strftime('%H:%M:%S') if ts else ''
        print(f"  {side:>4} | ${price:>6.4f} | {size:>8.2f} | {outcome:<10} | {title:<42} | {pseudonym}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument('action', nargs='?', default='morning',
                   choices=['morning','evening','weekly','trades'])
    p.add_argument('--bankroll', type=float, default=1000)
    p.add_argument('--min-volume', type=float, default=10000)
    args = p.parse_args()

    conn = init_db()
    if args.action == 'trades':
        show_trades()
    elif args.action == 'morning':
        morning_scan(conn, min_volume=args.min_volume, bankroll=args.bankroll)
    elif args.action == 'evening':
        evening_review(conn, bankroll=args.bankroll)
    elif args.action == 'weekly':
        weekly_review(conn)
    conn.close()

if __name__ == '__main__':
    main()
