import re
import hashlib
from typing import List, Dict, Any


def sentence_smart_split(text: str) -> List[str]:
    """
    Divide por frases de forma simple (puntos, ? !) y limpia espacios.
    """
    parts = re.split(r"(?<=[\.\?\!])\s+", text)
    return [p.strip() for p in parts if p and not p.isspace()]


def chunkify(text: str, chunk_size: int = 1000, chunk_overlap: int = 200) -> List[str]:
    """
    Chunking por caracteres con solapamiento, intentando respetar límites de frase.
    """
    if not text:
        return []
    sents = sentence_smart_split(text) or [text]
    chunks, current = [], ""
    for s in sents:
        if len(current) + len(s) + 1 <= chunk_size:
            current = (current + " " + s).strip()
        else:
            if current:
                chunks.append(current)
            if chunk_overlap > 0 and chunks:
                tail = chunks[-1][-chunk_overlap:]
                current = (tail + " " + s).strip()
                if len(current) > chunk_size:
                    current = current[:chunk_size]
            else:
                current = s[:chunk_size]
    if current:
        chunks.append(current)
    return chunks


def hash_id(text: str, meta: Dict[str, Any]) -> str:
    """
    Crea un ID único para un chunk basado en su contenido y metadata.
    """
    raw = (meta.get("source", "") + str(meta.get("page", "")) + text).encode("utf-8")
    return hashlib.md5(raw).hexdigest()
