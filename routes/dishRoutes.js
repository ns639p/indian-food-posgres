const express = require('express');
const dishController = require('../controllers/dishController.js');

const router = express.Router();

router.get('/', dishController.getAllDishes);
router.get('/ingredients/available', dishController.getDishesByIngredients);
router.get('/:name', dishController.getDish);

module.exports = router;
