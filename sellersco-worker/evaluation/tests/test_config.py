from evaluation.config import get_eval_config


def test_eval_config_loads():
    cfg = get_eval_config()
    assert cfg is not None
    assert hasattr(cfg, 'target_worker_url')
    assert cfg.queries_file.endswith('test-data/evaluation-queries.json')
    assert isinstance(cfg.min_seo_score, float)
