# SEO + Deployment Evaluation Framework for sellersco.net
## Comprehensive Testing & Monitoring Setup

**Created:** December 15, 2025  
**Status:** Ready for Implementation  
**Coverage:** Route availability, Feature completeness, Data freshness, SEO validation

---

## 📊 Quick Summary

| Component | Location | Status | Tests |
|-----------|----------|--------|-------|
| **Deployment Tests** | `test-data/evaluation-queries.json` | ✅ Ready | 32 queries (routes, features, data, SEO) |
| **SEO Audit Framework** | `test-data/seo-audit-framework.json` | ✅ Ready | 35+ checks (technical, structured data, content, performance, mobile, accessibility) |
| **Evaluation Code** | To generate | ⏳ Pending | Python with azure-ai-evaluation SDK |

---

## 🎯 Evaluation Metrics (9 Total)

### Deployment Validation
1. **Route Availability** - All 21 routes return HTTP 200 (except 3 planned routes = 404)
2. **Feature Completeness** - Sales portal, regulations, threat feeds, AI recommender work
3. **Data Freshness** - 2025 compliance standards, 80+ vendor profiles, OTX threat intel current

### SEO Validation  
4. **Technical SEO** - Meta tags, charset, viewport, robots.txt, sitemap.xml, canonical URLs, SSL/HTTPS
5. **Structured Data** - JSON-LD schemas (Organization, Product, Article, BreadcrumbList, FAQPage)
6. **Content Optimization** - Heading hierarchy, keyword placement, image alt text, internal links, no duplicate content
7. **Performance** - Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1, TTFB < 600ms)
8. **Mobile Optimization** - Responsive design, touch targets (48px), mobile-first CSS, mobile performance
9. **Accessibility** - ARIA labels, color contrast (4.5:1), keyboard navigation (WCAG 2.1 AA)

---

## 📁 Test Data Files

### 1. evaluation-queries.json (42 test scenarios)
**Location:** `test-data/evaluation-queries.json`

**Breakdown:**
- **18 Route Availability Tests** - GET requests to all public routes
- **7 Feature Completeness Tests** - Vendor recommendations, compliance checks, threat feeds
- **5 Data Freshness Tests** - OTX integration, 2025 regulations, vendor profiles, Gartner data
- **10 SEO Validation Tests** - Meta tags, schema, headings, images, responsiveness, Core Web Vitals

**Example Queries:**
```json
{
  "id": "route_sales_portal",
  "description": "Test sales portal with 80+ vendors",
  "endpoint": "/sales-portal",
  "method": "GET",
  "expected_status": 200,
  "expected_contains": ["vendor", "CrowdStrike", "Palo Alto"]
}

{
  "id": "seo_meta_tags_home",
  "description": "Validate meta tags on home page",
  "endpoint": "/",
  "seo_checks": {
    "has_title": true,
    "has_meta_description": true,
    "has_og_tags": true
  }
}
```

### 2. seo-audit-framework.json (Comprehensive SEO audit)
**Location:** `test-data/seo-audit-framework.json`

**Categories (35+ checks total):**

**Technical SEO (10 checks, 25% weight)**
- Meta tags on all pages (title 30-60 chars, description 120-160 chars)
- Charset (UTF-8) and language tags
- Viewport meta tag
- Open Graph tags
- Twitter Card tags
- robots.txt (prevents admin crawling)
- sitemap.xml (all routes with priority/lastmod)
- Canonical tags (self-referential)
- SSL/HTTPS on all routes
- HTTP headers (Cache-Control, no noindex on public pages)

**Structured Data (7 checks, 25% weight)**
- Organization schema (name, logo, contact, social)
- Website schema (search action, site name)
- Product schema (vendor profiles with ratings)
- Article/NewsArticle schema (threat intel, regulations)
- FAQPage schema
- BreadcrumbList schema
- Valid JSON-LD format

**Content Optimization (6 checks, 20% weight)**
- Heading hierarchy (single H1, proper H1-H6 nesting)
- Keyword optimization (in title, H1, meta description, body)
- Content length (800+ words for sales-portal, 1000+ for regulations)
- Image optimization (descriptive alt text, naming, title attributes)
- Internal linking (descriptive anchors, no excessive links)
- No duplicate content

**Performance (6 checks, 15% weight)**
- LCP (Largest Contentful Paint) < 2.5s desktop / 4s mobile
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- FCP (First Contentful Paint) < 1.8s
- TTFB (Time to First Byte) < 600ms
- JS bundle size < 200KB gzipped

