-- Fix database column name from 'decision' to 'result'
-- Run this in PostgreSQL to fix the column name issue

-- First, check if the column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'decisions';

-- If column is named 'decision', rename it to 'result'
ALTER TABLE decisions RENAME COLUMN decision TO result;

-- Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'decisions';

-- Check sample data
SELECT id, user_id, trust_score, result, note, created_at 
FROM decisions 
ORDER BY created_at DESC 
LIMIT 5;