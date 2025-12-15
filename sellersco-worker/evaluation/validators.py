"""
SEO Validator
Analyzes HTML responses for SEO compliance
"""

import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import re
from urllib.parse import urljoin

class SEOValidator:
    """
    Validates SEO implementation in HTML responses
    
    Checks: meta tags, schema, headings, images, responsiveness
    """
    
    def __init__(self, base_url: str = "https://icy-flower-c586.jsellers.workers.dev",
                 timeout: int = 30):
        """Initialize validator"""
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
    
    def __call__(self, *, endpoint: str, seo_checks: dict = None, **kwargs) -> Dict[str, Any]:
        """
        Validate SEO implementation
        
        Args:
            endpoint: Route path
            seo_checks: Dictionary of SEO checks to perform
            **kwargs: Additional parameters
        
        Returns:
            Dictionary with SEO validation results
        """
        if seo_checks is None:
            seo_checks = {}
        
        try:
            url = f"{self.base_url}{endpoint}"
            response = requests.get(url, timeout=self.timeout)
            
            if response.status_code != 200:
                return {"error": f"HTTP {response.status_code}", "score": 0}
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            results = {
                "url": url,
                "status": response.status_code,
                "checks": {}
            }
            
            # Check meta tags
            if seo_checks.get("has_title"):
                title = soup.find("title")
                results["checks"]["has_title"] = title is not None and len(title.text) > 0
            
            if seo_checks.get("has_meta_description"):
                meta_desc = soup.find("meta", attrs={"name": "description"})
                results["checks"]["has_meta_description"] = meta_desc is not None
            
            if seo_checks.get("has_og_tags"):
                og_title = soup.find("meta", attrs={"property": "og:title"})
                og_desc = soup.find("meta", attrs={"property": "og:description"})
                og_image = soup.find("meta", attrs={"property": "og:image"})
                results["checks"]["has_og_tags"] = (og_title and og_desc and og_image) is not None
            
            if seo_checks.get("has_charset"):
                charset = soup.find("meta", attrs={"charset": True})
                results["checks"]["has_charset"] = charset is not None
            
            if seo_checks.get("has_viewport"):
                viewport = soup.find("meta", attrs={"name": "viewport"})
                results["checks"]["has_viewport"] = viewport is not None
            
            # Check heading structure
            if seo_checks.get("has_single_h1"):
                h1_tags = soup.find_all("h1")
                results["checks"]["has_single_h1"] = len(h1_tags) == 1
                results["h1_count"] = len(h1_tags)
            
            if seo_checks.get("proper_heading_hierarchy"):
                h_tags = soup.find_all(["h1", "h2", "h3", "h4", "h5", "h6"])
                hierarchy_ok = len(h_tags) > 0
                if hierarchy_ok:
                    # Simple check: first should be H1
                    first_h = h_tags[0].name if h_tags else None
                    hierarchy_ok = first_h == "h1"
                results["checks"]["proper_heading_hierarchy"] = hierarchy_ok
            
            # Check images
            if seo_checks.get("all_images_have_alt"):
                images = soup.find_all("img")
                images_with_alt = sum(1 for img in images if img.get("alt"))
                results["checks"]["all_images_have_alt"] = len(images) == 0 or images_with_alt == len(images)
                results["image_alt_coverage"] = images_with_alt / len(images) if images else 1.0
            
            # Check structured data
            if seo_checks.get("has_organization_schema"):
                scripts = soup.find_all("script", attrs={"type": "application/ld+json"})
                has_org_schema = any("Organization" in str(s) for s in scripts)
                results["checks"]["has_organization_schema"] = has_org_schema
            
            if seo_checks.get("has_website_schema"):
                scripts = soup.find_all("script", attrs={"type": "application/ld+json"})
                has_website_schema = any("Website" in str(s) for s in scripts)
                results["checks"]["has_website_schema"] = has_website_schema
            
            # Check responsiveness
            if seo_checks.get("mobile_friendly"):
                viewport = soup.find("meta", attrs={"name": "viewport"})
                mobile_friendly = viewport is not None and "width=device-width" in str(viewport)
                results["checks"]["mobile_friendly"] = mobile_friendly
            
            # Calculate pass rate
            passed_checks = sum(1 for v in results["checks"].values() if v is True)
            total_checks = len(results["checks"])
            pass_rate = passed_checks / total_checks if total_checks > 0 else 1.0
            
            results["passed_checks"] = passed_checks
            results["total_checks"] = total_checks
            results["pass_rate"] = pass_rate
            results["score"] = pass_rate
            
            return results
        
        except Exception as e:
            return {
                "error": str(e),
                "score": 0
            }


