const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cwsms'
});

console.log('Setting up Package table and updating ServicePackage table...');

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to database');

  // Step 1: Create Package table
  const createPackageTable = `
    CREATE TABLE IF NOT EXISTS package (
      PackageNumber int(11) NOT NULL AUTO_INCREMENT,
      PackageName varchar(100) NOT NULL,
      PackageDescription text NOT NULL,
      PackagePrice decimal(10,2) NOT NULL,
      PRIMARY KEY (PackageNumber)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `;

  db.query(createPackageTable, (err) => {
    if (err) {
      console.error('Error creating Package table:', err);
      return;
    }
    console.log('✓ Package table created/verified');

    // Step 2: Insert default packages
    const insertPackages = `
      INSERT IGNORE INTO package (PackageName, PackageDescription, PackagePrice) VALUES
      ('Basic wash', 'Exterior hand wash', 5000.00),
      ('Premium wash', 'Exterior and interior cleaning', 8000.00),
      ('Deluxe wash', 'Full service with wax and polish', 12000.00)
    `;

    db.query(insertPackages, (err) => {
      if (err) {
        console.error('Error inserting packages:', err);
        return;
      }
      console.log('✓ Default packages inserted');

      // Step 3: Check if PackageNumber column exists in ServicePackage
      const checkColumn = `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = 'cwsms' 
        AND TABLE_NAME = 'servicepackage' 
        AND COLUMN_NAME = 'PackageNumber'
      `;

      db.query(checkColumn, (err, results) => {
        if (err) {
          console.error('Error checking column:', err);
          return;
        }

        if (results.length === 0) {
          // Column doesn't exist, add it
          const addColumn = `
            ALTER TABLE servicepackage 
            ADD COLUMN PackageNumber int(11) NOT NULL DEFAULT 1 AFTER ServiceDate
          `;

          db.query(addColumn, (err) => {
            if (err) {
              console.error('Error adding PackageNumber column:', err);
              return;
            }
            console.log('✓ PackageNumber column added to ServicePackage table');

            // Step 4: Add foreign key constraint
            const addForeignKey = `
              ALTER TABLE servicepackage 
              ADD CONSTRAINT servicepackage_ibfk_2 
              FOREIGN KEY (PackageNumber) REFERENCES package (PackageNumber) 
              ON DELETE RESTRICT ON UPDATE CASCADE
            `;

            db.query(addForeignKey, (err) => {
              if (err && err.code !== 'ER_DUP_KEYNAME') {
                console.error('Error adding foreign key:', err);
                return;
              }
              console.log('✓ Foreign key constraint added');
              
              // Step 5: Verify setup
              verifySetup();
            });
          });
        } else {
          console.log('✓ PackageNumber column already exists');
          verifySetup();
        }
      });
    });
  });
});

function verifySetup() {
  // Verify packages
  db.query('SELECT COUNT(*) as count FROM package', (err, results) => {
    if (err) {
      console.error('Error verifying packages:', err);
      return;
    }
    console.log(`✓ Package table has ${results[0].count} records`);

    // Verify ServicePackage structure
    db.query('DESCRIBE servicepackage', (err, results) => {
      if (err) {
        console.error('Error describing ServicePackage:', err);
        return;
      }
      
      const hasPackageNumber = results.some(col => col.Field === 'PackageNumber');
      if (hasPackageNumber) {
        console.log('✓ ServicePackage table has PackageNumber column');
      } else {
        console.log('✗ ServicePackage table missing PackageNumber column');
      }

      console.log('\n🎉 Package setup completed successfully!');
      console.log('\nYou can now:');
      console.log('1. Manage packages in the frontend');
      console.log('2. Create service records with package selection');
      console.log('3. Generate reports with package information');
      
      db.end();
    });
  });
}
