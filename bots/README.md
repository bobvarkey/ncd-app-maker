# Healthcare Bots

Three Python bot stubs for a medical practice automation layer.

## Bots

### `dhanwantri.py` — AI Receptionist
Handles inbound patient messages on WhatsApp.

**Commands:** `book`, `payment`, `review`, `schedule`

Entry point: `Receptionist().handle_message(message)`

Current state: skeleton — needs WhatsApp Business API integration.

---

### `kavya.py` — Care Pathway AI
Manages follow-up workflows, recovery tracking, review requests.

**Methods:** `track_recovery()`, `send_reminder()`, `request_review()`, `manage_follow_ups()`, `analyze_conversation()`, `monitor_stages()`

Current state: stub classes with pass statements — needs patient data pipeline.

---

### `rohan.py` — Re-engagement Bot
Detects inactive patients and sends re-engagement messages.

**Methods:** `detect_inactive()`, `send_engagement_message()`, `convert_to_booking()`, `analyze_conversation_history()`, `monitor_activity()`

Current state: stub classes — needs patient database connection.

---

## Running

```bash
# All three are designed to run as long-running services
python3 dhanwantri.py   # receptionist
python3 kavya.py        # care pathway
python3 rohan.py       # re-engagement
```

## TODO

- [ ] Add WhatsApp Business API client
- [ ] Connect to patient database
- [ ] Add appointment booking webhook
- [ ] Implement review request automation (Google Places API)
- [ ] Add session management for patient context

## Dependencies

All use standard library + `requests`. No external dependencies yet.