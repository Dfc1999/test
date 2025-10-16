import logging
import os
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict, Any, IO, Optional

from app.modules.vector_store_manager import VectorStoreManager
from app.modules.quality_service import MLQualityLayer
from app.api.query_service import QueryService
from app.api.ingestion_service import IngestionService

PERSIST_DIR = "app/data/chroma_db"
COLLECTION_NAME = "cancer_docs"

app = FastAPI(
    title="Smart Document Management API",
    description="API para la ingesta y búsqueda inteligente de documentos sobre tratamientos de cáncer.",
    version="1.1.0",
)

vector_store_manager = VectorStoreManager(PERSIST_DIR, COLLECTION_NAME)

quality_layer = MLQualityLayer()

if vector_store_manager.collection.count() > 10:
    print("Datos existentes encontrados, entrenando el detector de anomalías...")
    existing_embeddings = vector_store_manager.collection.get(include=["embeddings"])[
        "embeddings"
    ]
    quality_layer.fit_anomaly_detector(np.array(existing_embeddings))
else:
    print(
        "No hay suficientes datos para entrenar el detector de anomalías. Se omitirá en la ingesta inicial."
    )

query_service = QueryService(vector_store=vector_store_manager)
ingestion_service = IngestionService(
    vector_store=vector_store_manager, quality_layer=quality_layer
)


class QueryRequest(BaseModel):
    question: str
    top_k: int = 4


class QueryResponse(BaseModel):
    results: List[Dict[str, Any]]


@app.post("/upload", status_code=201)
def upload_documents(files: List[UploadFile] = File(...)) -> Dict[str, Any]:
    """
    Endpoint para subir y procesar uno o más documentos (PDF o TXT).
    """
    processed_files = []
    errors = []

    for file in files:
        try:
            filename_str: str = (
                file.filename if file.filename is not None else "unknown_file"
            )
            ingestion_service.process_and_store_file(file.file, filename_str)
            processed_files.append(file.filename)
        except Exception as e:
            logging.error(f"Error procesando el archivo {file.filename}: {e}")
            errors.append({"filename": file.filename, "error": str(e)})

    if not processed_files:
        raise HTTPException(
            status_code=500,
            detail={"message": "No se pudo procesar ningún archivo.", "errors": errors},
        )

    return {
        "message": f"Procesamiento completado. Archivos exitosos: {len(processed_files)}",
        "processed_files": processed_files,
        "errors": errors,
    }


@app.post("/query", response_model=QueryResponse)
def query_knowledge_base(request: QueryRequest) -> QueryResponse:
    """
    Endpoint para recibir una pregunta. No contiene lógica, solo llama al servicio.
    """
    try:
        results = query_service.find_relevant_documents(
            question=request.question, top_k=request.top_k
        )
        return QueryResponse(results=results)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Ocurrió un error en el servidor: {e}"
        )


@app.get("/", include_in_schema=False)
def root() -> Dict[str, str]:
    return {
        "message": "Controlador de la API funcionando. Ve a /docs para la documentación."
    }
