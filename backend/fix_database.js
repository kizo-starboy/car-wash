const mysql = require('mysql2');

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cwsms'
});

async function fixDatabase() {
  try {
    console.log('Connecting to MySQL database...');
    
    // Drop existing tables to recreate them properly
    console.log('Dropping existing tables...');
    
    await executeQuery('SET FOREIGN_KEY_CHECKS = 0');
    await executeQuery('DROP TABLE IF EXISTS payment');
    await executeQuery('DROP TABLE IF EXISTS servicepackage');
    await executeQuery('DROP TABLE IF EXISTS car');
    await executeQuery('DROP TABLE IF EXISTS users');
    await executeQuery('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Creating car table...');
    await executeQuery(`
      CREATE TABLE car (
        PlateNumber varchar(20) NOT NULL,
        CarType varchar(50) NOT NULL,
        CarSize varchar(50) NOT NULL,
        DriverName varchar(100) NOT NULL,
        PhoneNumber varchar(20) NOT NULL,
        PRIMARY KEY (PlateNumber)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    
    console.log('Creating servicepackage table...');
    await executeQuery(`
      CREATE TABLE servicepackage (
        RecordNumber int(11) NOT NULL AUTO_INCREMENT,
        PlateNumber varchar(20) NOT NULL,
        ServiceDate date NOT NULL,
        PRIMARY KEY (RecordNumber),
        KEY PlateNumber (PlateNumber),
        FOREIGN KEY (PlateNumber) REFERENCES car(PlateNumber) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    
    console.log('Creating payment table...');
    await executeQuery(`
      CREATE TABLE payment (
        PaymentNumber int(11) NOT NULL AUTO_INCREMENT,
        RecordNumber int(11) NOT NULL,
        AmountPaid decimal(10,2) NOT NULL,
        PaymentDate date NOT NULL,
        PRIMARY KEY (PaymentNumber),
        KEY RecordNumber (RecordNumber),
        FOREIGN KEY (RecordNumber) REFERENCES servicepackage(RecordNumber) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    
    console.log('Creating users table...');
    await executeQuery(`
      CREATE TABLE users (
        UserID int(11) NOT NULL AUTO_INCREMENT,
        Username varchar(50) NOT NULL,
        Password varchar(255) NOT NULL,
        FullName varchar(100) NOT NULL,
        PRIMARY KEY (UserID),
        UNIQUE KEY Username (Username)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    
    console.log('Inserting sample data...');
    
    // Insert cars
    await executeQuery(`
      INSERT INTO car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES
      ('RAC223d', 'Sedan', 'Small', 'MBUTO', '0786984892'),
      ('RAD123A', 'Sedan', 'Medium', 'John Doe', '0781234567'),
      ('RAE456B', 'SUV', 'Large', 'Jane Smith', '0789876543'),
      ('RAF789C', 'Hatchback', 'Small', 'Robert Johnson', '0723456789')
    `);
    
    // Insert service packages
    await executeQuery(`
      INSERT INTO servicepackage (PlateNumber, ServiceDate) VALUES
      ('RAC223d', '2025-05-29'),
      ('RAD123A', '2025-05-29'),
      ('RAE456B', '2025-05-28'),
      ('RAF789C', '2025-05-29')
    `);
    
    // Insert payments
    await executeQuery(`
      INSERT INTO payment (RecordNumber, AmountPaid, PaymentDate) VALUES
      (1, 5000.00, '2025-05-29'),
      (2, 7500.00, '2025-05-29'),
      (3, 6000.00, '2025-05-28'),
      (4, 3000.00, '2025-05-29')
    `);
    
    // Insert admin user
    await executeQuery(`
      INSERT INTO users (Username, Password, FullName) VALUES
      ('admin', 'admin123', 'Administrator')
    `);
    
    console.log('Testing the database structure...');
    
    // Test query
    const testResults = await executeQuery(`
      SELECT 
        c.PlateNumber, c.DriverName,
        sp.RecordNumber, sp.ServiceDate,
        p.PaymentNumber, p.AmountPaid
      FROM car c
      LEFT JOIN servicepackage sp ON c.PlateNumber = sp.PlateNumber
      LEFT JOIN payment p ON sp.RecordNumber = p.RecordNumber
      ORDER BY c.PlateNumber
    `);
    
    console.log('Test query results:');
    console.table(testResults);
    
    console.log('Database setup completed successfully!');
    
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    connection.end();
  }
}

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

// Run the setup
fixDatabase();
