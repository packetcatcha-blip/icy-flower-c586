"""
Route Availability Evaluator
Tests HTTP status codes and response validity for all routes
"""

import requests
from typing import Dict, Any, Optional
from bs4 import BeautifulSoup
import json

class RouteAvailabilityEvaluator:
    """
    Evaluates route availability by checking HTTP status codes
    
    Required data columns: endpoint, method, expected_status
    """
    
    def __init__(self, base_url: str = "https://icy-flower-c586.jsellers.workers.dev", 
                 timeout: int = 30):
        """
        Initialize evaluator
        
        Args:
            base_url: Base URL of the worker
            timeout: Request timeout in seconds
        """
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
    
    def __call__(self, *, endpoint: str, method: str = "GET", 
                 expected_status: int = 200, **kwargs) -> Dict[str, Any]:
        """
        Evaluate route availability
        
        Args:
            endpoint: Route path (e.g., "/sales-portal")
            method: HTTP method (GET, POST, etc)
            expected_status: Expected HTTP status code
            **kwargs: Additional parameters (ignored)
        
        Returns:
            Dictionary with evaluation results
        """
        try:
            # Allow full URLs in endpoint (test custom domains) or relative endpoints
            if str(endpoint).lower().startswith('http'):
                url = endpoint
            else:
                url = f"{self.base_url}{endpoint}"
            
            if method.upper() == "GET":
                response = requests.get(url, timeout=self.timeout, allow_redirects=True)
            elif method.upper() == "POST":
                response = requests.post(url, timeout=self.timeout, json=kwargs.get("body", {}))
            else:
                return {
                    "status_match": False,
                    "actual_status": 0,
                    "expected_status": expected_status,
                    "error": f"Unsupported method: {method}",
                    "score": 0
                }
            
            # Check if status matches expected
            status_match = response.status_code == expected_status
            
            # Check if response has content
            has_content = len(response.text) > 0
            
            # Calculate score (0-1)
            score = 1.0 if (status_match and has_content) else 0.0
            
            return {
                "status_match": status_match,
                "actual_status": response.status_code,
                "expected_status": expected_status,
                "has_content": has_content,
                "content_length": len(response.text),
                "score": score,
                "error": None
            }
        
        except requests.Timeout:
            return {
                "status_match": False,
                "actual_status": 0,
                "expected_status": expected_status,
                "error": "Request timeout",
                "score": 0
            }
        except Exception as e:
            return {
                "status_match": False,
                "actual_status": 0,
                "expected_status": expected_status,
                "error": str(e),
                "score": 0
            }


class FeatureCompletenessEvaluator:
    """
    Evaluates feature completeness by checking for expected content in responses
    
    Required data columns: endpoint, expected_contains (list of expected strings)
    """
    
    def __init__(self, base_url: str = "https://icy-flower-c586.jsellers.workers.dev",
                 timeout: int = 30):
        """Initialize evaluator"""
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
    
    def __call__(self, *, endpoint: str, expected_contains: list = None, 
                 expected_status: int = 200, **kwargs) -> Dict[str, Any]:
        """
        Evaluate feature completeness
        
        Args:
            endpoint: Route path
            expected_contains: List of strings that should appear in response
            expected_status: Expected HTTP status
            **kwargs: Additional parameters
        
        Returns:
            Dictionary with evaluation results
        """
        if expected_contains is None:
            expected_contains = []
        
        try:
            # Allow full URLs in endpoint (test custom domains) or relative endpoints
            if str(endpoint).lower().startswith('http'):
                url = endpoint
            else:
                url = f"{self.base_url}{endpoint}"
            response = requests.get(url, timeout=self.timeout)
            
            # Check status
            status_ok = response.status_code == expected_status
            
            # Check for expected content
            text = response.text.lower()
            found_content = []
            missing_content = []
            
            for expected_str in expected_contains:
                if expected_str.lower() in text:
                    found_content.append(expected_str)
                else:
                    missing_content.append(expected_str)
            
            # Calculate score
            content_match_rate = len(found_content) / len(expected_contains) if expected_contains else 1.0
            score = 1.0 if (status_ok and content_match_rate == 1.0) else content_match_rate * 0.5
            
            return {
                "status_ok": status_ok,
                "actual_status": response.status_code,
                "expected_content_count": len(expected_contains),
                "found_content_count": len(found_content),
                "missing_content": missing_content,
                "content_match_rate": content_match_rate,
                "score": score
            }
        
        except Exception as e:
            return {
                "status_ok": False,
                "error": str(e),
                "content_match_rate": 0.0,
                "score": 0
            }
