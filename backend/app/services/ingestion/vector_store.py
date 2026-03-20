import faiss
import numpy as np

class VectorStore:
    def __init__(self, dim=384):
        self.index = faiss.IndexFlatL2(dim)

    def add(self, vectors):
        self.index.add(np.array(vectors))

    def search(self, query, k=5):
        D, I = self.index.search(np.array([query]), k)
        return I