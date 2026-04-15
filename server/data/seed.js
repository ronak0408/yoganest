const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const YogaModule = require('../models/YogaModule');
const yogaModules = require('./yogaModules');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yoganest';

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await YogaModule.deleteMany({});
    console.log('Cleared existing YogaModule documents.');

    const inserted = await YogaModule.insertMany(yogaModules);
    console.log(`Successfully seeded ${inserted.length} yoga modules.`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
    process.exit(0);
  }
};

seed();
