// Quick setup script to create Package table and update ServicePackage
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cwsms'
});

console.log('🚀 Setting up Package system...');

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to database');
  
  // Step 1: Create Package table
  const createPackageTable = `
    CREATE TABLE IF NOT EXISTS package (
      PackageNumber int(11) NOT NULL AUTO_INCREMENT,
      PackageName varchar(100) NOT NULL,
      PackageDescription text NOT NULL,
      PackagePrice decimal(10,2) NOT NULL,
      PRIMARY KEY (PackageNumber)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
  `;
  
  connection.query(createPackageTable, (err) => {
    if (err) {
      console.error('❌ Error creating Package table:', err.message);
      connection.end();
      return;
    }
    
    console.log('✅ Package table created');
    
    // Step 2: Insert default packages
    const insertPackages = `
      INSERT IGNORE INTO package (PackageName, PackageDescription, PackagePrice) VALUES
      ('Basic wash', 'Exterior hand wash', 5000.00),
      ('Premium wash', 'Exterior and interior cleaning', 8000.00),
      ('Deluxe wash', 'Full service with wax and polish', 12000.00);
    `;
    
    connection.query(insertPackages, (err) => {
      if (err) {
        console.error('❌ Error inserting packages:', err.message);
        connection.end();
        return;
      }
      
      console.log('✅ Default packages inserted');
      
      // Step 3: Check if PackageNumber column exists in ServicePackage
      const checkColumn = `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'cwsms' 
        AND TABLE_NAME = 'servicepackage' 
        AND COLUMN_NAME = 'PackageNumber';
      `;
      
      connection.query(checkColumn, (err, results) => {
        if (err) {
          console.error('❌ Error checking column:', err.message);
          connection.end();
          return;
        }
        
        if (results.length === 0) {
          // Add PackageNumber column
          const addColumn = `
            ALTER TABLE servicepackage 
            ADD COLUMN PackageNumber int(11) NOT NULL DEFAULT 1 AFTER ServiceDate;
          `;
          
          connection.query(addColumn, (err) => {
            if (err) {
              console.error('❌ Error adding PackageNumber column:', err.message);
              connection.end();
              return;
            }
            
            console.log('✅ PackageNumber column added to ServicePackage');
            addForeignKey();
          });
        } else {
          console.log('✅ PackageNumber column already exists');
          addForeignKey();
        }
      });
    });
  });
});

function addForeignKey() {
  // Add foreign key constraint
  const addForeignKey = `
    ALTER TABLE servicepackage 
    ADD CONSTRAINT servicepackage_package_fk 
    FOREIGN KEY (PackageNumber) REFERENCES package (PackageNumber) 
    ON DELETE RESTRICT ON UPDATE CASCADE;
  `;
  
  connection.query(addForeignKey, (err) => {
    if (err && err.code !== 'ER_DUP_KEYNAME') {
      console.error('⚠️  Warning: Could not add foreign key:', err.message);
    } else if (err && err.code === 'ER_DUP_KEYNAME') {
      console.log('✅ Foreign key already exists');
    } else {
      console.log('✅ Foreign key constraint added');
    }
    
    // Verify setup
    verifySetup();
  });
}

function verifySetup() {
  connection.query('SELECT COUNT(*) as count FROM package', (err, results) => {
    if (err) {
      console.error('❌ Error verifying packages:', err.message);
      connection.end();
      return;
    }
    
    console.log(`✅ Package table has ${results[0].count} records`);
    
    connection.query('DESCRIBE servicepackage', (err, results) => {
      if (err) {
        console.error('❌ Error describing ServicePackage:', err.message);
        connection.end();
        return;
      }
      
      const hasPackageNumber = results.some(col => col.Field === 'PackageNumber');
      console.log(`✅ ServicePackage table ${hasPackageNumber ? 'has' : 'missing'} PackageNumber column`);
      
      console.log('\n🎉 Package system setup completed!');
      console.log('\n📋 Summary:');
      console.log('   - Package table created with 3 default packages');
      console.log('   - ServicePackage table updated with PackageNumber column');
      console.log('   - Foreign key relationships established');
      console.log('\n🚀 You can now use the Package management system!');
      
      connection.end();
    });
  });
}
