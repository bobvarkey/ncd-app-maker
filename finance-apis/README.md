# Finance APIs Configuration

## Marketstack
- **Website**: https://marketstack.com
- **API Key**: Get from https://marketstack.com/product
- **Usage**: Stock market data worldwide
- **Free Tier**: 1000 calls/month

## Finage
- **Website**: https://finage.co.uk
- **API Key**: Get from https://finage.co.uk/dashboard
- **Usage**: Real-time stock & forex data
- **Free Tier**: 50 calls/day

---

## Quick Test Commands

### Marketstack
```bash
curl "http://api.marketstack.com/v1/eod?access_key=YOUR_KEY&symbols=AAPL"
```

### Finage
```bash
curl "https://api.finage.co.uk/quote/stock/AAPL?apikey=YOUR_KEY"
```

---

## Notes
- Sign up at each website to get your free API key
- Replace YOUR_KEY with your actual API key
- Add keys to environment variables or config for production use
