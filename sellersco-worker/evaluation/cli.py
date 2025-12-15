#!/usr/bin/env python3
"""Evaluation CLI
Run: python evaluation/cli.py
"""
import json
import sys
from pathlib import Path

from run_evaluation import EvaluationRunner


def main():
    runner = EvaluationRunner()
    results = runner.run_all_tests()
    runner.save_results()
    runner.generate_report()
    # Print short summary
    meta = results.get('metadata', {})
    print('\n🧾 Summary')
    print(f"Timestamp: {meta.get('timestamp')}")
    print(f"Target worker: {meta.get('worker_url')}")
    print(f"Total tests: {meta.get('total_queries')}")
    print(f"Passed: {meta.get('passed_queries')}")
    print(f"Failed: {meta.get('failed_queries')}")
    print(f"Overall pass rate: {meta.get('overall_pass_rate')}")

    # Exit code non-zero if overall pass rate < 0.8
    if meta.get('overall_pass_rate', 0) < 0.8:
        print('\n❌ Evaluation did not meet threshold (0.8).')
        sys.exit(2)
    else:
        print('\n✅ Evaluation passed threshold')
        sys.exit(0)


if __name__ == '__main__':
    main()
