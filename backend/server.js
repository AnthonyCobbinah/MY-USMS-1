const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }
});

const Student = sequelize.define('Student', {
  school_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false }
});

// Middleware for Multi-tenancy
app.use((req, res, next) => {
  req.schoolId = req.headers['x-school-id'];
  next();
});

app.get('/api/students', async (req, res) => {
  const students = await Student.findAll({ where: { school_id: req.schoolId } });
  res.json(students);
});

app.post('/api/students', async (req, res) => {
  const student = await Student.create({ ...req.body, school_id: req.schoolId });
  res.json(student);
});

const PORT = process.env.PORT || 10000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server live on ${PORT}`));
});