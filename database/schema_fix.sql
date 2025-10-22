-- Fix database schema inconsistencies
ALTER TABLE decisions RENAME COLUMN decision TO result;

-- Add missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_decisions_user_id ON decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_decisions_created_at ON decisions(created_at);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Add constraints
ALTER TABLE decisions ADD CONSTRAINT check_trust_score CHECK (trust_score >= 0 AND trust_score <= 1);
ALTER TABLE decisions ADD CONSTRAINT check_result CHECK (result IN ('ALLOW', 'CHALLENGE', 'BLOCK'));