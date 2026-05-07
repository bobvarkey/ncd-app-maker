import sqlite3
import re

db_path = "/Users/bobvarkey/.openclaw/workspace/memory_x_posts.db"

# Query 1 posts (neurointervention / thrombectomy / stroke)
query1_posts = [
    {
        "query": "neurointervention OR thrombectomy OR #Neurointervention OR #stroke",
        "posts": [
            {
                "handle": "Neurophilia @bobvarkey",
                "date": "2026-05-06T12:01:10.000Z",
                "text": "Neurology was a scary subject during my undergraduation. Our fervent prayer was not to get a hemiplegic patient...",
                "url": "https://x.com/bobvarkey/status/2051995688293326943",
                "reply": 0, "retweet": 0, "like": 3,
                "author": "Neurophilia"
            },
            {
                "handle": "إبراهيم الحربي Ibrahim Alharbi @Dr_ibrahimHarbi",
                "date": "2026-05-06T10:55:03.000Z",
                "text": "Saddle PE extending bilaterally on CT with hemodynamic compromise. PERT activation → catheter-directed thrombectomy. Sharing a concise overview of current PE devices & landmark trials.",
                "url": "https://x.com/Dr_ibrahimHarbi/status/2051979049061273990",
                "reply": 0, "retweet": 1, "like": 11,
                "author": "إبراهيم الحربي Ibrahim Alharbi"
            },
            {
                "handle": "Talha Badar @TalhaBadarMD",
                "date": "2026-05-06T12:28:00.000Z",
                "text": "Happy to share our chapter in the 2nd edition of Classical Hematology: Hemostasis Disturbances in Acute Leukemias and Myelodysplastic Neoplasms...",
                "url": "https://x.com/TalhaBadarMD/status/2052002440262652043",
                "reply": 0, "retweet": 0, "like": 0,
                "author": "Talha Badar"
            },
            {
                "handle": "International Journal of Stroke @IntJStroke",
                "date": "2026-05-06T11:21:00.000Z",
                "text": "Meta-analysis of RCTs: In patients without clear anticoagulation indication, coagulation-pathway therapies did not reduce covert brain infarcts (CBI) vs antiplatelets...",
                "url": "https://x.com/IntJStroke/status/2051985577122431187",
                "reply": 0, "retweet": 0, "like": 0,
                "author": "International Journal of Stroke"
            },
            {
                "handle": "NeuroNews @NN_publishing",
                "date": "2026-05-06T10:00:28.000Z",
                "text": "New findings from the @TECNO_Trial reveal that giving TNK in patients with incomplete reperfusion after thrombectomy is safe but ultimately does not lead to improved early (25 min) nor late (24hr) reperfusion #ESOC2026 @ESOstroke",
                "url": "https://x.com/NN_publishing/status/2051965313055404073",
                "reply": 0, "retweet": 4, "like": 4,
                "author": "NeuroNews"
            },
            {
                "handle": "Al Mayadeen Español @almayadeen_es",
                "date": "2026-05-06T12:00:01.000Z",
                "text": "They Create Patch That Activates Natural Repair After Brain Stroke. The implant, successfully tested in preclinical models, attracts stem cells to the damaged area...",
                "url": "https://x.com/almayadeen_es/status/2051995397632258211",
                "reply": 0, "retweet": 2, "like": 1,
                "author": "Al Mayadeen Español"
            }
        ]
    },
    {
        "query": "cerebral AVM OR intracranial aneurysm OR endovascular",
        "posts": [
            {
                "handle": "FIBMED @fibmed",
                "date": "2026-05-06T08:17:09.000Z",
                "text": "Endovascular treatment for medium or distal vessel occlusion stroke (DISTAL): 12-month outcomes of a multicentre, open-label, randomised trial - The Lancet Neurology",
                "url": "https://x.com/fibmed/status/2051939311029776501",
                "reply": 0, "retweet": 0, "like": 0,
                "author": "FIBMED"
            },
            {
                "handle": "CV Section @cvsection",
                "date": "2026-05-03T20:12:06.000Z",
                "text": "Feasibility of Middle Meningeal Artery Embolization With n-Butyl Cyanoacrylate for Refractory Chronic Migraine: MIGRAINE Study Preliminary Results #CVSection #AANS2026 #AANS",
                "url": "https://x.com/cvsection/status/2051032069128495289",
                "reply": 0, "retweet": 6, "like": 23,
                "author": "CV Section"
            },
            {
                "handle": "Akshit sharma @Akshitaiims",
                "date": "2026-05-03T09:21:22.000Z",
                "text": "Ever had a self-expanding stent kink at the aortic bifurcation? A complex aortoiliac case: from initial CTO crossover to a staged Kissing Stent rescue #IRad #VascularSurgery #Endovascular #tweetorial",
                "url": "https://x.com/Akshitaiims/status/2050868308669538785",
                "reply": 1, "retweet": 0, "like": 0,
                "author": "Akshit sharma"
            },
            {
                "handle": "AJNR @TheAJNR",
                "date": "2026-05-05T15:00:01.000Z",
                "text": "Predicting Vasospasm and Delayed Cerebral Ischemia in Aneurysmal SAH: The Role of Vessel Wall MRI",
                "url": "https://x.com/TheAJNR/status/2051678309293969682",
                "reply": 1, "retweet": 14, "like": 31,
                "author": "AJNR"
            },
            {
                "handle": "Supreme Vascular @supremevascular",
                "date": "2026-05-05T06:28:37.000Z",
                "text": "Treatment Tuesday: Brain aneurysm care without open surgery? #Endovasculartreatment uses image-guided techniques from within blood vessels...",
                "url": "https://x.com/supremevascular/status/2051549610351665472",
                "reply": 0, "retweet": 0, "like": 0,
                "author": "Supreme Vascular and Interventional Clinic"
            },
            {
                "handle": "Jon George @jcgeorgemd",
                "date": "2026-05-03T22:38:49.000Z",
                "text": "Mile 2: Temple University Hospital where I completed my Interventional Cardiology and Endovascular Medicine Fellowship @TempleHealth",
                "url": "https://x.com/jcgeorgemd/status/2051068994023481775",
                "reply": 1, "retweet": 0, "like": 2,
                "author": "Jon George"
            },
            {
                "handle": "AJNR @TheAJNR",
                "date": "2026-04-29T15:00:21.000Z",
                "text": "ICA aneurysms that are attached to the ophthalmic arteries, superior hypophyseal arteries, or the PComA may be more likely to grow and exhibit a faster rate of growth.",
                "url": "https://x.com/TheAJNR/status/2049504064061247683",
                "reply": 0, "retweet": 0, "like": 0,
                "author": "AJNR"
            },
            {
                "handle": "Robbie Aru, M.D. @AruRobbie",
                "date": "2026-05-05T15:01:56.000Z",
                "text": "Great talk by Dr Amna Ali on management of 7cm ascending aortic graft side branch pseudoaneurysm with zone 0 TEVAR under rapid ventricular pacing...",
                "url": "https://x.com/AruRobbie/status/2051678791051710967",
                "reply": 1, "retweet": 0, "like": 13,
                "author": "Robbie Aru, M.D."
            },
            {
                "handle": "Endovascular Today @EVToday",
                "date": "2026-05-05T19:30:00.000Z",
                "text": "Perspectives from AAA-SHAPE investigators on sex-based differences in AAA, gaps in representation, and implications for EVAR & device innovation. #Sponsored",
                "url": "https://x.com/EVToday/status/2051746250081366225",
                "reply": 1, "retweet": 0, "like": 2,
                "author": "Endovascular Today"
            },
            {
                "handle": "AJNR @TheAJNR (older)",
                "date": "2014-06-12T11:35:29.000Z",
                "text": "Hemorrhagic Complications after Endovascular Treatment of Cerebral Arteriovenous Malformations",
                "url": "https://x.com/TheAJNR/status/477051560451932160",
                "reply": 0, "retweet": 1, "like": 0,
                "author": "AJNR"
            },
            {
                "handle": "Dr. KM Cherian Institute @kmcims",
                "date": "2026-05-06T07:11:54.000Z",
                "text": "Endovascular Coiling - non-surgical treatment for brain hemorrhage. Dr. Jaimi Abraham - Consultant Interventional Radiologist, Dr. KMC Hospital, Chengannur.",
                "url": "https://x.com/kmcims/status/2051922888492740631",
                "reply": 0, "retweet": 0, "like": 0,
                "author": "Dr. KM Cherian Institute of Medical Sciences"
            },
            {
                "handle": "Neurology Journal @GreenJournal",
                "date": "2026-04-29T13:44:38.000Z",
                "text": "This #NeurologyRF case highlights the value of 7T MRI in diagnosis of basilar artery perforator aneurysm by detecting subtle hemoglobin degradation products...",
                "url": "https://x.com/GreenJournal/status/2049485009686298879",
                "reply": 1, "retweet": 6, "like": 21,
                "author": "Neurology Journal"
            }
        ]
    }
]

conn = sqlite3.connect(db_path)
c = conn.cursor()

new_count = 0
for qd in query1_posts:
    for p in qd["posts"]:
        try:
            c.execute("""
                INSERT OR IGNORE INTO x_posts (query, author, handle, post_date, text, url, reply_count, retweet_count, like_count)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                qd["query"],
                p["author"],
                p["handle"],
                p["date"],
                p["text"],
                p["url"],
                p["reply"],
                p["retweet"],
                p["like"]
            ))
            if c.rowcount > 0:
                new_count += 1
        except Exception as e:
            print(f"Error inserting {p['url']}: {e}")

conn.commit()
conn.close()
print(f"Inserted {new_count} new posts successfully!")
