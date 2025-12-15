# Evaluation Framework Quick Start

## 📋 Overview

Complete evaluation framework for sellersco.net covering:
- ✅ **Route Availability** - HTTP status validation (18 tests)
- ✅ **Feature Completeness** - Business logic verification (7 tests)
- ✅ **Data Freshness** - 2025 standards, vendor data, threat intel (5 tests)
- ✅ **SEO Validation** - Meta tags, schema, content, performance (10 tests)

**Total: 40 automated tests**

---

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
pip install -r requirements-evaluation.txt
```

### Step 2: Create `.env` file
```bash
cat > evaluation/.env << EOF
WORKER_URL=https://icy-flower-c586.jsellers.workers.dev
AZURE_OPENAI_ENDPOINT=your_endpoint
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_DEPLOYMENT=gpt-4
MODEL_TYPE=azure
EOF
```

### Step 3: Run Evaluation
```bash
cd evaluation
python run_evaluation.py
```

### Step 4: View Results
- JSON results: `evaluation-results/evaluation-results-YYYYMMDD-HHMMSS.json`
- HTML report: `evaluation-results/evaluation-report-YYYYMMDD-HHMMSS.html`

---

## 📊 Test Categories

### 1. Route Availability (18 tests)
Tests all 21 routes for HTTP 200 status:
- Homepage `/`
- Sales portal `/sales-portal`
- Regulations `/regulations`
- Threat feeds `/attack-map`, `/attack-patterns`
- Quantum crypto `/quantum`, `/post-quantum`
- And 11 more...

**Expected Result:** 18/18 ✅

### 2. Feature Completeness (7 tests)
Validates business logic works:
- Vendor recommendations return relevant partners
- Compliance checks work for frameworks
- Threat intelligence loads OTX data
- Gartner positioning displays correctly

**Expected Result:** 7/7 ✅

### 3. Data Freshness (5 tests)
Ensures 2025 updates are live:
- OTX threat feed integration working
- 2025 regulations (DORA, NIS2, SEC rules) present
- 80+ vendor profiles current
- Gartner MQ 2025 data loaded

**Expected Result:** 5/5 ✅

### 4. SEO Validation (10 tests)
Checks SEO best practices:
- Meta tags on all pages (title, description, OG tags)
- Proper heading hierarchy (single H1)
- Image alt text
- Mobile responsiveness
- Core Web Vitals (LCP, FID, CLS)
- JSON-LD schema markup

**Expected Result:** 8-10/10 ✅

---

## 📈 Scoring

**Overall Score Formula:**
```
Score = (Route Pass Rate × 0.3) + 
        (Feature Pass Rate × 0.3) + 
        (Data Freshness Pass Rate × 0.2) + 
        (SEO Pass Rate × 0.2)
```

**Grade Scale:**
- 🟢 **A (95-100%)** - Production ready
- 🟢 **B (90-94%)** - Minor issues only
- 🟡 **C (80-89%)** - Needs improvement
- 🔴 **D/F (<80%)** - Critical issues

---

## 📁 Project Structure

```
evaluation/
├── __init__.py                 # Package init
├── config.py                   # Configuration management
├── evaluators.py              # Route & Feature evaluators
├── validators.py              # SEO & Data freshness validators
├── run_evaluation.py          # Main orchestration script
└── .env                       # Configuration (create manually)

test-data/
├── evaluation-queries.json    # 42 test scenarios
├── seo-audit-framework.json   # SEO audit specifications
└── evaluation-queries.jsonl   # (Generated) JSONL format

evaluation-results/
├── evaluation-results-*.json  # Raw test results
└── evaluation-report-*.html   # HTML report
```

---

## 🔍 Understanding Results

### JSON Results Structure
```json
{
  "metadata": {
    "timestamp": "2025-12-15T...",
    "worker_url": "https://...",
    "total_queries": 40,
    "passed_queries": 38,
    "failed_queries": 2,
    "overall_pass_rate": 0.95
  },
  "by_category": {
    "route_availability": {
      "total": 18,
      "passed": 18,
      "pass_rate": 1.0
    },
    "feature_completeness": {
      "total": 7,
      "passed": 7,
      "pass_rate": 1.0
    },
    ...
  },
  "detailed_results": [
    {
      "query_id": "route_home",
      "endpoint": "/",
      "description": "Test home page route",
      "status_match": true,
      "actual_status": 200,
      "expected_status": 200,
      "score": 1.0
    },
    ...
  ]
}
```

### HTML Report
Visual dashboard showing:
- 📊 Overall pass rate with progress bar
- 📈 Grade (A-F)
- 📋 Breakdown by category
- 🎯 Detailed metrics

---

## 🔧 Customization

### Modify Test Queries
Edit `test-data/evaluation-queries.json` to:
- Add new routes to test
- Change expected responses
- Adjust SEO checks

### Adjust Scoring Weights
Edit `evaluation/config.py`:
```python
# In EvaluationConfig
min_seo_score: float = 85.0           # Minimum SEO score for pass
min_availability_pass_rate: float = 0.95  # Route pass rate target
min_feature_pass_rate: float = 0.90   # Feature test target
```

### Add Custom Evaluators
Create new evaluator in `evaluation/evaluators.py`:
```python
class CustomEvaluator:
    def __call__(self, *, endpoint: str, **kwargs) -> Dict[str, Any]:
        # Your logic here
        return {"score": 0.95}
```

---

## 🚨 Troubleshooting

### Tests Fail with Connection Error
**Problem:** `ConnectionError: Failed to establish connection to worker`
**Solution:** Check `WORKER_URL` in `.env` and verify worker is deployed

### SEO Tests Show Low Scores
**Problem:** `has_meta_description: false`
**Solution:** Add meta tags to HTML headers in Cloudflare Worker

### All Tests Pass Locally but Not in CI/CD
**Problem:** Network or timeout issues
**Solution:** Increase `timeout_seconds` in `config.py` (default: 30)

---

## 📝 Next Steps

1. **Run evaluation:** `python evaluation/run_evaluation.py`
2. **Review results:** Check `evaluation-results/evaluation-report-*.html`
3. **Fix failing tests:** Address any 🔴 items
4. **Re-run:** Verify fixes with another evaluation run

---

## 📞 Support

For issues or questions:
1. Check detailed results in JSON
2. Review HTML report for visual breakdown
3. Examine specific test in `run_evaluation.py`
4. Verify test data in `test-data/evaluation-queries.json`

---

**Framework Version:** 1.0.0  
**Last Updated:** 2025-12-15  
**Status:** Ready for production use ✅
