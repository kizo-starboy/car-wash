const mysql = require('mysql2/promise');
const fs = require('fs');

async function runMigration() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'cwsms'
    });
    
    console.log('Connected to database');
    
    // Read migration file
    const migration = fs.readFileSync('./add_package_migration.sql', 'utf8');
    const statements = migration.split(';').filter(stmt => stmt.trim());
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`Executing statement ${i + 1}/${statements.length}:`);
        console.log(statement.substring(0, 100) + '...');
        
        try {
          await connection.execute(statement);
          console.log('✓ Success');
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR' || error.code === 'ER_DUP_FIELDNAME') {
            console.log('⚠ Already exists, skipping');
          } else {
            throw error;
          }
        }
      }
    }
    
    console.log('\n✅ Migration completed successfully!');
    
    // Verify the migration
    console.log('\nVerifying migration...');
    const [tables] = await connection.execute("SHOW TABLES LIKE 'package'");
    if (tables.length > 0) {
      console.log('✓ Package table created');
      
      const [columns] = await connection.execute("DESCRIBE servicepackage");
      const hasPackageNumber = columns.some(col => col.Field === 'PackageNumber');
      if (hasPackageNumber) {
        console.log('✓ PackageNumber column added to ServicePackage table');
      } else {
        console.log('✗ PackageNumber column not found in ServicePackage table');
      }
      
      const [packages] = await connection.execute("SELECT COUNT(*) as count FROM package");
      console.log(`✓ Package table has ${packages[0].count} records`);
    } else {
      console.log('✗ Package table not found');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Error details:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the migration
runMigration();
