import random

# Simulate watch proximity data
def get_watch_proximity():
    prox = abs(random.gauss(1.2,0.6))
    if random.random() < 0.2:
        prox += random.uniform(1.5,3.5)
    return round(prox,2)
