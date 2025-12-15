"""
Evaluation Configuration for sellersco.net
Manages model config, API keys, and evaluation settings
"""

import os
from dataclasses import dataclass
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

@dataclass
class ModelConfig:
    """Configuration for LLM models used in evaluation"""
    
    # Azure OpenAI Configuration
    use_azure: bool = True
    azure_deployment: str = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4")
    azure_endpoint: str = os.getenv("AZURE_OPENAI_ENDPOINT", "")
    azure_api_key: str = os.getenv("AZURE_OPENAI_API_KEY", "")
    azure_api_version: str = "2025-04-01-preview"
    
    # OpenAI Configuration (fallback)
    openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_base_url: Optional[str] = os.getenv("OPENAI_BASE_URL", None)
    
    # Default model type
    default_model_type: str = os.getenv("MODEL_TYPE", "azure")  # "azure" or "openai"

@dataclass
class EvaluationConfig:
    """Configuration for evaluation framework"""
    
    # Evaluation targets
    target_worker_url: str = os.getenv(
        "WORKER_URL", 
        "https://icy-flower-c586.jsellers.workers.dev"
    )
    
    # Data paths - use absolute or relative from working directory
    queries_file: str = "test-data/evaluation-queries.json"
    queries_jsonl_file: str = "test-data/evaluation-queries.jsonl"
    seo_framework_file: str = "test-data/seo-audit-framework.json"
    output_dir: str = "evaluation-results"
    
    # Evaluation settings
    timeout_seconds: int = 30
    max_retries: int = 3
    batch_size: int = 10
    
    # Target scores (for pass/fail)
    min_seo_score: float = 85.0
    min_availability_pass_rate: float = 0.95
    min_feature_pass_rate: float = 0.90
    min_data_freshness_pass_rate: float = 0.90
    
    # Content checks
    expected_content_keywords: dict = None
    
    def __post_init__(self):
        """Initialize derived fields"""
        os.makedirs(self.output_dir, exist_ok=True)
        
        if self.expected_content_keywords is None:
            self.expected_content_keywords = {
                "/": ["sellersco", "threat", "intelligence"],
                "/sales-portal": ["vendor", "recommendation", "CrowdStrike", "Palo Alto"],
                "/regulations": ["HIPAA", "PCI", "GDPR", "CMMC", "NIS2"],
                "/attack-patterns": ["attack", "threat", "pattern"],
                "/attack-map": ["OTX", "threat", "map"],
            }

# Global config instances
model_config = ModelConfig()
eval_config = EvaluationConfig()

def get_model_config():
    """Get model configuration"""
    return model_config

def get_eval_config():
    """Get evaluation configuration"""
    return eval_config
