const db = require('./db');

console.log('🔧 Fixing ServicePackage table structure...');

// First, check if PackageNumber column exists
const checkColumnQuery = `
  SELECT COLUMN_NAME 
  FROM INFORMATION_SCHEMA.COLUMNS 
  WHERE TABLE_SCHEMA = 'cwsms' 
  AND TABLE_NAME = 'ServicePackage' 
  AND COLUMN_NAME = 'PackageNumber'
`;

db.query(checkColumnQuery, (err, results) => {
  if (err) {
    console.error('❌ Error checking column:', err);
    process.exit(1);
  }

  if (results.length === 0) {
    console.log('📝 PackageNumber column missing, adding it...');
    
    // Add PackageNumber column
    const addColumnQuery = `
      ALTER TABLE ServicePackage 
      ADD COLUMN PackageNumber int(11) NOT NULL DEFAULT 1 
      AFTER ServiceDate
    `;
    
    db.query(addColumnQuery, (err, result) => {
      if (err) {
        console.error('❌ Error adding PackageNumber column:', err);
        process.exit(1);
      }
      
      console.log('✅ PackageNumber column added successfully');
      
      // Add foreign key constraint
      const addForeignKeyQuery = `
        ALTER TABLE ServicePackage 
        ADD CONSTRAINT servicepackage_package_fk 
        FOREIGN KEY (PackageNumber) REFERENCES package (PackageNumber) 
        ON DELETE RESTRICT ON UPDATE CASCADE
      `;
      
      db.query(addForeignKeyQuery, (err, result) => {
        if (err && !err.message.includes('Duplicate key name')) {
          console.error('❌ Error adding foreign key:', err);
          process.exit(1);
        }
        
        console.log('✅ Foreign key constraint added');
        
        // Update existing records to have valid PackageNumber
        const updateQuery = `
          UPDATE ServicePackage 
          SET PackageNumber = 1 
          WHERE PackageNumber IS NULL OR PackageNumber = 0
        `;
        
        db.query(updateQuery, (err, result) => {
          if (err) {
            console.error('❌ Error updating existing records:', err);
            process.exit(1);
          }
          
          console.log('✅ Existing records updated with default package');
          console.log('🎉 ServicePackage table fixed successfully!');
          console.log('🚀 Your application should now work without errors!');
          process.exit(0);
        });
      });
    });
  } else {
    console.log('✅ PackageNumber column already exists');
    console.log('🎉 ServicePackage table is already properly configured!');
    process.exit(0);
  }
});
