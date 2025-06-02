const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
};

const dbName = 'cwsms';

console.log('🚀 Car Wash Management System - Auto Setup');
console.log('📋 This script will:');
console.log('   ✓ Create database if it doesn\'t exist');
console.log('   ✓ Create all required tables with proper structure');
console.log('   ✓ Insert sample data');
console.log('   ✓ Set up default admin user');
console.log('');

// Check if reset flag is provided
const shouldReset = process.argv.includes('--reset');
if (shouldReset) {
  console.log('⚠️  RESET MODE: Will drop existing database and recreate everything');
  console.log('');
}

// Create connection without database
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    console.error('💡 Make sure MySQL is running and credentials are correct');
    process.exit(1);
  }
  
  console.log('✅ Connected to MySQL server');
  
  if (shouldReset) {
    // Drop database if reset flag is provided
    connection.query(`DROP DATABASE IF EXISTS ${dbName}`, (err) => {
      if (err) {
        console.error('❌ Error dropping database:', err);
        process.exit(1);
      }
      console.log(`🗑️  Dropped existing database '${dbName}'`);
      createDatabase();
    });
  } else {
    createDatabase();
  }
});

function createDatabase() {
  // Create database if it doesn't exist
  connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
    if (err) {
      console.error('❌ Error creating database:', err);
      process.exit(1);
    }
    
    console.log(`✅ Database '${dbName}' created/verified`);
    
    // Use the database
    connection.query(`USE ${dbName}`, (err) => {
      if (err) {
        console.error('❌ Error selecting database:', err);
        process.exit(1);
      }
      
      console.log('✅ Using database:', dbName);
      createTables();
    });
  });
}

function createTables() {
  console.log('📝 Creating tables...');
  
  const createTablesSQL = `
    -- Create Users table
    CREATE TABLE IF NOT EXISTS Users (
      UserID int(11) NOT NULL AUTO_INCREMENT,
      Username varchar(50) NOT NULL UNIQUE,
      Password varchar(255) NOT NULL,
      FullName varchar(100) NOT NULL,
      PRIMARY KEY (UserID)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    -- Create Car table
    CREATE TABLE IF NOT EXISTS Car (
      PlateNumber varchar(20) NOT NULL,
      CarType varchar(50) NOT NULL,
      CarSize varchar(20) NOT NULL,
      DriverName varchar(100) NOT NULL,
      PhoneNumber varchar(20) NOT NULL,
      PRIMARY KEY (PlateNumber)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    -- Create Package table
    CREATE TABLE IF NOT EXISTS Package (
      PackageNumber int(11) NOT NULL AUTO_INCREMENT,
      PackageName varchar(100) NOT NULL,
      PackageDescription text NOT NULL,
      PackagePrice decimal(10,2) NOT NULL,
      PRIMARY KEY (PackageNumber)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    -- Create ServicePackage table with PackageNumber column
    CREATE TABLE IF NOT EXISTS ServicePackage (
      RecordNumber int(11) NOT NULL AUTO_INCREMENT,
      PlateNumber varchar(20) NOT NULL,
      ServiceDate date NOT NULL,
      PackageNumber int(11) NOT NULL DEFAULT 1,
      PRIMARY KEY (RecordNumber),
      FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (PackageNumber) REFERENCES Package(PackageNumber) ON DELETE RESTRICT ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    -- Create Payment table
    CREATE TABLE IF NOT EXISTS Payment (
      PaymentNumber int(11) NOT NULL AUTO_INCREMENT,
      RecordNumber int(11) NOT NULL,
      AmountPaid decimal(10,2) NOT NULL,
      PaymentDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (PaymentNumber),
      FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber) ON DELETE CASCADE ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `;
  
  connection.query(createTablesSQL, (err) => {
    if (err) {
      console.error('❌ Error creating tables:', err);
      process.exit(1);
    }
    
    console.log('✅ All tables created successfully');
    insertSampleData();
  });
}

function insertSampleData() {
  console.log('📝 Inserting sample data...');
  
  const sampleDataSQL = `
    -- Insert default packages
    INSERT IGNORE INTO Package (PackageName, PackageDescription, PackagePrice) VALUES
    ('Basic wash', 'Exterior hand wash', 5000.00),
    ('Premium wash', 'Exterior and interior cleaning', 8000.00),
    ('Deluxe wash', 'Full service with wax and polish', 12000.00);

    -- Insert sample cars
    INSERT IGNORE INTO Car (PlateNumber, CarType, CarSize, DriverName, PhoneNumber) VALUES
    ('RAC223d', 'Sedan', 'Medium', 'MBUTO', '+250788123456'),
    ('RAD123A', 'SUV', 'Large', 'John Doe', '+250788234567'),
    ('RAE456B', 'Hatchback', 'Small', 'Jane Smith', '+250788345678'),
    ('RAF789C', 'Pickup', 'Large', 'Robert Johnson', '+250788456789');

    -- Insert sample service records
    INSERT IGNORE INTO ServicePackage (RecordNumber, PlateNumber, ServiceDate, PackageNumber) VALUES
    (1, 'RAC223d', '2025-05-29', 1),
    (2, 'RAD123A', '2025-05-29', 2),
    (3, 'RAE456B', '2025-05-28', 1),
    (4, 'RAF789C', '2025-05-29', 3);

    -- Insert sample payments
    INSERT IGNORE INTO Payment (PaymentNumber, RecordNumber, AmountPaid, PaymentDate) VALUES
    (1, 1, 5000.00, '2025-05-29 10:30:00'),
    (2, 2, 7500.00, '2025-05-29 11:15:00'),
    (3, 3, 6000.00, '2025-05-28 14:20:00'),
    (4, 4, 3000.00, '2025-05-29 16:45:00');

    -- Insert default admin user (password: admin123)
    INSERT IGNORE INTO Users (Username, Password, FullName) VALUES
    ('admin', 'admin123', 'System Administrator');
  `;
  
  connection.query(sampleDataSQL, (err) => {
    if (err) {
      console.error('❌ Error inserting sample data:', err);
      process.exit(1);
    }
    
    console.log('✅ Sample data inserted successfully');
    verifySetup();
  });
}

function verifySetup() {
  console.log('🔍 Verifying database setup...');
  
  const verifySQL = `
    SELECT 
      (SELECT COUNT(*) FROM Car) as cars_count,
      (SELECT COUNT(*) FROM Package) as packages_count,
      (SELECT COUNT(*) FROM ServicePackage) as services_count,
      (SELECT COUNT(*) FROM Payment) as payments_count,
      (SELECT COUNT(*) FROM Users) as users_count
  `;
  
  connection.query(verifySQL, (err, results) => {
    if (err) {
      console.error('❌ Error verifying setup:', err);
      process.exit(1);
    }
    
    const counts = results[0];
    console.log('📊 Database Statistics:');
    console.log(`   Cars: ${counts.cars_count}`);
    console.log(`   Packages: ${counts.packages_count}`);
    console.log(`   Service Records: ${counts.services_count}`);
    console.log(`   Payments: ${counts.payments_count}`);
    console.log(`   Users: ${counts.users_count}`);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the backend: npm run dev');
    console.log('   2. Start the frontend: npm run dev (in frontend folder)');
    console.log('   3. Login with: admin / admin123');
    console.log('\n🔗 Default login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
    connection.end();
    process.exit(0);
  });
}
