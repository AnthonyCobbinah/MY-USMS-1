const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection with SSL (Required for Render)
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error("❌ CRITICAL ERROR: DATABASE_URL is missing in Render Environment Variables!");
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Fixes the common "SSL connection required" error
    }
  }
});

// 2. A simple Test Model (Example)
const Student = sequelize.define('Student', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true }
});

// 3. The "Front Door" Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
  res.send('✅ My USMS Backend is officially LIVE and running!');
});

// 4. A sample API route to fetch data
app.get('/students', async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Port and Server Start
const PORT = process.env.PORT || 10000;

sequelize.sync()
  .then(() => {
    console.log('✅ Database connected and synced');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is flying on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err);
  });
