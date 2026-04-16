#!/usr/bin/env python3
"""
Enhanced Morning Market Scanner for Indian Stocks
With prediction-style confidence scoring
"""

import requests
import pandas as pd
import numpy as np
from datetime import datetime
import json
import os
import time

# === CONFIGURATION ===
ALPHA_VANTAGE_API_KEY = 'C49WBACXIIPINPD7'

STOCKS = [
    ('RELIANCE', 'BSE'), ('TCS', 'BSE'), ('HDFCBANK', 'BSE'), ('INFY', 'BSE'),
    ('ICICIBANK', 'BSE'), ('SBIN', 'BSE'), ('BHARTIARTL', 'BSE'), ('LT', 'BSE'),
    ('KOTAKBANK', 'BSE'), ('HINDUNILVR', 'BSE'), ('COLPAL', 'BSE'), ('PIDILITIND', 'BSE'),
    ('TITAN', 'BSE'), ('TORNTPHARM', 'BSE'), ('MFSL', 'BSE'), ('ADANIPOWER', 'BSE'),
    ('CONCOR', 'BSE'), ('AARTIIND', 'BSE'), ('DEEPAKNTR', 'BSE'), ('GODREJCP', 'BSE'),
    ('MARUTI', 'BSE'), ('BAJAJ-AUTO', 'BSE'), ('HEROMOTOCO', 'BSE'), ('EICHERMOT', 'BSE'),
    ('ONGC', 'BSE'), ('COALINDIA', 'BSE'), ('NTPC', 'BSE'), ('POWERGRID', 'BSE'),
    ('SUNPHARMA', 'BSE'), ('DRREDDY', 'BSE'), ('CIPLA', 'BSE'), ('APOLLOHOSP', 'BSE')
]

# Settings - customize these
SENSITIVITY = 'high'  # high/medium/low
CURRENT_MACRO = 'neutral'  # bull_market/neutral/bear_market

SENSITIVITY_SETTINGS = {
    'low': {'price_drop': -2.0, 'price_rally': 2.0, 'volume_high': 8000000},
    'medium': {'price_drop': -1.5, 'price_rally': 1.5, 'volume_high': 5000000},
    'high': {'price_drop': -1.0, 'price_rally': 1.0, 'volume_high': 3000000},
}

MACRO_MULTIPLIERS = {
    'bull_market': 1.2,
    'neutral': 1.0,
    'bear_market': 0.8,
}

THRESHOLDS = SENSITIVITY_SETTINGS[SENSITIVITY].copy()
THRESHOLDS['intraday_volatility'] = 2.0
THRESHOLDS['gap_threshold'] = 1.5
THRESHOLDS['volume_high'] = 3000000

# Apply macro multiplier
macro_mult = MACRO_MULTIPLIERS.get(CURRENT_MACRO, 1.0)
THRESHOLDS['price_drop'] = round(THRESHOLDS['price_drop'] * macro_mult, 2)
THRESHOLDS['price_rally'] = round(THRESHOLDS['price_rally'] * macro_mult, 2)

SCAN_RESULTS_FILE = '~/.openclaw/workspace/market-scan/results.json'
STATE_FILE = '~/.openclaw/workspace/market-scan/state.json'
STOCKS_PER_RUN = 10

def ensure_dir():
    os.makedirs(os.path.expanduser('~/.openclaw/workspace/market-scan'), exist_ok=True)

def load_state():
    try:
        with open(os.path.expanduser(STATE_FILE), 'r') as f:
            return json.load(f)
    except:
        return {'index': 0, 'failed_tickers': []}

def save_state(state):
    with open(os.path.expanduser(STATE_FILE), 'w') as f:
        json.dump(state, f)

