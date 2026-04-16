#!/usr/bin/env python3
"""
Combined Market Scanner v3 - Fixed Polymarket Parser
"""

import subprocess
import re
import os
from datetime import datetime

POLY_CLI = os.path.expanduser("~/.openclaw/workspace/skills/polymarket-odds/polymarket.mjs")

STOCKS = [
    {'ticker': 'RELIANCE.BSE', 'name': 'Reliance', 'price': 1329.40, 'change': -1.36, 'volume': 3200000, 'sector': 'Oil & Gas'},
    {'ticker': 'TCS.BSE', 'name': 'TCS', 'price': 2587.75, 'change': 1.09, 'volume': 2800000, 'sector': 'IT'},
    {'ticker': 'HDFCBANK.BSE', 'name': 'HDFC Bank', 'price': 797.25, 'change': -2.31, 'volume': 8500000, 'sector': 'Banking'},
    {'ticker': 'INFY.BSE', 'name': 'Infosys', 'price': 1331.50, 'change': -1.10, 'volume': 4100000, 'sector': 'IT'},
    {'ticker': 'ICICIBANK.BSE', 'name': 'ICICI Bank', 'price': 1280.75, 'change': -2.18, 'volume': 6200000, 'sector': 'Banking'},
    {'ticker': 'SBIN.BSE', 'name': 'SBI', 'price': 1040.90, 'change': -1.90, 'volume': 5800000, 'sector': 'Banking'},
    {'ticker': 'BHARTIARTL.BSE', 'name': 'Bharti Airtel', 'price': 1858.80, 'change': -0.15, 'volume': 2100000, 'sector': 'Telecom'},
    {'ticker': 'LT.BSE', 'name': 'L&T', 'price': 3897.20, 'change': -2.75, 'volume': 4200000, 'sector': 'Infrastructure'},
    {'ticker': 'KOTAKBANK.BSE', 'name': 'Kotak Bank', 'price': 371.95, 'change': -2.12, 'volume': 5100000, 'sector': 'Banking'},
    {'ticker': 'HINDUNILVR.BSE', 'name': 'HUL', 'price': 2133.70, 'change': -0.56, 'volume': 1800000, 'sector': 'FMCG'},
]

SECTOR_QUERIES = {
    'Banking': ['rate', 'fed', 'bank'],
    'IT': ['tech', 'ai', 'nvidia'],
    'Oil & Gas': ['oil', 'crude', 'energy'],
    'Telecom': ['5g', 'jio'],
    'Infrastructure': ['india', 'gdp'],
    'FMCG': ['inflation', 'food'],
}

THRESHOLDS = {'price_drop': -1.0, 'price_rally': 1.0, 'volume_high': 3000000}

def run_cli(command):
    try:
        result = subprocess.run(
            ["node", POLY_CLI] + command,
            capture_output=True, text=True, timeout=8
        )
        return result.stdout, result.stderr
    except Exception as e:
        return "", str(e)

def parse_predictions(output):
    """Parse with backwards search for questions"""
    predictions = []
    lines = output.split('\n')
    
    for i, line in enumerate(lines):
        if 'Yes:' in line and 'No:' in line:
            # Find question by looking backwards
            question = "Unknown"
            for j in range(max(0, i-3), i):
                if j >= 0 and '📊' in lines[j]:
                    # Clean up the question line
                    question = re.sub(r'^📊\s+', '', lines[j].strip())
                    question = re.sub(r'\s+Yes:.*$', '', question)
                    break
            
            # Extract percentages
            match = re.search(r'Yes:\s*([\d.]+)%.*?No:\s*([\d.]+)%', line)
            if match:
                yes_pct = float(match.group(1))
                no_pct = float(match.group(2))
                predictions.append({
                    'question': question[:55],
                    'yes': yes_pct,
                    'no': no_pct,
                    'confidence': abs(50 - yes_pct)
                })
    
    return predictions

