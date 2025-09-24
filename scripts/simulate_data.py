# import json,datetime,random,os

# store = "data/processed/decisions_store.json"
# items = []
# ts = datetime.datetime.utcnow()
# for i in range(20):
#     trust = round(random.uniform(0.35,0.95),2)
#     result = "safe" if trust>=0.50 else "anomalous"
#     note = "OK" if result=="safe" else random.choice(["Noise","Wi-Fi drift","Watch lost"])
#     items.append({
#         "timestamp":(ts-datetime.timedelta(minutes=i*2)).isoformat()+"Z",
#         "trust":trust,"result":result,"note":note
#     })
# with open(store,"w") as f:
#     json.dump({"items":items},f,indent=2)
# print("Wrote",store)
