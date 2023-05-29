// Update with your config settings.

import {Knex} from "knex";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const knexfile:  Knex.Config = {
    client: 'pg',
    connection: {
      host: 'postgres',
      port: 5432,
      database: 'db_dev',
      user:     'user',
      password: 'pass'
    },
    migrations: {
      tableName: 'knex_migrations'
    }
};
