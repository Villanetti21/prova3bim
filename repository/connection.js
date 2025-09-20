import mysql from 'mysql2/promise'


let connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin@123',
  database: 'chatDB'
})


export { connection }

