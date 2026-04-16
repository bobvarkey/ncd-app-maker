#!/usr/bin/env python3
"""Polymarket helper for current active predictions"""

import requests
import json
import sys

# Try GraphQL endpoint
url = "https://indexer.polymarket.com/graphql"

query = """
query {
  markets(limit: 50, closed: false, active: true) {
    question
    yesVolume
    noVolume
    endDateInt
    tokens { outcome price }
  }
}
"""

try:
    resp = requests.post(url, json={"query": query}, timeout=10)
    data = resp.json()
    
    if 'data' in data and data['data'] and 'markets' in data['data']:
        markets = data['data']['markets']
        
        # Track relevant keywords
        keywords = ['inflation', 'rate', 'fed', 'rbi', 'india', 'nifty', 'sensex', 'stock', 'market', 'economy', 'crypto', 'bitcoin', 'btc', 'election', 'trump', 'biden']
        
        print("📊 ACTIVE POLYMARKET PREDICTIONS")
        print("="*50)
        
        count = 0
        for m in markets:
            q = m.get('question', '').lower()
            if any(k in q for k in keywords):
                yes_vol = int(m.get('yesVolume', 0) or 0)
                no_vol = int(m.get('noVolume', 0) or 0)
                total_vol = (yes_vol + no_vol) / 1000
                
                tokens = m.get('tokens', [])
                yes_price = 0.5
                for t in tokens:
                    if t.get('outcome') == 'Yes':
                        yes_price = float(t.get('price', 0.5))
                        break
                
                display_q = m.get('question', '')[:60]
                confidence = "HIGH" if abs(yes_price - 0.5) > 0.3 else "MED" if abs(yes_price - 0.5) > 0.15 else "LOW"
                bar = "█" * int(yes_price * 10) + "░" * (10 - int(yes_price * 10))
                
                print(f"\n{display_q}")
                print(f"  Yes: {yes_price*100:>5.1f}% | Confidence: {confidence} | Vol: ${total_vol:.0f}K")
                print(f"  [{bar}]")
                
                count += 1
                if count >= 10:
                    break
        
        if count == 0:
            print("No matching markets found. Showing recent:")
            for m in markets[:10]:
                q = m.get('question', '')[:50]
                tokens = m.get('tokens', [])
                for t in tokens:
                    if t.get('outcome') == 'Yes':
                        print(f"  - {q}")
except Exception as e:
    print(f"Error: {e}")
    print("Trying alternative...")
    
    # Fallback to public API
    try:
        resp = requests.get("https://clob.polymarket.com/markets?closed=false&limit=50", timeout=10)
        data = resp.json()
        
        if 'data' in data:
            for m in data['data'][:15]:
                print(f"  - {m.get('question', '')[:55]}")
    except Exception as e2:
        print(f"Fallback error: {e2}")