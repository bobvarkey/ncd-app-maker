import sqlite3
import os
from datetime import datetime

db_path = "/Users/bobvarkey/.openclaw/workspace/memory_x_posts.db"
md_dir = "/Users/bobvarkey/.openclaw/workspace/knowledge-base/x-scrapes"
md_path = os.path.join(md_dir, f"x-scrape-{datetime.now().strftime('%Y-%m-%d')}.md")

conn = sqlite3.connect(db_path)
c = conn.cursor()

# Use existing schema: id, author, handle, post_date, text_snippet, replies, reposts, likes, bookmarks, views, url, search_query, scraped_at

posts = [
    # Search 1: neurointervention/thrombectomy/stroke
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "neurointervention OR thrombectomy OR #Neurointervention OR #stroke",
        "author": "Neurophilia",
        "handle": "@bobvarkey",
        "post_date": "Mar 24",
        "text_snippet": "XCath made medical history: world's first REMOTE ROBOTIC STROKE PROCEDURE! A Neurointerventional surgeon performed a mechanical thrombectomy from 120 miles away using the XCath Iris Surgical Robotic System by Dr. Vitor Mendes Pereira.",
        "likes": 3, "reposts": 0, "replies": 0, "bookmarks": 1, "views": 518,
        "url": "https://x.com/bobvarkey/status/2036428077698580963"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "neurointervention OR thrombectomy OR #Neurointervention OR #stroke",
        "author": "Neurophilia",
        "handle": "@bobvarkey",
        "post_date": "Mar 20",
        "text_snippet": "Comparing the safety and efficacy of stent retrievers (SR), contact aspiration (Asp), and a combined mechanical thrombectomy (cMT) for LVO ischemic stroke. Network Meta-Analysis (24 studies, 12,845 patients).",
        "likes": 2, "reposts": 1, "replies": 0, "bookmarks": 3, "views": 826,
        "url": "https://x.com/bobvarkey/status/2034995078868214252"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "neurointervention OR thrombectomy OR #Neurointervention OR #stroke",
        "author": "Neurophilia",
        "handle": "@bobvarkey",
        "post_date": "Mar 4",
        "text_snippet": "Extended thrombectomy window: What the 2025-2026 trials tell us. The DAWN and DEFENSE trials changed everything. Wake-up stroke & late presentation now have evidence for thrombectomy.",
        "likes": 54, "reposts": 12, "replies": 0, "bookmarks": 42, "views": 2813,
        "url": "https://x.com/bobvarkey/status/2029097798671675652"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "neurointervention OR thrombectomy OR #Neurointervention OR #stroke",
        "author": "JNIS",
        "handle": "@JNIS_BMJ",
        "post_date": "Dec 16, 2025",
        "text_snippet": "Restenosis after EVT for sICAS remains a major challenge. Salvage EVT was 100% technically successful with no complications but outcomes differed by strategy. Is Balloon angioplasty + stenting the answer?",
        "likes": 22, "reposts": 6, "replies": 2, "bookmarks": 9, "views": 2056,
        "url": "https://x.com/JNIS_BMJ/status/2000663929077321851"
    },
    # Search 2: cerebral AVM / intracranial aneurysm / endovascular
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "cerebral AVM OR intracranial aneurysm OR endovascular",
        "author": "Dorian",
        "handle": "@wolfstarmoons",
        "post_date": "26 min ago",
        "text_snippet": "Replying to @_Downey__: Maybe thoracic aneurysm, basically a bulge in the aorta in chest. If it pops, boom, instant death.",
        "likes": 0, "reposts": 0, "replies": 0, "bookmarks": 0, "views": 2188,
        "url": "https://x.com/wolfstarmoons/status/2040128999184027724"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "cerebral AVM OR intracranial aneurysm OR endovascular",
        "author": "Osman Ahmed",
        "handle": "@TheRealDoctorOs",
        "post_date": "Mar 28",
        "text_snippet": "Hot Take Alert: Lytics were never dead, industry just lied to you. #irad",
        "likes": 11, "reposts": 2, "replies": 0, "bookmarks": 2, "views": 1590,
        "url": "https://x.com/TheRealDoctorOs/status/2037912173976981915"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "cerebral AVM OR intracranial aneurysm OR endovascular",
        "author": "JAMA Neurology",
        "handle": "@JAMANeuro",
        "post_date": "Apr 1",
        "text_snippet": "Among patients undergoing endovascular thrombectomy for acute Stroke, early (<6 hours) vs delayed (6-12 hours) extubation did not improve 90-day functional independence, hospital stay, complication rates, or mortality.",
        "likes": 27, "reposts": 6, "replies": 0, "bookmarks": 4, "views": 2920,
        "url": "https://x.com/JAMANeuro/status/2039311819693560254"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "cerebral AVM OR intracranial aneurysm OR endovascular",
        "author": "AshuJadhav",
        "handle": "@AshuPJadhav",
        "post_date": "Jun 9, 2023",
        "text_snippet": "Temporal trends in results of endovascular treatment of anterior intracranial large cerebral vessel occlusion: A 7-year study.",
        "likes": 4, "reposts": 3, "replies": 0, "bookmarks": 0, "views": 2088,
        "url": "https://x.com/AshuPJadhav/status/1667221816455344129"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "cerebral AVM OR intracranial aneurysm OR endovascular",
        "author": "Shadi Yaghi",
        "handle": "@ShadiYaghi2",
        "post_date": "Apr 2",
        "text_snippet": "For young patients with no risk factors: would get high resolution VWI to rule out intracranial dissection rather than assuming athero. Agrees with aspirin and risk factor control.",
        "likes": 0, "reposts": 0, "replies": 0, "bookmarks": 0, "views": 21,
        "url": "https://x.com/ShadiYaghi2/status/2039476432221397412"
    },
    {
        "scraped_at": datetime.now().isoformat(),
        "search_query": "cerebral AVM OR intracranial aneurysm OR endovascular",
        "author": "JAMA Neurology",
        "handle": "@JAMANeuro",
        "post_date": "Mar 31",
        "text_snippet": "Early vs delayed extubation after thrombectomy for acute ischemic stroke did not improve 90-day functional independence, hospital stay, complication rates, or mortality.",
        "likes": 29, "reposts": 11, "replies": 0, "bookmarks": 7, "views": 2787,
        "url": "https://x.com/JAMANeuro/status/2038979630250500381"
    },
]

