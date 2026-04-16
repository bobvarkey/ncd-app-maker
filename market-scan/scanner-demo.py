#!/usr/bin/env python3
"""
Enhanced Market Scanner - Demo/Backtest Mode
Uses simulated data to test prediction-scoring logic
"""

import random
from datetime import datetime
import json
import os

# === CONFIGURATION ===
SENSITIVITY = 'high'  # high/medium/low
CURRENT_MACRO = 'neutral'  # bull_market/neutral/bear_market

SENSITIVITY_SETTINGS = {
    'low': {'price_drop': -2.0, 'price_rally': 2.0, 'volume_high': 8000000},
    'medium': {'price_drop': -1.5, 'price_rally': 1.5, 'volume_high': 5000000},
    'high': {'price_drop': -1.0, 'price_rally': 1.0, 'volume_high': 3000000},
}

MACRO_MULTIPLIERS = {'bull_market': 1.2, 'neutral': 1.0, 'bear_market': 0.8}

THRESHOLDS = SENSITIVITY_SETTINGS[SENSITIVITY].copy()
THRESHOLDS['intraday_volatility'] = 2.0
THRESHOLDS['gap_threshold'] = 1.5

macro_mult = MACRO_MULTIPLIERS.get(CURRENT_MACRO, 1.0)
THRESHOLDS['price_drop'] = round(THRESHOLDS['price_drop'] * macro_mult, 2)
THRESHOLDS['price_rally'] = round(THRESHOLDS['price_rally'] * macro_mult, 2)

# Demo stock data (normally fetched from API)
DEMO_STOCKS = [
    {'ticker': 'RELIANCE.BSE', 'name': 'Reliance', 'price': 1329.40, 'change': -1.36, 'volume': 3200000, 'high': 1350.0, 'low': 1315.0, 'open': 1347.50, 'prev_close': 1347.50},
    {'ticker': 'TCS.BSE', 'name': 'TCS', 'price': 2587.75, 'change': 1.09, 'volume': 2800000, 'high': 2600.0, 'low': 2555.0, 'open': 2560.0, 'prev_close': 2560.00},
    {'ticker': 'HDFCBANK.BSE', 'name': 'HDFC Bank', 'price': 797.25, 'change': -2.31, 'volume': 8500000, 'high': 815.0, 'low': 790.0, 'open': 815.00, 'prev_close': 815.00},
    {'ticker': 'INFY.BSE', 'name': 'Infosys', 'price': 1331.50, 'change': -1.10, 'volume': 4100000, 'high': 1350.0, 'low': 1325.0, 'open': 1345.00, 'prev_close': 1345.00},
    {'ticker': 'ICICIBANK.BSE', 'name': 'ICICI Bank', 'price': 1280.75, 'change': -2.18, 'volume': 6200000, 'high': 1305.0, 'low': 1275.0, 'open': 1305.00, 'prev_close': 1305.00},
    {'ticker': 'SBIN.BSE', 'name': 'SBI', 'price': 1040.90, 'change': -1.90, 'volume': 5800000, 'high': 1065.0, 'low': 1035.0, 'open': 1062.00, 'prev_close': 1062.00},
    {'ticker': 'BHARTIARTL.BSE', 'name': 'Bharti Airtel', 'price': 1858.80, 'change': -0.15, 'volume': 2100000, 'high': 1875.0, 'low': 1850.0, 'open': 1862.00, 'prev_close': 1862.00},
    {'ticker': 'LT.BSE', 'name': 'L&T', 'price': 3897.20, 'change': -2.75, 'volume': 4200000, 'high': 4000.0, 'low': 3875.0, 'open': 4000.00, 'prev_close': 4000.00},
    {'ticker': 'KOTAKBANK.BSE', 'name': 'Kotak Bank', 'price': 371.95, 'change': -2.12, 'volume': 5100000, 'high': 380.0, 'low': 370.0, 'open': 379.50, 'prev_close': 379.50},
    {'ticker': 'HINDUNILVR.BSE', 'name': 'HUL', 'price': 2133.70, 'change': -0.56, 'volume': 1800000, 'high': 2150.0, 'low': 2125.0, 'open': 2145.50, 'prev_close': 2145.50},
]

