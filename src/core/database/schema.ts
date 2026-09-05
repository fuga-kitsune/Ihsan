export const CREATE_TABLES_SQL = `
  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    benefit TEXT NOT NULL,
    tag TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    required_streak INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS habit_logs (
    id TEXT PRIMARY KEY NOT NULL,
    habit_id TEXT NOT NULL,
    date_key TEXT NOT NULL,
    completed INTEGER DEFAULT 1,
    FOREIGN KEY(habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    UNIQUE(habit_id, date_key)
  );

  CREATE TABLE IF NOT EXISTS reflections (
    date_key TEXT PRIMARY KEY NOT NULL,
    content TEXT NOT NULL,
    heart_state TEXT DEFAULT '',
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS wisdoms (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    arabic TEXT NOT NULL,
    meaning TEXT NOT NULL,
    source TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS niyyahs (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    category TEXT NOT NULL,
    target_date TEXT NOT NULL,
    is_completed INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL,
    completed_at INTEGER
  );

  CREATE TABLE IF NOT EXISTS spiritual_quests (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT NOT NULL,
    benefit TEXT NOT NULL,
    target_count INTEGER NOT NULL,
    current_count INTEGER DEFAULT 0,
    is_completed INTEGER DEFAULT 0,
    unit TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    required_streak INTEGER DEFAULT 0,
    last_updated_date TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS duas (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    arabic TEXT NOT NULL,
    transliteration TEXT NOT NULL,
    meaning TEXT NOT NULL,
    source TEXT NOT NULL,
    benefit TEXT NOT NULL,
    is_bookmarked INTEGER DEFAULT 0
  );
`;
