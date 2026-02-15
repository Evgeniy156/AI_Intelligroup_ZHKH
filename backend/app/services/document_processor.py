import io
import PyPDF2
from docx import Document as DocxDocument
from typing import List

class DocumentProcessor:
    """
    Service for extracting and chunking text from various document formats.
    Supports PDF, DOCX, and TXT.
    """
    def extract_text(self, file_content: bytes, file_extension: str) -> str:
        """
        Extracts plain text from the given file content based on its extension.
        """
        if file_extension.lower() == ".pdf":
            return self._extract_from_pdf(file_content)
        elif file_extension.lower() == ".docx":
            return self._extract_from_docx(file_content)
        elif file_extension.lower() == ".txt":
            return file_content.decode("utf-8", errors="ignore")
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")

    def _extract_from_pdf(self, content: bytes) -> str:
        reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    def _extract_from_docx(self, content: bytes) -> str:
        doc = DocxDocument(io.BytesIO(content))
        return "\n".join([para.text for para in doc.paragraphs])

    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """
        Splits text into chunks of specified size with overlap.
        """
        chunks = []
        if not text:
            return chunks
        
        # Simple character-based chunking for now
        # In production, sentence-based or semantic chunking is preferred
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start = end - overlap
            if start < 0: start = 0
            if end >= len(text): break
            
        return chunks

document_processor = DocumentProcessor()