def analyze_stock(stock, all_predictions):
    signals = []
    score = 0
    change = stock['change']
    pred_boost = 0
    
    if change < THRESHOLDS['price_drop']:
        signals.append(f"📉 Drop: {change:.1f}%")
        score += 25
    elif change > THRESHOLDS['price_rally']:
        signals.append(f"📈 Rally: +{change:.1f}%")
        score += 15
    
    if stock['volume'] > THRESHOLDS['volume_high']:
        signals.append(f"📊 Vol: {stock['volume']/1000000:.1f}M")
        score += 15
    
    # Get sector predictions
    sector = stock['sector']
    queries = SECTOR_QUERIES.get(sector, [])
    
    matching = []
    for q in queries:
        for pred in all_predictions:
            if q.lower() in pred.get('question', '').lower():
                matching.append(pred)
    
    if matching:
        best = max(matching, key=lambda x: x['confidence'])
        prob = best['yes']
        
        if prob > 60:
            pred_boost = min(25, (prob - 50) // 3)
            signals.append(f"🎯 Macro: {prob}%")
        elif prob < 40:
            pred_boost = max(-15, -(50 - prob) // 3)
            signals.append(f"⚠️ Macro: {prob}%")
    
    score = max(0, min(100, score + pred_boost))
    
    rec = 'STRONG_BUY' if score >= 70 else 'BUY' if score >= 50 else 'WATCH' if score >= 30 else 'NEUTRAL'
    
    return {
        'ticker': stock['ticker'],
        'name': stock['name'],
        'price': stock['price'],
        'change': change,
        'sector': sector,
        'signals': signals,
        'score': score,
        'recommendation': rec
    }

def generate_report(opportunities, predictions, error):
    lines = []
    lines.append("=" * 58)
    lines.append("📊 COMBINED SCANNER v3 (Fixed Parser)")
    lines.append(datetime.now().strftime('%Y-%m-%d %H:%M'))
    lines.append("=" * 58)
    
    lines.append("\n🎯 POLYMARKET PREDICTIONS:")
    lines.append("-" * 45)
    
    if predictions:
        sorted_preds = sorted(predictions, key=lambda x: x['confidence'], reverse=True)[:12]
        for p in sorted_preds:
            prob = p['yes']
            arrow = "📈" if prob > 65 else "📉" if prob < 35 else "➡️"
            q = p['question'][:38]
            lines.append(f"{arrow} {prob:>5.1f}% | {q}")
    elif error:
        lines.append(f"({error[:40]})")
    else:
        lines.append("(No data)")
    
    lines.append("\n" + "=" * 58)
    lines.append("STOCK SIGNALS")
    lines.append("-" * 45)
    
    opportunities.sort(key=lambda x: x['score'], reverse=True)
    
    strong = [o for o in opportunities if o['recommendation'] == 'STRONG_BUY']
    buy = [o for o in opportunities if o['recommendation'] == 'BUY']
    watch = [o for o in opportunities if o['recommendation'] == 'WATCH']
    
    if strong:
        lines.append("\n🟢 STRONG BUY:")
        for o in strong:
            lines.append(f"  {o['ticker']} {o['name']} ₹{o['price']} ({o['change']:+.2f}%)")
            lines.append(f"    Score: {o['score']}/100")
            for s in o['signals']: lines.append(f"    {s}")
    
    if buy:
        lines.append("\n🟢 BUY:")
        for o in buy:
            lines.append(f"  {o['ticker']} ₹{o['price']} ({o['change']:+.2f}%) | {o['score']}")
    
    if watch:
        lines.append("\n🟡 WATCH:")
        for o in watch:
            lines.append(f"  {o['ticker']} ₹{o['price']} ({o['change']:+.2f}%)")
    
    scores = [o['score'] for o in opportunities]
    if scores:
        lines.append("\n" + "=" * 58)
        lines.append(f"Avg: {sum(scores)/len(scores):.0f} | S:{len(strong)} B:{len(buy)} W:{len(watch)}")
    
    lines.append("=" * 58)
    return "\n".join(lines)

def run():
    print("Fetching predictions...")
    
    all_predictions = []
    all_error = ""
    
    for sector, queries in SECTOR_QUERIES.items():
        for q in queries[:1]:
            output, error = run_cli(["search", q])
            if output:
                preds = parse_predictions(output)
                all_predictions.extend(preds)
            if error:
                all_error = error
    
    print(f"  → {len(all_predictions)} predictions")
    
    print("Analyzing stocks...")
    opportunities = [analyze_stock(s, all_predictions) for s in STOCKS]
    
    print(generate_report(opportunities, all_predictions, all_error))

if __name__ == '__main__':
    run()