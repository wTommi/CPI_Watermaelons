const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbDir = path.join(__dirname, './db');
const dbPath = path.join(dbDir, 'database.sqlite');

// Check if db directory exists, if not, create it
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Connect to SQLite database (will create file if it doesn't exist)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date INTEGER NOT NULL,
      price REAL NOT NULL UNIQUE,
      name TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Failed to create users table', err);
      } else {
        console.log('Users table is ready.');
        const data = [
          ['2004', 11.04, '西瓜(大粒)'],
          ['2004', 10.74, '西瓜(小粒)'],
          ['2004', 10.29, '西瓜(無子)'],
          ['2005', 14.44, '西瓜(大粒)'],
          ['2005', 17.99, '西瓜(小粒)'],
          ['2005', 12.24, '西瓜(無子)'],
          ['2006', 14.5, '西瓜(大粒)'],
          ['2006', 14.15, '西瓜(小粒)'],
          ['2006', 13.45, '西瓜(無子)'],
          ['2007', 11.61, '西瓜(大粒)'],
          ['2007', 11.21, '西瓜(小粒)'],
          ['2007', 13.93, '西瓜(無子)'],
          ['2008', 12.82, '西瓜(大粒)'],
          ['2008', 14.5, '西瓜(小粒)'],
          ['2008', 16.06, '西瓜(無子)'],
          ['2009', 11.03, '西瓜(大粒)'],
          ['2009', 11.16, '西瓜(小粒)'],
          ['2009', 12.09, '西瓜(無子)'],
          ['2010', 12.45, '西瓜(大粒)'],
          ['2010', 15.51, '西瓜(小粒)'],
          ['2010', 15.73, '西瓜(無子)'],
          ['2011', 14.26, '西瓜(大粒)'],
          ['2011', 14.64, '西瓜(小粒)'],
          ['2011', 17.23, '西瓜(無子)'],
          ['2012', 16.35, '西瓜(大粒)'],
          ['2012', 16.48, '西瓜(小粒)'],
          ['2012', 20.00, '西瓜(無子)'],
          ['2013', 14.57, '西瓜(大粒)'],
          ['2013', 14.15, '西瓜(小粒)'],
          ['2013', 9.50, '西瓜(無子)'],
          ['2014', 15.6, '西瓜(大粒)'],
          ['2014', 15.68, '西瓜(小粒)'],
          ['2014', null, '西瓜(無子)'],
          ['2015', 13.56, '西瓜(大粒)'],
          ['2015', 13.57, '西瓜(小粒)'],
          ['2015', null, '西瓜(無子)'],
          ['2016', 19.33, '西瓜(大粒)'],
          ['2016', 18.92, '西瓜(小粒)'],
          ['2016', null, '西瓜(無子)'],
          ['2017', 14.16, '西瓜(大粒)'],
          ['2017', 11.4, '西瓜(小粒)'],
          ['2017', null, '西瓜(無子)'],
          ['2018', 13.25, '西瓜(大粒)'],
          ['2018', 15.02, '西瓜(小粒)'],
          ['2018', null, '西瓜(無子)'],
          ['2019', 14.8, '西瓜(大粒)'],
          ['2019', 13.73, '西瓜(小粒)'],
          ['2019', null, '西瓜(無子)'],
          ['2020', 14.95, '西瓜(大粒)'],
          ['2020', 11.94, '西瓜(小粒)'],
          ['2020', null, '西瓜(無子)'],
          ['2021', 14.59, '西瓜(大粒)'],
          ['2021', 14.13, '西瓜(小粒)'],
          ['2021', null, '西瓜(無子)'],
          ['2022', 20.49, '西瓜(大粒)'],
          ['2022', 14.92, '西瓜(小粒)'],
          ['2022', null, '西瓜(無子)'],
          ['2023', 17.62, '西瓜(大粒)'],
          ['2023', 14.7, '西瓜(小粒)'],
          ['2023', null, '西瓜(無子)'],
          ['2024', 17.9, '西瓜(大粒)'],
          ['2024', 18.17, '西瓜(小粒)'],
          ['2024', null, '西瓜(無子)'],
        ];
        const insert = db.prepare('INSERT OR IGNORE INTO users (date, price, name) VALUES (?, ?, ?)');
        data.forEach(([date, price, name]) => {
          insert.run(date, price, name);
        });
        insert.finalize();
        console.log('Seed data inserted.');
      }
    });
  }
});

module.exports = db;

