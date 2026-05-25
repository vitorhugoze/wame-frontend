import { DB_CONN_STR } from '$env/static/private';
import { Pool } from 'pg';

export const pool = new Pool({
	connectionString: DB_CONN_STR
});
