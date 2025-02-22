const csv = require('csv-parser');
const fs = require('fs');
const { Dish, sequelize } = require('../models/dishModel.js');

const results = [];

fs.createReadStream('indian_food.csv')
  .pipe(csv())
  .on('data', (data) => {
    const cleanedData = {
      name: data.name.trim().toLowerCase(),
      ingredients: data.ingredients.split(',').map(ing => ing.trim().toLowerCase()),
      diet: data.diet.trim().toLowerCase(),
      prep_time: data.prep_time === '-1' ? null : Number(data.prep_time),
      cook_time: data.cook_time === '-1' ? null : Number(data.cook_time),
      flavor_profile: data.flavor_profile.trim().toLowerCase(),
      course: data.course.trim().toLowerCase(),
      state: data.state === '-1' ? null : data.state.trim().toLowerCase(),
      region: data.region === '-1' ? null : data.region.trim().toLowerCase()
    };
    results.push(cleanedData);
  })
  .on('end', async () => {
    try {
      // Sync the database: force:true drops existing table
      await sequelize.sync({ force: true });
      await Dish.bulkCreate(results);
      console.log('Data seeded successfully!');
      await sequelize.close();
    } catch (err) {
      console.error('Seeding error:', err);
      process.exit(1);
    }
  });
