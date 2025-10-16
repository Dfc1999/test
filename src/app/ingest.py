import os
import numpy as np
from tqdm import tqdm
from typing import List, Dict, Any

from app.modules.vector_store_manager import VectorStoreManager
from app.modules.quality_service import MLQualityLayer
from app.api.ingestion_service import IngestionService

DOCS_DIR = "app/data/docs"
PERSIST_DIR = "app/data/chroma_db"
COLLECTION_NAME = "cancer_docs"


def main() -> None:
    """
    Función principal que orquesta el proceso de ingesta desde la CLI,
    utilizando el mismo servicio que la API para asegurar consistencia.
    """
    vector_store = VectorStoreManager(PERSIST_DIR, COLLECTION_NAME)
    quality_layer = MLQualityLayer()

    if vector_store.collection.count() > 10:
        print("Entrenando detector de anomalías con datos existentes...")
        embeddings = vector_store.collection.get(include=["embeddings"])["embeddings"]
        quality_layer.fit_anomaly_detector(np.array(embeddings))
    else:
        print("No hay suficientes datos para entrenar el detector de anomalías.")

    ingestion_service = IngestionService(vector_store, quality_layer)

    files_to_ingest = []
    print(f"Buscando documentos en '{DOCS_DIR}'...")
    for root, _, files in os.walk(DOCS_DIR):
        for file in files:
            if file.lower().endswith((".pdf", ".txt")):
                files_to_ingest.append(os.path.join(root, file))

    if not files_to_ingest:
        print(f"No se encontraron documentos en '{DOCS_DIR}'.")
        return

    print(f"Se encontraron {len(files_to_ingest)} archivos para procesar.")

    for file_path in tqdm(files_to_ingest, desc="Procesando archivos vía CLI"):
        try:
            with open(file_path, "rb") as f:
                filename = os.path.basename(file_path)
                ingestion_service.process_and_store_file(f, filename)
        except Exception as e:
            print(f"\nError procesando el archivo {file_path}: {e}")


if __name__ == "__main__":
    main()
