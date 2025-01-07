import mysql from 'mysql2/promise'; // Using promise-based pool

// Create a MySQL connection pool
export const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'osa',
});
