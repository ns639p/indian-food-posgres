const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const Dish = sequelize.define('Dish', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  diet: DataTypes.STRING,
  prep_time: DataTypes.INTEGER,
  cook_time: DataTypes.INTEGER,
  flavor_profile: DataTypes.STRING,
  course: DataTypes.STRING,
  state: DataTypes.STRING,
  region: DataTypes.STRING,
}, {
  tableName: 'dishes',
  timestamps: false,
});

module.exports = { Dish, sequelize };
