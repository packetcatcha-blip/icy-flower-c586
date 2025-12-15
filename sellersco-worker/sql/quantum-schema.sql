-- Quantum Sessions & Results Database Schema
-- For D1: wrangler d1 execute quantum_sessions_db --file=sql/quantum-schema.sql

-- Quiz Results Table
CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  answers TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_timestamp ON quiz_results(timestamp);

-- User Sessions Table
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_session_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_id_sessions ON sessions(user_id);

-- Simulation State Table (for persistence across requests)
CREATE TABLE IF NOT EXISTS simulation_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sim_name TEXT NOT NULL,
  user_id TEXT,
  state_data TEXT NOT NULL,
  qubits_count INTEGER,
  entanglement_pairs INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sim_name ON simulation_states(sim_name);

-- Global Statistics
CREATE TABLE IF NOT EXISTS statistics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  metric_name TEXT NOT NULL,
  metric_value INTEGER DEFAULT 0,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Leaderboard View
CREATE VIEW IF NOT EXISTS leaderboard AS
  SELECT 
    user_id,
    MAX(score) as best_score,
    AVG(score) as avg_score,
    COUNT(*) as total_quizzes,
    MAX(timestamp) as last_quiz_date
  FROM quiz_results
  GROUP BY user_id
  ORDER BY best_score DESC
  LIMIT 100;

-- Threat Timeline Events
CREATE TABLE IF NOT EXISTS threat_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_name TEXT NOT NULL,
  description TEXT,
  year INTEGER,
  severity TEXT,
  algorithms_affected TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample threat events
INSERT OR IGNORE INTO threat_events (event_name, description, year, severity, algorithms_affected) VALUES
  ('Y2Q (Year 2038 Quantum?)', 'Estimated timeline for quantum computers to threaten RSA', 2038, 'CRITICAL', 'RSA, ECDSA, DSA'),
  ('Harvest Now, Decrypt Later', 'Adversaries collecting encrypted data for future decryption', 2023, 'HIGH', 'All asymmetric crypto'),
  ('Post-Quantum Standards Finalized', 'NIST approves ML-KEM, ML-DSA, SLH-DSA', 2024, 'LOW', 'N/A - mitigation'),
  ('Grover Acceleration', 'Quantum computers halve effective key length', 2030, 'MEDIUM', 'AES, SHA');

-- PQC Migration Status Table
CREATE TABLE IF NOT EXISTS pqc_migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organization TEXT NOT NULL,
  algorithm_from TEXT NOT NULL,
  algorithm_to TEXT NOT NULL,
  completion_percent INTEGER DEFAULT 0,
  target_date TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
