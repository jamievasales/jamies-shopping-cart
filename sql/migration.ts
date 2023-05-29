import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const MIGRATION_PATH = __dirname + '/migrations';

// Connect to the database
const pool = new Pool({
    user: 'user',
    host: 'postgres',
    database: 'db_dev',
    password: 'pass',
    port: 5432,
});

async function ensureMigrationsTableExists() {
    const sql = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      run_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
    await pool.query(sql);
}

async function runMigration(fileName: string) {
    const sql = fs.readFileSync(path.join(MIGRATION_PATH, fileName), 'utf-8');
    await pool.query(sql);
    await pool.query('INSERT INTO migrations (name) VALUES ($1)', [fileName]);
}

async function runMigrations() {
    console.log('Running migrations');
    const client = await pool.connect();
    try {
        await ensureMigrationsTableExists();
        await client.query('BEGIN');
        const { rows } = await client.query('SELECT name FROM migrations');
        const appliedMigrations = rows.map((row: { name: string; }) => row.name);

        // Get the list of .sql files in the migrations directory
        const files = fs.readdirSync(MIGRATION_PATH).filter(file => file.endsWith('.sql'));

        for (let file of files) {
            if (!appliedMigrations.includes(file)) {
                console.log(`Running migration ${file}`);
                await runMigration(file);
            }
        }
        console.log('Committing transactions')
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        console.log('Releasing client, migrations completed successfully');
        client.release();
    }
}

runMigrations().catch(error => {
    console.error(error);
    process.exit(1);
});