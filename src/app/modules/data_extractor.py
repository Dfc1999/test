import os
import re
from typing import List, Dict, Tuple, Any
from pypdf import PdfReader


def clean_text_before_chunking(text: str) -> str:
    """
    Limpia el texto extraído para eliminar patrones no deseados como
    diferentes tipos de encabezados, pies de página y separadores.
    """
    lines = text.split("\n")
    cleaned_lines = []

    for line in lines:
        line_stripped = line.strip()
        line_lower = line_stripped.lower()

        if (
            "cancer.org" in line_lower
            or "1.800.227.2345" in line_lower
            or line_lower == "american cancer society"
        ):
            continue

        if re.fullmatch(r"[_]{10,}", line_stripped):
            continue

        if re.search(r"^\d{1,2}/\d{1,2}/\d{2,4},\s*\d{1,2}:\d{2}$", line_stripped):
            continue

        if line_stripped.startswith("http://") or line_stripped.startswith("https://"):
            continue

        if re.fullmatch(r"\d{1,3}/\d{1,3}", line_stripped):
            continue

        cleaned_lines.append(line)

    return "\n".join(cleaned_lines)


def read_pdf(path: str) -> List[Tuple[str, Dict[str, Any]]]:
    """
    Devuelve lista de texto, metadata por página de un PDF,
    aplicando la limpieza a cada página.
    """
    chunks: List[Tuple[str, Dict[str, Any]]] = []
    try:
        reader = PdfReader(path)
        for i, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            cleaned_text = clean_text_before_chunking(text)

            lines = cleaned_text.split("\n")
            if len(lines) > 1 and "tratamiento del cáncer de" in lines[0].lower():
                cleaned_text = "\n".join(lines[1:])

            cleaned_text = cleaned_text.strip()
            if cleaned_text:
                chunks.append(
                    (cleaned_text, {"source": os.path.basename(path), "page": i})
                )
    except Exception as e:
        print(f"Error leyendo el PDF {path}: {e}")
    return chunks


def read_txt(path: str) -> List[Tuple[str, Dict[str, Any]]]:
    """
    Devuelve una lista con (texto, metadata) para un archivo TXT,
    aplicando una limpieza previa.
    """
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
        cleaned_text = clean_text_before_chunking(text)
        return (
            [(cleaned_text.strip(), {"source": os.path.basename(path)})]
            if cleaned_text.strip()
            else []
        )
    except Exception as e:
        print(f"Error leyendo el TXT {path}: {e}")
        return []
