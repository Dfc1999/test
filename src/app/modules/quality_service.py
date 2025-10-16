import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Dict, Any


class MLQualityLayer:
    def __init__(self, contamination: float = 0.05) -> None:
        self.anomaly_detector = IsolationForest(
            contamination=contamination, random_state=42
        )
        self.is_fitted: bool = False

    def fit_anomaly_detector(self, embeddings: np.ndarray) -> None:
        """
        Entrena el detector de anomalías con los embeddings existentes.
        """
        if embeddings.shape[0] == 0:
            print("No hay embeddings para entrenar el detector de anomalías.")
            return
        print("Entrenando el detector de anomalías...")
        self.anomaly_detector.fit(embeddings)
        self.is_fitted = True
        print("Detector de anomalías entrenado.")

    def check_quality(self, text: str, embedding: np.ndarray) -> Dict[str, Any]:
        """
        Ejecuta las comprobaciones de calidad para un único chunk de texto.
        """
        results: Dict[str, Any] = {"is_anomaly": False}

        if self.is_fitted:
            prediction = self.anomaly_detector.predict(embedding.reshape(1, -1))
            results["is_anomaly"] = bool(prediction[0] == -1)
        else:
            results["is_anomaly"] = None

        text_len = len(text.split())
        if text_len < 25:
            results["quality_score"] = "low"
        elif text_len < 100:
            results["quality_score"] = "medium"
        else:
            results["quality_score"] = "high"

        return results
