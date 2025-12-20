import sys
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer('all-MiniLM-L6-v2')
index = faiss.read_index('doc_index.faiss')
query = ' '.join(sys.argv[1:])
query_emb = model.encode([query])
D, I = index.search(np.array(query_emb), k=5)
for i, d in zip(I[0], D[0]):
    print(f"Result {i}: Distance {d}")