def get_stocks_to_fetch(state, limit=STOCKS_PER_RUN):
    """Get stocks - prioritize good ones first, then retry failed"""
    start_idx = state.get('index', 0) % len(STOCKS)
    failed = set(state.get('failed_tickers', []))

    to_fetch = []
    seen = set()

    # First: retry up to half of limit with previously failed (they move to back of queue)
    retry_count = 0
    max_retries = min(limit // 2, len(failed)) if failed else 0

    # Get good stocks (not in failed list)
    for i in range(len(STOCKS)):
        idx = (start_idx + i) % len(STOCKS)
        symbol, exchange = STOCKS[idx]
        ticker = f"{symbol}.{exchange}"
        if ticker not in failed and ticker not in seen:
            to_fetch.append((symbol, exchange))
            seen.add(ticker)
            if len(to_fetch) >= limit - max_retries:
                break

    # Then: add some to retry (for next time)
    if failed and len(to_fetch) < limit:
        for i in range(len(STOCKS)):
            if len(to_fetch) >= limit:
                break
            idx = (start_idx + i) % len(STOCKS)
            symbol, exchange = STOCKS[idx]
            ticker = f"{symbol}.{exchange}"
            if ticker in failed and ticker not in seen:
                to_fetch.append((symbol, exchange))
                seen.add(ticker)

    return to_fetch

def fetch_quote(symbol, exchange='BSE'):
    try:
        ticker = f"{symbol}.{exchange}"
        url = "https://www.alphavantage.co/query"
        params = {
            'function': 'GLOBAL_QUOTE',
            'symbol': ticker,
            'apikey': ALPHA_VANTAGE_API_KEY
        }

        resp = requests.get(url, params=params, timeout=10)
        data = resp.json()

        if 'Global Quote' in data and data['Global Quote']:
            q = data['Global Quote']
            price = float(q.get('05. price', 0))
            if price <= 0:
                return None
            return {
                'ticker': q.get('01. symbol', ticker),
                'name': symbol,
                'price': price,
                'change': float(q.get('10. change percent', '0').replace('%', '')),
                'volume': int(q.get('06. volume', 0)),
                'high': float(q.get('03. high', 0)),
                'low': float(q.get('04. low', 0)),
                'open': float(q.get('02. open', 0)),
                'prev_close': float(q.get('08. previous close', 0)),
            }
    except:
        pass
    return None

def fetch_stocks(stocks, state):
    print(f"Fetching {len(stocks)} quotes...")
    data = []
    failed = []

    for symbol, exchange in stocks:
        quote = fetch_quote(symbol, exchange)
        if quote:
            data.append(quote)
            print(f"  ✅ {symbol}: ₹{quote['price']:.2f} ({quote['change']:+.2f}%)")
        else:
            failed.append(f"{symbol}.{exchange}")
            print(f"  ⚠️ {symbol}: Failed")

        time.sleep(0.5)

    # Update failed list: keep old ones, add new ones
    old_failed = set(state.get('failed_tickers', []))
    all_failed = old_failed | set(failed)
    # Keep max 10 failed
    state['failed_tickers'] = list(all_failed)[:10]
    state['index'] = (state.get('index', 0) + len(stocks)) % len(STOCKS)
    save_state(state)

    return pd.DataFrame(data), state

def analyze_signals(df):
    opportunities = []

    for _, row in df.iterrows():
        signals = []
        score = 0

        change = row['change']

        # Price signals
        if change < THRESHOLDS['price_drop']:
            sev = 'STRONG' if change < -2.5 else 'MEDIUM' if change < -1.75 else 'WEAK'
            signals.append({'type': 'price_drop', 'value': change, 'reason': f"Drop: {change:.1f}%"})
            score += {'STRONG': 35, 'MEDIUM': 25, 'WEAK': 15}[sev]
        elif change > THRESHOLDS['price_rally']:
            signals.append({'type': 'price_rally', 'value': change, 'reason': f"Rally: +{change:.1f}%"})
            score += 15

        # Volume
        vol = row.get('volume', 0)
        if vol > THRESHOLDS['volume_high']:
            signals.append({'type': 'high_volume', 'value': vol/1000000, 'reason': f"Vol: {vol/1000000:.1f}M"})
            score += 15

        # Volatility
        if row.get('open') and row.get('high') and row.get('low'):
            range_pct = ((row['high'] - row['low']) / row['open']) * 100
            if range_pct > THRESHOLDS['intraday_volatility']:
                signals.append({'type': 'volatility', 'value': range_pct, 'reason': f"Range: {range_pct:.1f}%"})
                score += 10

        if signals:
            score = min(score, 100)

            if score >= 75:
                rec = 'STRONG_BUY'
            elif score >= 50:
                rec = 'BUY'
            elif score >= 30:
                rec = 'WATCH'
            else:
                rec = 'NEUTRAL'

            opportunities.append({
                'ticker': row['ticker'],
                'name': row['name'],
                'price': row['price'],
                'change': row['change'],
                'signals': signals,
                'prediction_score': score,
                'recommendation': rec
            })

    return opportunities

def save_results(opportunities, df):
    ensure_dir()

    results = {
        'scan_date': datetime.now().isoformat(),
        'stocks_scanned': len(df),
        'opportunities': opportunities,
        'config': {'sensitivity': SENSITIVITY, 'macro': CURRENT_MACRO, 'thresholds': THRESHOLDS}
    }

    with open(os.path.expanduser(SCAN_RESULTS_FILE), 'w') as f:
        json.dump(results, f, indent=2, default=str)

def generate_report(opportunities, df):
    lines = []
    lines.append("=" * 55)
    lines.append(f"MARKET SCAN - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("=" * 55)
    lines.append(f"Sensitivity: {SENSITIVITY} | Macro: {CURRENT_MACRO}")
    lines.append(f"Thresholds: Drop <{THRESHOLDS['price_drop']}%, Rally >{THRESHOLDS['price_rally']}%")
    lines.append(f"Scanned: {len(df)} stocks | Opportunities: {len(opportunities)}")
    lines.append("")

    if not opportunities:
        lines.append("No opportunities detected.")
        return "\n".join(lines)

    opportunities.sort(key=lambda x: x['prediction_score'], reverse=True)

    strong = [o for o in opportunities if o['recommendation'] == 'STRONG_BUY']
    buy = [o for o in opportunities if o['recommendation'] == 'BUY']
    watch = [o for o in opportunities if o['recommendation'] == 'WATCH']

    if strong:
        lines.append("STRONG BUY (Score > 75):")
        for o in strong:
            bar = "█" * (o['prediction_score']//10) + "░" * (10 - o['prediction_score']//10)
            lines.append(f"  {o['ticker']} ₹{o['price']:.2f} ({o['change']:+.2f}%)")
            lines.append(f"    Score: {o['prediction_score']}/100 [{bar}]")
            for s in o['signals'][:2]:
                lines.append(f"    {s['reason']}")

    if buy:
        lines.append("BUY (50-75):")
        for o in buy[:5]:
            lines.append(f"  {o['ticker']} ₹{o['price']:.2f} ({o['change']:+.2f}%) | {o['prediction_score']}")

    if watch:
        lines.append("WATCH (30-50):")
        for o in watch[:5]:
            lines.append(f"  {o['ticker']} ₹{o['price']:.2f} ({o['change']:+.2f}%) | {o['prediction_score']}")

    if not df.empty:
        lines.append("")
        lines.append("Top Movers:")
        top = df.nlargest(3, 'change')
        bot = df.nsmallest(3, 'change')
        lines.append("  Gainers: " + ", ".join([f"{r['ticker']}:+{r['change']:.1f}%" for _, r in top.iterrows()]))
        lines.append("  Losers: " + ", ".join([f"{r['ticker']}:{r['change']:.1f}%" for _, r in bot.iterrows()]))

    lines.append("=" * 55)
    return "\n".join(lines)

def run_scan():
    print("Starting Enhanced Market Scan...")

    ensure_dir()
    state = load_state()
    stocks = get_stocks_to_fetch(state)

    df, state = fetch_stocks(stocks, state)

    if df.empty:
        print("No data - retry with new stocks")
        # Clear failed and try fresh
        state['failed_tickers'] = []
        state['index'] = (state.get('index', 0) + 1) % len(STOCKS)
        save_state(state)
        stocks = get_stocks_to_fetch(state)
        df, state = fetch_stocks(stocks, state)

    if df.empty:
        print("Still no data. API may be rate-limited.")
        return

    opportunities = analyze_signals(df)
    save_results(opportunities, df)
    print("\n" + generate_report(opportunities, df))

if __name__ == '__main__':
    run_scan()