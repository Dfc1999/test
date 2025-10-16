import os
import numpy as np
from typing import IO, List, Dict, Any
import shutil

from app.modules.data_extractor import read_pdf, read_txt
from app.modules.chunk_generator import chunkify, hash_id
from app.modules.vector_store_manager import VectorStoreManager
from app.modules.quality_service import MLQualityLayer


class IngestionService:
    def __init__(
        self, vector_store: VectorStoreManager, quality_layer: MLQualityLayer
    ) -> None:
        self.vector_store = vector_store
        self.quality_layer = quality_layer
        self.chunk_size = 1000
        self.chunk_overlap = 200

    def process_and_store_file(self, file: IO[bytes], filename: str) -> None:
        """
        Orquesta el proceso completo de ingesta para un único archivo subido.
        """
        UPLOADS_DIR = "app/data/docs/uploads"
        os.makedirs(UPLOADS_DIR, exist_ok=True)

        print(f"Iniciando el procesamiento para el archivo: {filename}")

        temp_path = f"temp_{filename}"
        with open(temp_path, "wb") as buffer:
            buffer.write(file.read())

        if filename.lower().endswith(".pdf"):
            pages = read_pdf(temp_path)
        elif filename.lower().endswith(".txt"):
            pages = read_txt(temp_path)
        else:
            os.remove(temp_path)
            raise ValueError("Formato de archivo no soportado. Usar PDF o TXT.")

        permanent_path = os.path.join(UPLOADS_DIR, filename)
        shutil.move(temp_path, permanent_path)
        print(f"Archivo original guardado en: {permanent_path}")

        if not pages:
            print(f"No se pudo extraer texto del archivo {filename}.")
            return

        all_chunks_text, all_chunks_meta, all_chunks_ids = [], [], []
        for text, metadata in pages:
            chunks = chunkify(text, self.chunk_size, self.chunk_overlap)
            for i, chunk_text in enumerate(chunks):
                chunk_meta = metadata.copy()
                chunk_meta["chunk_index"] = i
                chunk_id = hash_id(chunk_text, chunk_meta)
                all_chunks_text.append(chunk_text)
                all_chunks_meta.append(chunk_meta)
                all_chunks_ids.append(chunk_id)

        if not all_chunks_text:
            print("No se generaron chunks del archivo.")
            return

        print(f"Añadiendo {len(all_chunks_text)} chunks a la base de datos")
        self.vector_store.add_documents(
            ids=all_chunks_ids, documents=all_chunks_text, metadatas=all_chunks_meta
        )

        print("Realizando análisis de calidad en los nuevos embeddings")
        newly_added = self.vector_store.collection.get(
            ids=all_chunks_ids, include=["embeddings"]
        )
        new_embeddings = np.array(newly_added["embeddings"])

        updated_metas = []
        for i, chunk_id in enumerate(all_chunks_ids):
            quality_results = self.quality_layer.check_quality(
                all_chunks_text[i], new_embeddings[i]
            )
            final_meta = all_chunks_meta[i].copy()
            final_meta.update(quality_results)
            updated_metas.append(final_meta)

        print("Actualizando metadata con los resultados del análisis de calidad")
        self.vector_store.collection.update(ids=all_chunks_ids, metadatas=updated_metas)  # type: ignore[arg-type]
        print(f"Procesamiento del archivo {filename} completado.")
