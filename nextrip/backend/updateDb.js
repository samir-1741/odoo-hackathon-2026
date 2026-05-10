const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function updateDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'nextrip'
    });

    console.log('Connected to MySQL. Updating trips table...');
    
    // Ignore errors if columns already exist
    try {
        await connection.query("ALTER TABLE trips ADD COLUMN booking_type ENUM('package', 'flight', 'hotel') DEFAULT 'package';");
        console.log('Added booking_type column');
    } catch(e) { console.log('booking_type column might already exist.'); }
    
    try {
        await connection.query("ALTER TABLE trips ADD COLUMN details TEXT;");
        console.log('Added details column');
    } catch(e) { console.log('details column might already exist.'); }

    try {
        await connection.query("ALTER TABLE trips ADD COLUMN image_url VARCHAR(255);");
        console.log('Added image_url column');
    } catch(e) { console.log('image_url column might already exist.'); }

    await connection.end();
    console.log('Database updated successfully.');
  } catch (error) {
    console.error('Error updating database:', error);
  }
}

updateDb();