for post in posts:
    c.execute("""
        INSERT INTO x_posts (scraped_at, search_query, author, handle, post_date, text_snippet, replies, reposts, likes, bookmarks, views, url)
        VALUES (:scraped_at, :search_query, :author, :handle, :post_date, :text_snippet, :replies, :reposts, :likes, :bookmarks, :views, :url)
    """, post)

conn.commit()
conn.close()

# Write markdown report
report_date = datetime.now().strftime('%Y-%m-%d')
md_content = f"""# X/Twitter Scrape Report — {report_date}

**Scraped at:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} UTC
**Searches (Top, since:today filter applied):** 2
- `neurointervention OR thrombectomy OR #Neurointervention OR #stroke`
- `cerebral AVM OR intracranial aneurysm OR endovascular`

---

## Summary

- **Total posts extracted:** {len(posts)}
- **High engagement (>50 likes):** 1

---

## High Engagement Posts (>50 likes)

| Author | Date | Likes | Reposts | Views | Summary |
|--------|------|-------|---------|-------|---------|
| Neurophilia (@bobvarkey) | Mar 4 | 54 | 12 | 2813 | Extended thrombectomy window: What the 2025-2026 trials tell us (DAWN, DEFENSE + new data) |

---

## All Posts by Search

### Search 1: neurointervention / thrombectomy / stroke

1. **Neurophilia (@bobvarkey)** — Mar 24
   URL: https://x.com/bobvarkey/status/2036428077698580963
   XCath made medical history: world's first REMOTE ROBOTIC STROKE PROCEDURE. A Neurointerventional surgeon performed a mechanical thrombectomy from 120 miles away using the XCath Iris Surgical Robotic System.
   Likes: 3 | Reposts: 0 | Views: 518

2. **Neurophilia (@bobvarkey)** — Mar 20
   URL: https://x.com/bobvarkey/status/2034995078868214252
   Comparing stent retrievers (SR), contact aspiration (Asp), and combined MT (cMT) for LVO ischemic stroke. Network Meta-Analysis (24 studies, 12,845 patients).
   Likes: 2 | Reposts: 1 | Views: 826

3. **Neurophilia (@bobvarkey)** — Mar 4 ⭐ HIGH ENGAGEMENT
   URL: https://x.com/bobvarkey/status/2029097798671675652
   Extended thrombectomy window: What the 2025-2026 trials tell us. DAWN and DEFENSE changed everything. Wake-up stroke & late presentation now have evidence for thrombectomy.
   Likes: 54 | Reposts: 12 | Bookmarks: 42 | Views: 2813

4. **JNIS (@JNIS_BMJ)** — Dec 16, 2025
   URL: https://x.com/JNIS_BMJ/status/2000663929077321851
   Restenosis after EVT for sICAS: Salvage EVT was 100% technically successful with no complications but outcomes differed by strategy. Is Balloon angioplasty + stenting the answer?
   Likes: 22 | Reposts: 6 | Views: 2056

### Search 2: cerebral AVM / intracranial aneurysm / endovascular

5. **Dorian (@wolfstarmoons)** — ~26 min ago
   URL: https://x.com/wolfstarmoons/status/2040128999184027724
   Replying to discussion on thoracic aneurysm: bulge in the aorta in chest. If it pops, instant death.
   Likes: 0 | Reposts: 0 | Views: 2188

6. **Osman Ahmed (@TheRealDoctorOs)** — Mar 28
   URL: https://x.com/TheRealDoctorOs/status/2037912173976981915
   Hot take: Lytics were never dead, industry just lied to you. #irad
   Likes: 11 | Reposts: 2 | Views: 1590

7. **JAMA Neurology (@JAMANeuro)** — Apr 1
   URL: https://x.com/JAMANeuro/status/2039311819693560254
   Endovascular thrombectomy for acute Stroke: early (<6h) vs delayed (6-12h) extubation did not improve 90-day functional independence, hospital stay, complication rates, or mortality.
   Likes: 27 | Reposts: 6 | Views: 2920

8. **AshuJadhav (@AshuPJadhav)** — Jun 9, 2023
   URL: https://x.com/AshuPJadhav/status/1667221816455344129
   Temporal trends in results of endovascular treatment of anterior intracranial large cerebral vessel occlusion: A 7-year study.
   Likes: 4 | Reposts: 3 | Views: 2088

9. **Shadi Yaghi (@ShadiYaghi2)** — Apr 2
   URL: https://x.com/ShadiYaghi2/status/2039476432221397412
   For young patients with no risk factors: would get high resolution VWI to rule out intracranial dissection rather than assuming athero. Agrees with aspirin and risk factor control.
   Likes: 0 | Reposts: 0 | Views: 21

10. **JAMA Neurology (@JAMANeuro)** — Mar 31
    URL: https://x.com/JAMANeuro/status/2038979630250500381
    Early vs delayed extubation after thrombectomy for acute ischemic stroke did not improve outcomes.
    Likes: 29 | Reposts: 11 | Views: 2787

---

*Report generated by OpenClaw cron job — X Neurointervention Scrape — {datetime.now().isoformat()}*
"""

os.makedirs(md_dir, exist_ok=True)
with open(md_path, "w") as f:
    f.write(md_content)

print(f"Done. {len(posts)} posts saved to {db_path}")
print(f"Markdown report saved to {md_path}")
