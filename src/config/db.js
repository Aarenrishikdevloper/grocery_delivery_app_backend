import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current module's directory path (ES Modules alternative to __dirname)
const currentDir = dirname(fileURLToPath(import.meta.url));

// Create database connection
const db = new sqlite3.Database(join(currentDir, 'otp.db'), (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Initialize database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS otps(
      phone_number TEXT PRIMARY KEY,
      otp TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    )`, 
    (err) => {
      if (err) console.error('Table creation error:', err);
    }
  );
  
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_phone_number 
    ON otps(phone_number)`,
    (err) => {
      if (err) console.error('Index creation error:', err);
    }
  );
});

// Handle database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

// Export as default (ES modules compatible)
export default db;