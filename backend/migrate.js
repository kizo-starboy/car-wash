const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'CWSMS',
  multipleStatements: true
}

// Create connection
const connection = mysql.createConnection(dbConfig)

// Read the migration SQL file
const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrate_database.sql'), 'utf8')

console.log('Starting database migration...')

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err)
    return
  }

  console.log('Connected to MySQL database')

  // Execute the migration
  connection.query(migrationSQL, (err, results) => {
    if (err) {
      console.error('Migration error:', err)
      connection.end()
      return
    }

    console.log('Migration completed successfully!')
    console.log('Database schema has been updated to the simplified structure.')

    connection.end()
  })
})
