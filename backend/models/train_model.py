import os, pickle, numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from .preprocess import MODEL_FEATURES

def synth(n=1000):
    X, y = [], []
    rng = np.random.default_rng(42)
    for _ in range(n):
        rssi = -60 + rng.normal(0, 4, size=5)
        entropy = 0.6 + rng.normal(0, 0.07)
        prox = abs(rng.normal(1.2, 0.6))
        X.append(list(rssi)+[entropy,prox]); y.append(1)
    for _ in range(n):
        rssi = -70 + rng.normal(0, 10, size=5)
        entropy = 0.6 + rng.normal(0.18, 0.12)
        prox = abs(rng.normal(3.8, 1.2))
        X.append(list(rssi)+[entropy,prox]); y.append(0)
    return np.array(X), np.array(y)

def main():
    X, y = synth(1200)
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=1337, stratify=y)
    clf = RandomForestClassifier(n_estimators=200, max_depth=8, random_state=1337)
    clf.fit(Xtr, ytr)
    pred = clf.predict(Xte)
    acc = accuracy_score(yte, pred)
    print("Accuracy:", acc)
    with open(os.path.join(os.path.dirname(__file__), "fusion_model.pkl"), "wb") as f:
        pickle.dump(clf, f)

if __name__ == "__main__":
    main()
