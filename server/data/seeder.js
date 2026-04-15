require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const YogaModule = require('../models/YogaModule');
const yogaModules = require('./yogaModules');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/yoganest';

const seedDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding');

    await YogaModule.deleteMany({});
    console.log('Cleared existing yoga modules');

    const inserted = await YogaModule.insertMany(yogaModules);
    console.log(`Successfully seeded ${inserted.length} yoga modules`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Seeder error:', err.message);
    process.exit(1);
  }
};

seedDB();
