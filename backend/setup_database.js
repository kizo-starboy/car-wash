const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database connection without specifying database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
});

async function setupDatabase() {
  try {
    console.log('Connecting to MySQL...');
    
    // Create database if it doesn't exist
    await new Promise((resolve, reject) => {
      connection.query('CREATE DATABASE IF NOT EXISTS cwsms', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('Database "cwsms" created or already exists');
    
    // Use the database
    await new Promise((resolve, reject) => {
      connection.query('USE cwsms', (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('Using database "cwsms"');
    
    // Read and execute the SQL file
    const sqlFile = path.join(__dirname, 'cwsms.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split SQL content by statements and execute them
    const statements = sqlContent.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement && !statement.startsWith('--') && !statement.startsWith('/*')) {
        try {
          await new Promise((resolve, reject) => {
            connection.query(statement, (err, results) => {
              if (err) {
                // Ignore errors for DROP TABLE IF EXISTS and similar statements
                if (err.code === 'ER_BAD_TABLE_ERROR' || err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                  console.log(`Ignoring expected error: ${err.message}`);
                  resolve(results);
                } else {
                  reject(err);
                }
              } else {
                resolve(results);
              }
            });
          });
        } catch (error) {
          console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
          console.error(error.message);
        }
      }
    }
    
    console.log('Database setup completed successfully!');
    
    // Test the connection with the new schema
    const testQuery = `
      SELECT 
        c.PlateNumber, c.DriverName,
        sp.RecordNumber, sp.ServiceDate,
        p.PaymentNumber, p.AmountPaid
      FROM car c
      LEFT JOIN servicepackage sp ON c.PlateNumber = sp.PlateNumber
      LEFT JOIN payment p ON sp.RecordNumber = p.RecordNumber
      LIMIT 5
    `;
    
    const testResults = await new Promise((resolve, reject) => {
      connection.query(testQuery, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
    
    console.log('Test query results:');
    console.table(testResults);
    
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    connection.end();
  }
}

// Run the setup
setupDatabase();
