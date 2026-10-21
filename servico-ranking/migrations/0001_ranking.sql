CREATE TABLE IF NOT EXISTS sessions (
 token TEXT PRIMARY KEY,
 ip_hash TEXT NOT NULL,
 created_at INTEGER NOT NULL,
 used INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS sessions_rate ON sessions(ip_hash, created_at);
CREATE TABLE IF NOT EXISTS results (
 id TEXT PRIMARY KEY,
 session_token TEXT NOT NULL UNIQUE,
 player TEXT NOT NULL,
 player_key TEXT NOT NULL,
 amount INTEGER NOT NULL CHECK(amount>=0 AND amount<=1000000),
 correct INTEGER NOT NULL CHECK(correct>=0 AND correct<=10),
 answered INTEGER NOT NULL CHECK(answered>=0 AND answered<=10),
 helps INTEGER NOT NULL CHECK(helps>=0 AND helps<=4),
 reason TEXT NOT NULL,
 finished_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS results_player ON results(player_key, amount DESC, correct DESC, helps);