class DataFreshnessValidator:
    """
    Validates that data is current (2025 standards, recent vendor info, etc)
    """
    
    def __init__(self, base_url: str = "https://icy-flower-c586.jsellers.workers.dev",
                 timeout: int = 30):
        """Initialize validator"""
        self.base_url = base_url.rstrip('/')
        self.timeout = timeout
    
    def __call__(self, *, endpoint: str, expected_contains: list = None,
                 min_vendor_count: int = 40, validate_data: str = None, **kwargs) -> Dict[str, Any]:
        """
        Validate data freshness
        
        Args:
            endpoint: Route path
            expected_contains: List of keywords that should be present (for 2025 standards)
            min_vendor_count: Minimum expected vendors (for /sales-portal)
            validate_data: Type of data to validate (e.g., "otx_threats")
            **kwargs: Additional parameters
        
        Returns:
            Dictionary with data freshness results
        """
        try:
            url = f"{self.base_url}{endpoint}"
            response = requests.get(url, timeout=self.timeout)
            
            if response.status_code != 200:
                return {"error": f"HTTP {response.status_code}", "score": 0}
            
            text = response.text.lower()
            results = {
                "url": url,
                "status": response.status_code,
                "checks": {}
            }
            
            # Try to parse as JSON (for API endpoints)
            is_json = False
            try:
                data = response.json()
                is_json = True
            except:
                data = None
            
            if is_json and data:
                # JSON API response handling
                
                # Check for 2025 standards in regulations API
                if "/api/frameworks" in endpoint and isinstance(data, list):
                    found_standards = []
                    expected = ["HIPAA", "PCI", "GDPR", "CMMC", "NIS2", "DORA", "SEC"]
                    for item in data:
                        name = item.get("name", "").upper()
                        for std in expected:
                            if std in name and std not in found_standards:
                                found_standards.append(std)
                    
                    results["checks"]["has_2025_standards"] = len(found_standards) >= 5
                    results["found_standards"] = found_standards
                
                # Check vendor count for vendors API
                elif "/api/vendors" in endpoint and isinstance(data, list):
                    vendor_count = len(data)
                    has_crowdstrike = any("crowdstrike" in str(v).lower() for v in data)
                    results["checks"]["min_vendor_count"] = vendor_count >= min_vendor_count
                    results["checks"]["has_major_vendors"] = has_crowdstrike
                    results["vendor_count"] = vendor_count
                    
                    # Check for expected keywords
                    if expected_contains:
                        data_str = str(data).lower()
                        found = []
                        for keyword in expected_contains:
                            if keyword.lower() in data_str:
                                found.append(keyword)
                        results["checks"]["expected_keywords"] = len(found) >= len(expected_contains) // 2 if expected_contains else True
                        results["found_keywords"] = found
                
                # Check OTX threat data
                elif "/api/otx" in endpoint:
                    has_pulses = "pulses" in data
                    has_source = data.get("source") == "AlienVault OTX"
                    pulses = data.get("pulses", [])
                    has_threat_data = len(pulses) > 0
                    
                    results["checks"]["has_otx_threats"] = has_threat_data
                    results["checks"]["has_otx_source"] = has_source
                    results["pulse_count"] = len(pulses)
                
                # Generic API check
                else:
                    results["checks"]["is_valid_json"] = isinstance(data, (list, dict))
                    
                    # Check for expected keywords in JSON string representation
                    if expected_contains:
                        data_str = str(data).lower()
                        found = []
                        missing = []
                        for keyword in expected_contains:
                            if keyword.lower() in data_str:
                                found.append(keyword)
                            else:
                                missing.append(keyword)
                        results["checks"]["expected_keywords"] = len(missing) == 0
                        results["found_keywords"] = found
            
            else:
                # HTML response handling
                found = []
                missing = []
                for keyword in expected_contains:
                    if keyword.lower() in text:
                        found.append(keyword)
                    else:
                        missing.append(keyword)
                
                results["checks"]["expected_keywords"] = len(missing) == 0
                results["found_keywords"] = found
                results["missing_keywords"] = missing
            
            # Check vendor count
            if endpoint == "/sales-portal/api/vendors" or "vendor" in endpoint:
                # Count vendor mentions
                vendor_count = text.count("vendor") + text.count("crowdstrike") + text.count("palo alto")
                results["checks"]["min_vendor_count"] = vendor_count >= min_vendor_count
                results["estimated_vendor_count"] = vendor_count
            
            # Check for OTX threat data
            if validate_data == "otx_threats":
                has_threats = "threat" in text and "otx" in text.lower()
                results["checks"]["has_otx_threats"] = has_threats
            
            # Calculate score
            passed = sum(1 for v in results["checks"].values() if v is True)
            total = len(results["checks"])
            score = passed / total if total > 0 else 1.0
            
            results["score"] = score
            
            return results
        
        except Exception as e:
            return {
                "error": str(e),
                "score": 0
            }