**Mobile Optimization (5 checks, 10% weight)**
- Responsive CSS (media queries for 320px, 375px, 768px, 1024px)
- Mobile-first approach
- Viewport configuration
- Touch targets (48px minimum)
- Mobile performance optimization

**Accessibility (3 checks, 5% weight - bonus)**
- ARIA labels and roles
- Color contrast (4.5:1 minimum)
- Keyboard navigation

---

## 📊 Scoring & Targets

**Overall SEO Score Formula:**
```
Score = Σ(category_score × category_weight)

Category Score = Average of all check pass rates in that category
```

**Grade Scale:**
- 🟢 **A (90-100)** - Excellent SEO health
- 🟢 **B (80-89)** - Good, minimal issues
- 🟡 **C (70-79)** - Needs improvement
- 🔴 **D (60-69)** - Significant issues
- 🔴 **F (0-59)** - Critical problems

**Minimum Targets:**
- ✅ Overall SEO Score: **≥ 85 (A grade)**
- ✅ LCP: **< 2.5 seconds**
- ✅ CLS: **< 0.1**
- ✅ Mobile Pass Rate: **≥ 95%**
- ✅ Accessibility Pass Rate: **≥ 85%**

---

## 🔧 Next Steps: Generate Evaluation Code

To run this evaluation framework, you'll need to:

### Step 1: Install Azure AI Evaluation SDK
```bash
pip install azure-ai-evaluation
```

### Step 2: Convert Test Queries to JSONL Format
```bash
# Convert evaluation-queries.json to JSONL
python -c "
import json
with open('test-data/evaluation-queries.json', 'r') as f:
    data = json.load(f)
    with open('test-data/evaluation-queries.jsonl', 'w') as out:
        for query in data['test_queries']:
            out.write(json.dumps(query) + '\n')
"
```

### Step 3: Implement Evaluators (Code-based)
For deployment validation, create custom code-based evaluators:
- `RouteAvailabilityEvaluator` - Test HTTP status codes
- `FeatureCompletenessEvaluator` - Validate response content
- `DataFreshnessEvaluator` - Check data timestamps/versions

### Step 4: Implement Evaluators (Prompt-based for SEO)
For SEO validation, use built-in `RelevanceEvaluator` + custom prompt-based:
- `SEOMetaTagsEvaluator` - Validate meta tags
- `SEOStructuredDataEvaluator` - Validate JSON-LD
- `SEOContentEvaluator` - Check heading hierarchy and keywords

### Step 5: Run Unified Evaluation
```python
from azure.ai.evaluation import evaluate

result = evaluate(
    data="test-data/evaluation-queries.jsonl",
    evaluators={
        "route_availability": RouteAvailabilityEvaluator(),
        "seo_validation": SEOValidator()
    },
    evaluator_config={...},
    output_path="evaluation-results/"
)
```

---

## 📋 Implementation Checklist

- [ ] Install `azure-ai-evaluation` SDK
- [ ] Convert `evaluation-queries.json` → `evaluation-queries.jsonl`
- [ ] Create `evaluators/route_availability.py` (custom code-based)
- [ ] Create `evaluators/feature_completeness.py` (custom code-based)
- [ ] Create `evaluators/seo_validation.py` (custom prompt-based with LLM)
- [ ] Create `evaluation/run_evaluation.py` (orchestration script)
- [ ] Configure Azure OpenAI or OpenAI model endpoint
- [ ] Run evaluation: `python evaluation/run_evaluation.py`
- [ ] Review results in `evaluation-results/`
- [ ] Generate report: `evaluation_report.md`

---

## 🚀 Ready to Generate Full Evaluation Code?

I can create a complete Python implementation with:
1. **Evaluators** - All custom code-based and prompt-based evaluators
2. **Runner** - Orchestration script using `evaluate()` API
3. **Configuration** - Environment setup and model config
4. **Reports** - Result parsing and HTML report generation

**Would you like me to generate the complete evaluation implementation code?**

---

## 📎 Reference Files

- `test-data/evaluation-queries.json` - 42 test scenarios
- `test-data/seo-audit-framework.json` - SEO audit specifications
- `test-data/evaluation-queries.jsonl` - (To generate) JSONL format for SDK

**Next Action:** Generate Python evaluation code with evaluators and runner script.
