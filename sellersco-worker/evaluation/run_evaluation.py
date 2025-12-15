"""
Evaluation Runner
Orchestrates the evaluation framework using Azure AI Evaluation SDK
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any
import pandas as pd
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from config import get_eval_config, get_model_config
from evaluators import RouteAvailabilityEvaluator, FeatureCompletenessEvaluator
from validators import SEOValidator, DataFreshnessValidator


class EvaluationRunner:
    """Orchestrates evaluation of sellersco.net"""
    
    def __init__(self):
        """Initialize runner"""
        self.eval_config = get_eval_config()
        self.model_config = get_model_config()
        self.results = {
            "metadata": {
                "timestamp": datetime.now().isoformat(),
                "worker_url": self.eval_config.target_worker_url,
                "total_queries": 0,
                "passed_queries": 0,
                "failed_queries": 0
            },
            "by_category": {},
            "detailed_results": []
        }
    
    def load_test_queries(self) -> List[Dict[str, Any]]:
        """Load test queries from JSON"""
        try:
            with open(self.eval_config.queries_file, 'r') as f:
                data = json.load(f)
                return data.get("test_queries", [])
        except FileNotFoundError:
            print(f"Error: {self.eval_config.queries_file} not found")
            return []
    
    def run_route_tests(self, queries: List[Dict]) -> Dict[str, Any]:
        """Run route availability tests"""
        print("\n🧪 Running Route Availability Tests...")
        
        route_queries = [q for q in queries if q.get("category") == "route_availability"]
        evaluator = RouteAvailabilityEvaluator(base_url=self.eval_config.target_worker_url)
        
        results = []
        passed = 0
        
        for query in route_queries:
            print(f"  Testing {query['endpoint']}...", end=" ")
            
            result = evaluator(
                endpoint=query["endpoint"],
                method=query.get("method", "GET"),
                expected_status=query.get("expected_status", 200)
            )
            
            result["query_id"] = query["id"]
            result["endpoint"] = query["endpoint"]
            result["description"] = query["description"]
            
            is_pass = result.get("status_match", False)
            passed += int(is_pass)
            
            status_str = "✅ PASS" if is_pass else "❌ FAIL"
            print(status_str)
            
            results.append(result)
        
        pass_rate = passed / len(route_queries) if route_queries else 0
        
        return {
            "category": "route_availability",
            "total": len(route_queries),
            "passed": passed,
            "pass_rate": pass_rate,
            "results": results
        }
    
    def run_feature_tests(self, queries: List[Dict]) -> Dict[str, Any]:
        """Run feature completeness tests"""
        print("\n✨ Running Feature Completeness Tests...")
        
        feature_queries = [q for q in queries if q.get("category") == "feature_completeness"]
        evaluator = FeatureCompletenessEvaluator(base_url=self.eval_config.target_worker_url)
        
        results = []
        passed = 0
        
        for query in feature_queries:
            print(f"  Testing {query['description']}...", end=" ")
            
            result = evaluator(
                endpoint=query["endpoint"],
                expected_contains=query.get("expected_contains", []),
                expected_status=query.get("expected_status", 200)
            )
            
            result["query_id"] = query["id"]
            result["endpoint"] = query["endpoint"]
            result["description"] = query["description"]
            
            is_pass = result.get("score", 0) >= 0.8
            passed += int(is_pass)
            
            status_str = "✅ PASS" if is_pass else "❌ FAIL"
            print(status_str)
            
            results.append(result)
        
        pass_rate = passed / len(feature_queries) if feature_queries else 0
        
        return {
            "category": "feature_completeness",
            "total": len(feature_queries),
            "passed": passed,
            "pass_rate": pass_rate,
            "results": results
        }
    
    def run_data_freshness_tests(self, queries: List[Dict]) -> Dict[str, Any]:
        """Run data freshness tests"""
        print("\n📊 Running Data Freshness Tests...")
        
        data_queries = [q for q in queries if q.get("category") == "data_freshness"]
        evaluator = DataFreshnessValidator(base_url=self.eval_config.target_worker_url)
        
        results = []
        passed = 0
        
        for query in data_queries:
            print(f"  Testing {query['description']}...", end=" ")
            
            result = evaluator(
                endpoint=query["endpoint"],
                expected_contains=query.get("expected_contains"),
                min_vendor_count=query.get("min_vendor_count", 80),
                validate_data=query.get("validate_data")
            )
            
            result["query_id"] = query["id"]
            result["endpoint"] = query["endpoint"]
            result["description"] = query["description"]
            
            is_pass = result.get("score", 0) >= 0.8
            passed += int(is_pass)
            
            status_str = "✅ PASS" if is_pass else "❌ FAIL"
            print(status_str)
            
            results.append(result)
        
        pass_rate = passed / len(data_queries) if data_queries else 0
        
        return {
            "category": "data_freshness",
            "total": len(data_queries),
            "passed": passed,
            "pass_rate": pass_rate,
            "results": results
        }
    
    def run_seo_tests(self, queries: List[Dict]) -> Dict[str, Any]:
        """Run SEO validation tests"""
        print("\n🔍 Running SEO Validation Tests...")
        
        seo_queries = [q for q in queries if q.get("category") == "seo_validation"]
        evaluator = SEOValidator(base_url=self.eval_config.target_worker_url)
        
        results = []
        passed = 0
        
        for query in seo_queries:
            print(f"  Testing {query['description']}...", end=" ")
            
            result = evaluator(
                endpoint=query["endpoint"],
                seo_checks=query.get("seo_checks", {})
            )
            
            result["query_id"] = query["id"]
            result["endpoint"] = query["endpoint"]
            result["description"] = query["description"]
            
            is_pass = result.get("score", 0) >= 0.7
            passed += int(is_pass)
            
            status_str = "✅ PASS" if is_pass else "⚠️  PARTIAL"
            print(status_str)
            
            results.append(result)
        
        pass_rate = passed / len(seo_queries) if seo_queries else 0
        
        return {
            "category": "seo_validation",
            "total": len(seo_queries),
            "passed": passed,
            "pass_rate": pass_rate,
            "results": results
        }
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run all evaluation tests"""
        print("\n" + "="*60)
        print("🚀 SELLERSCO.NET EVALUATION FRAMEWORK")
        print("="*60)
        
        # Load test queries
        queries = self.load_test_queries()
        if not queries:
            print("❌ No test queries loaded!")
            return self.results
        
        print(f"\n📋 Loaded {len(queries)} test queries")
        
        # Run all test categories
        test_results = []
        
        # Route tests
        route_results = self.run_route_tests(queries)
        test_results.append(route_results)
        
        # Feature tests
        feature_results = self.run_feature_tests(queries)
        test_results.append(feature_results)
        
        # Data freshness tests
        data_results = self.run_data_freshness_tests(queries)
        test_results.append(data_results)
        
        # SEO tests
        seo_results = self.run_seo_tests(queries)
        test_results.append(seo_results)
        
        # Aggregate results
        total_passed = sum(r["passed"] for r in test_results)
        total_tests = sum(r["total"] for r in test_results)
        overall_pass_rate = total_passed / total_tests if total_tests > 0 else 0
        
        # Store results
        self.results["metadata"]["total_queries"] = total_tests
        self.results["metadata"]["passed_queries"] = total_passed
        self.results["metadata"]["failed_queries"] = total_tests - total_passed
        self.results["metadata"]["overall_pass_rate"] = overall_pass_rate
        
        for cat_result in test_results:
            self.results["by_category"][cat_result["category"]] = {
                "total": cat_result["total"],
                "passed": cat_result["passed"],
                "pass_rate": cat_result["pass_rate"]
            }
            self.results["detailed_results"].extend(cat_result["results"])
        
        # Print summary
        self._print_summary(test_results, overall_pass_rate)
        
        return self.results
    
    def _print_summary(self, test_results: List[Dict], overall_pass_rate: float):
        """Print evaluation summary"""
        print("\n" + "="*60)
        print("📊 EVALUATION SUMMARY")
        print("="*60)
        
        for result in test_results:
            category = result["category"]
            passed = result["passed"]
            total = result["total"]
            pass_rate = result["pass_rate"]
            
            bar_length = 30
            filled = int(bar_length * pass_rate)
            bar = "█" * filled + "░" * (bar_length - filled)
            
            print(f"\n{category.upper().replace('_', ' ')}")
            print(f"  [{bar}] {passed}/{total} ({pass_rate*100:.1f}%)")
        
        # Overall score
        bar_length = 30
        filled = int(bar_length * overall_pass_rate)
        bar = "█" * filled + "░" * (bar_length - filled)
        
        print(f"\n{'OVERALL SCORE'}")
        print(f"  [{bar}] {overall_pass_rate*100:.1f}%")
        
        # Grade
        if overall_pass_rate >= 0.95:
            grade = "A 🟢"
        elif overall_pass_rate >= 0.90:
            grade = "B 🟢"
        elif overall_pass_rate >= 0.80:
            grade = "C 🟡"
        elif overall_pass_rate >= 0.70:
            grade = "D 🔴"
        else:
            grade = "F 🔴"
        
        print(f"\nGrade: {grade}")
        print("="*60)
    
    def save_results(self) -> str:
        """Save results to JSON file"""
        output_file = os.path.join(
            self.eval_config.output_dir,
            f"evaluation-results-{datetime.now().strftime('%Y%m%d-%H%M%S')}.json"
        )
        
        os.makedirs(self.eval_config.output_dir, exist_ok=True)
        
        with open(output_file, 'w') as f:
            json.dump(self.results, f, indent=2, default=str)
        
        print(f"\n✅ Results saved to: {output_file}")
        return output_file
    
    def generate_report(self) -> str:
        """Generate HTML report"""
        report_file = os.path.join(
            self.eval_config.output_dir,
            f"evaluation-report-{datetime.now().strftime('%Y%m%d-%H%M%S')}.html"
        )
        
        os.makedirs(self.eval_config.output_dir, exist_ok=True)
        # Fix encoding for Windows systems with emoji
        import sys
        if sys.stdout.encoding and sys.stdout.encoding.lower() == 'cp1252':
            import io
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        
        # Calculate metrics
        total_tests = self.results["metadata"]["total_queries"]
        passed_tests = self.results["metadata"]["passed_queries"]
        pass_rate = self.results["metadata"]["overall_pass_rate"]
        
        # Determine grade
        if pass_rate >= 0.95:
            grade = "A"
            grade_color = "#22c55e"
        elif pass_rate >= 0.90:
            grade = "B"
            grade_color = "#22c55e"
        elif pass_rate >= 0.80:
            grade = "C"
            grade_color = "#eab308"
        else:
            grade = "F"
            grade_color = "#ef4444"
        
        html_content = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sellersco.net Evaluation Report</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; line-height: 1.6; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 2rem; }}
        header {{ text-align: center; padding: 2rem 0; border-bottom: 2px solid #1e293b; margin-bottom: 2rem; }}
        h1 {{ font-size: 2.5rem; margin-bottom: 0.5rem; color: #f1f5f9; }}
        .subtitle {{ color: #94a3b8; font-size: 1rem; }}
        .metrics {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }}
        .metric-card {{ background: #1e293b; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #3b82f6; }}
        .metric-value {{ font-size: 2.5rem; font-weight: bold; color: #f1f5f9; }}
        .metric-label {{ color: #94a3b8; font-size: 0.9rem; margin-top: 0.5rem; }}
        .progress-bar {{ width: 100%; height: 12px; background: #0f172a; border-radius: 6px; overflow: hidden; margin-top: 1rem; }}
        .progress-fill {{ height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6); transition: width 0.3s; }}
        .grade-box {{ background: {grade_color}; color: white; padding: 2rem; border-radius: 8px; text-align: center; margin: 2rem 0; }}
        .grade-letter {{ font-size: 4rem; font-weight: bold; }}
        .results-table {{ width: 100%; border-collapse: collapse; margin: 2rem 0; background: #1e293b; border-radius: 8px; overflow: hidden; }}
        .results-table th {{ background: #0f172a; padding: 1rem; text-align: left; font-weight: 600; border-bottom: 1px solid #334155; }}
        .results-table td {{ padding: 1rem; border-bottom: 1px solid #334155; }}
        .results-table tr:last-child td {{ border-bottom: none; }}
        .pass {{ color: #10b981; }}
        .fail {{ color: #ef4444; }}
        .footer {{ text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #1e293b; color: #94a3b8; }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 Sellersco.net Evaluation Report</h1>
            <p class="subtitle">Deployment & SEO Validation</p>
            <p class="subtitle">{self.results["metadata"]["timestamp"]}</p>
        </header>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-value">{passed_tests}/{total_tests}</div>
                <div class="metric-label">Tests Passed</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {pass_rate*100}%"></div>
                </div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value" style="color: #10b981;">{pass_rate*100:.1f}%</div>
                <div class="metric-label">Overall Pass Rate</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-value" style="color: #3b82f6;">4</div>
                <div class="metric-label">Test Categories</div>
            </div>
        </div>
        
        <div class="grade-box">
            <div class="grade-letter">{grade}</div>
            <p>Grade: {grade}</p>
        </div>
        
        <h2 style="margin-top: 2rem; margin-bottom: 1rem;">Category Breakdown</h2>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Tests</th>
                    <th>Passed</th>
                    <th>Rate</th>
                </tr>
            </thead>
            <tbody>
"""
        
        for category, stats in self.results["by_category"].items():
            rate = stats["pass_rate"]
            rate_color = "pass" if rate >= 0.8 else "fail"
            html_content += f"""
                <tr>
                    <td>{category.replace('_', ' ').title()}</td>
                    <td>{stats['total']}</td>
                    <td>{stats['passed']}</td>
                    <td><span class="{rate_color}">{rate*100:.1f}%</span></td>
                </tr>
"""
        
        html_content += """
            </tbody>
        </table>
        
        <div class="footer">
            <p>Evaluation Framework for sellersco.net</p>
            <p>Covers: Route Availability, Feature Completeness, Data Freshness, SEO Validation</p>
        </div>
    </div>
</body>
</html>
"""
        
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✅ Report generated: {report_file}")
        return report_file


def main():
    """Main entry point"""
    runner = EvaluationRunner()
    
    try:
        # Run all tests
        results = runner.run_all_tests()
        
        # Save results
        runner.save_results()
        
        # Generate report
        runner.generate_report()
        
        # Exit with appropriate code
        if results["metadata"]["overall_pass_rate"] >= 0.95:
            sys.exit(0)  # Success
        else:
            sys.exit(1)  # Partial success/failure
    
    except Exception as e:
        print(f"\n❌ Error running evaluation: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(2)


if __name__ == "__main__":
    main()