def analyze_signals(stocks):
    """Analyze with prediction-style confidence scoring"""
    opportunities = []
    
    for stock in stocks:
        signals = []
        score = 0
        change = stock['change']
        
        # Price drop signal
        if change < THRESHOLDS['price_drop']:
            severity = 'STRONG' if change < -2.5 else 'MEDIUM' if change < -1.75 else 'WEAK'
            signals.append({
                'type': 'price_drop',
                'severity': severity,
                'value': change,
                'reason': f"Drop: {change:.1f}%",
                'confidence': {'STRONG': 95, 'MEDIUM': 80, 'WEAK': 60}[severity]
            })
            score += {'STRONG': 35, 'MEDIUM': 25, 'WEAK': 15}[severity]
        
        # Rally signal
        elif change > THRESHOLDS['price_rally']:
            signals.append({
                'type': 'price_rally',
                'value': change,
                'reason': f"Rally: +{change:.1f}%",
                'confidence': 70
            })
            score += 15
        
        # Volume signal
        vol = stock.get('volume', 0)
        if vol > THRESHOLDS['volume_high']:
            signals.append({
                'type': 'high_volume',
                'value': vol/1000000,
                'reason': f"Volume: {vol/1000000:.1f}M",
                'confidence': 75
            })
            score += 15
        
        # Volatility signal
        if stock.get('open') and stock.get('high') and stock.get('low'):
            range_pct = ((stock['high'] - stock['low']) / stock['open']) * 100
            if range_pct > THRESHOLDS['intraday_volatility']:
                signals.append({
                    'type': 'volatility',
                    'value': range_pct,
                    'reason': f"Range: {range_pct:.1f}%",
                    'confidence': 65
                })
                score += 10
        
        # Gap signal
        if stock.get('prev_close'):
            gap = ((stock['price'] - stock['prev_close']) / stock['prev_close']) * 100
            if abs(gap) > THRESHOLDS.get('gap_threshold', 1.5):
                signals.append({
                    'type': 'gap',
                    'value': gap,
                    'reason': f"{'Up' if gap > 0 else 'Down'} gap: {abs(gap):.1f}%",
                    'confidence': 70
                })
                score += 10
        
        if signals:
            score = min(score, 100)
            
            # Determine recommendation
            if score >= 75:
                rec = 'STRONG_BUY'
            elif score >= 50:
                rec = 'BUY'
            elif score >= 30:
                rec = 'WATCH'
            else:
                rec = 'NEUTRAL'
            
            opportunities.append({
                'ticker': stock['ticker'],
                'name': stock['name'],
                'price': stock['price'],
                'change': stock['change'],
                'signals': signals,
                'prediction_score': score,
                'confidence': score,
                'recommendation': rec
            })
    
    return opportunities

def generate_report(opportunities):
    lines = []
    lines.append("=" * 58)
    lines.append(f"PREDICTION MARKET SCANNER - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append("=" * 58)
    lines.append(f"Sensitivity: {SENSITIVITY.upper()}")
    lines.append(f"Macro View: {CURRENT_MACRO}")
    lines.append(f"Thresholds: Drop <{THRESHOLDS['price_drop']}%, Rally >{THRESHOLDS['price_rally']}%")
    lines.append(f"High Vol: >{THRESHOLDS['volume_high']/1000000:.0f}M")
    lines.append(f"\nOpportunities Found: {len(opportunities)}")
    lines.append("")
    
    if not opportunities:
        lines.append("No signals today.")
        return "\n".join(lines)
    
    opportunities.sort(key=lambda x: x['prediction_score'], reverse=True)
    
    strong = [o for o in opportunities if o['recommendation'] == 'STRONG_BUY']
    buy = [o for o in opportunities if o['recommendation'] == 'BUY']
    watch = [o for o in opportunities if o['recommendation'] == 'WATCH']
    
    if strong:
        lines.append("=" * 30)
        lines.append("🟢 STRONG BUY (Score > 75)")
        lines.append("=" * 30)
        for o in strong:
            score = o['prediction_score']
            bar = "█" * (score // 10) + "░" * (10 - score // 10)
            lines.append(f"\n{o['ticker']} {o['name']}")
            lines.append(f"  Price: ₹{o['price']:.2f} ({o['change']:+.2f}%)")
            lines.append(f"  Prediction Score: {score}/100")
            conf_level = 'Low' if score < 33 else 'Medium' if score < 66 else 'High'
            lines.append(f"  Confidence: {conf_level}")
            lines.append(f"  [{bar}]")
            lines.append("  Signals:")
            for s in o['signals']:
                lines.append(f"    • {s['reason']} (conf: {s['confidence']}%)")
    
    if buy:
        lines.append("\n" + "=" * 30)
        lines.append("🟢 BUY (Score 50-75)")
        lines.append("=" * 30)
        for o in buy:
            score = o['prediction_score']
            bar = "█" * (score // 10) + "░" * (10 - score // 10)
            lines.append(f"\n{o['ticker']} ₹{o['price']:.2f} ({o['change']:+.2f}%)")
            lines.append(f"  Score: {score}/100 [{bar}]")
            for s in o['signals']:
                lines.append(f"    • {s['reason']}")
    
    if watch:
        lines.append("\n" + "=" * 30)
        lines.append("🟡 WATCH (Score 30-50)")
        lines.append("=" * 30)
        for o in watch[:5]:
            score = o['prediction_score']
            lines.append(f"  {o['ticker']} ₹{o['price']:.2f} ({o['change']:+.2f}%) | Score: {score}")
    
    # Summary stats
    scores = [o['prediction_score'] for o in opportunities]
    if scores:
        lines.append("\n" + "=" * 30)
        lines.append("SUMMARY")
        lines.append("=" * 30)
        lines.append(f"  Average Score: {sum(scores)/len(scores):.1f}")
        lines.append(f"  Strong Signals: {len(strong)}")
        lines.append(f"  Medium Signals: {len(buy)}")
        lines.append(f"  Weak/Watch: {len(watch)}")
    
    lines.append("\n" + "=" * 58)
    lines.append("API Status: Demo mode (waiting for quota reset)")
    lines.append("=" * 58)
    
    return "\n".join(lines)

def run_demo():
    print("Running Enhanced Scanner (Demo Mode)...")
    print("Testing prediction-scoring logic...\n")
    
    opportunities = analyze_signals(DEMO_STOCKS)
    report = generate_report(opportunities)
    
    print(report)

if __name__ == '__main__':
    run_demo()