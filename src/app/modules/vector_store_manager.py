import chromadb
from chromadb.utils import embedding_functions
from tqdm import tqdm
from typing import List, Dict, Any
from chromadb.api.types import QueryResult


class VectorStoreManager:
    def __init__(self, persist_dir: str, collection_name: str = "cancer_docs") -> None:
        self.client = chromadb.PersistentClient(path=persist_dir)

        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
            device="cpu",
        )

        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn,  # type: ignore[arg-type]
            metadata={"hnsw:space": "cosine"},
        )
        print(
            f"Colección '{collection_name}' cargada/creada. Documentos existentes: {self.collection.count()}"
        )

    def add_documents(
        self, ids: List[str], documents: List[str], metadatas: List[Dict[str, Any]]
    ) -> None:  # <-- CORREGIDO: Tipos de argumentos y -> None
        """
        Añade documentos a la colección en lotes para evitar errores de tamaño.
        """
        if not documents:
            print("No hay nuevos documentos para añadir.")
            return

        batch_size = 4000
        total_docs = len(documents)

        print(
            f"Añadiendo {total_docs} nuevos chunks a la colección en lotes de {batch_size}..."
        )

        for i in tqdm(
            range(0, total_docs, batch_size), desc="Añadiendo lotes a ChromaDB"
        ):
            batch_ids = ids[i : i + batch_size]
            batch_docs = documents[i : i + batch_size]
            batch_metas = metadatas[i : i + batch_size]

            self.collection.add(
                ids=batch_ids, documents=batch_docs, metadatas=batch_metas  # type: ignore[arg-type]
            )

        print(f"¡Éxito! Tamaño actual de la colección: {self.collection.count()}")

    def query(self, question: str, top_k: int = 4) -> QueryResult:
        """
        Realiza una búsqueda semántica en la colección.
        """
        results: QueryResult = self.collection.query(
            query_texts=[question],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        return results
