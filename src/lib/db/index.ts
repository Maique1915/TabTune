// import { drizzle } from 'drizzle-orm/mysql2';
// import mysql from 'mysql2/promise';
// import * as schema from './schema';

// const connectionString = process.env.DATABASE_URL || 'mysql://root:123@localhost:3306/cifrai';

// const connection = await mysql.createConnection(connectionString);
// export const db = drizzle(connection, { schema, mode: 'default' });

export const db = {} as any; // Dummy export to prevent breakages if imported
