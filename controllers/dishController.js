const { Dish } = require('../models/dishModel.js');
const APIFeatures = require('../utils/apiFeatures.js');
const { Op } = require('sequelize');

exports.getAllDishes = async (req, res) => {
  try {
    const features = new APIFeatures(req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const dishes = await Dish.findAll(features.queryOptions);

    res.status(200).json({
      status: 'success',
      length: dishes.length,
      data: { dishes }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getDish = async (req, res) => {
  try {
    // Search by name (convert to lowercase to match our seed data)
    const dish = await Dish.findOne({ where: { name: req.params.name.toLowerCase() } });
    if (!dish) return res.status(404).json({ 
      status: 'fail', 
      message: 'Dish not found' 
    });
    res.status(200).json({
      status: 'success',
      data: { dish }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message
    });
  }
};

exports.getDishesByIngredients = async (req, res) => {
  try {
    if (!req.query.ingredients) {
      return res.status(400).json({
        status: 'fail', 
        message: 'Ingredients query parameter is required'
      });
    }
    const ingredients = req.query.ingredients.split(',').map(item => item.trim().toLowerCase());
    
    // Use PostgreSQL "contains" operator; Sequelize supports this for ARRAY columns
    const dishes = await Dish.findAll({
      where: {
        ingredients: {
          [Op.contains]: ingredients
        }
      }
    });
    
    res.status(200).json({
      status: 'success',
      results: dishes.length,
      data: { dishes }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
