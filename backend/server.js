const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const path = require('path'); // Required to find your frontend folders

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ DATABASE_URL is missing!");
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// 2. API Routes (Keep these ABOVE the static file code)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is healthy' });
});

// 3. SERVE FRONTEND (This makes your App open)
// This tells Express where the React "build" folder is
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// 4. THE MAGIC LINK
// If a user goes to any URL that isn't an API, show the React App
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 5. Start Server
const PORT = process.env.PORT || 10000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 App is live at your Render URL!`);
    });
  })
  .catch(err => console.error('❌ DB Error:', err));
