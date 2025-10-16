from app.modules.vector_store_manager import VectorStoreManager
from typing import List, Dict, Any, cast


class QueryService:
    def __init__(self, vector_store: VectorStoreManager) -> None:
        self.vector_store = vector_store

    def find_relevant_documents(
        self, question: str, top_k: int
    ) -> List[Dict[str, Any]]:
        print(
            f"Buscando en la base de conocimiento: '{question}'"
        )  # <-- Asegúrate de tener esta línea

        query_results: Dict[Any, Any] = cast(
            Dict[Any, Any], self.vector_store.query(question=question, top_k=top_k)
        )
        formatted_results: List[Dict[str, Any]] = []

        if (
            query_results.get("documents")
            and isinstance(query_results["documents"], list)
            and query_results["documents"]
            and query_results["documents"][0] is not None
        ):
            for i in range(len(query_results["documents"][0])):

                distance = (
                    query_results["distances"][0][i]
                    if query_results.get("distances") and query_results["distances"]
                    else 0.0
                )
                metadata = (
                    query_results["metadatas"][0][i]
                    if query_results.get("metadatas") and query_results["metadatas"]
                    else {}
                )

                result_item = {
                    "content": query_results["documents"][0][i],
                    "distance": round(distance, 4),
                }

                result_item.update(metadata)

                formatted_results.append(result_item)

        return formatted_results
