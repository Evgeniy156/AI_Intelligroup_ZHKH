import re
from typing import Dict, List, Tuple

class PIIService:
    """
    Service for robust PII (Personally Identifiable Information) masking and unmasking.
    Complies with ФЗ-152 requirements.
    """
    def __init__(self):
        # Patterns for Russian PII
        self.patterns = {
            "PHONE": r'(\+7|8)[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2,4}[\s\-]?\d{2,4}',
            "EMAIL": r'[\w\.-]+@[\w\.-]+\.\w+',
            "PASSPORT": r'\b\d{4}\s\d{6}\b',
            "INN": r'\b\d{10,12}\b',
            "CARD": r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',
        }
        
    def mask(self, text: str) -> Tuple[str, Dict[str, str]]:
        """
        Masks PII in text and returns the masked text plus a mapping for unmasking.
        """
        mapping = {}
        counter = 1
        masked_text = text
        
        for pii_type, pattern in self.patterns.items():
            matches = list(set(re.findall(pattern, masked_text)))
            for match in matches:
                placeholder = f"<{pii_type}_{counter}>"
                mapping[placeholder] = match
                masked_text = masked_text.replace(match, placeholder)
                counter += 1
                
        # Note: Name detection (NER) would be better handled with a model like SpaCy or Natasha.
        # For now, we enhance the regex but plan for NER integration.
        
        return masked_text, mapping

    def unmask(self, masked_text: str, mapping: Dict[str, str]) -> str:
        """
        Restores PII in masked text using the provided mapping.
        """
        text = masked_text
        for placeholder, original in mapping.items():
            text = text.replace(placeholder, original)
        return text

pii_service = PIIService()
