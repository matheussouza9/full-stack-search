import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

import { cities as cities_data } from 'db/seeds/cities.js';
import { countries as countries_data } from './seeds/countries';
import { hotels as hotels_data } from './seeds/hotels';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const resetDB = process.argv.includes('--reset');

const client = new MongoClient(DATABASE_URL);
try {
  await client.connect();
  const db = client.db();

  if (resetDB) {
    await db.dropCollection('cities');
    await db.dropCollection('countries');
    await db.dropCollection('hotels');
  }

  const cities = db.collection('cities');
  await cities.insertMany(cities_data);
  await cities.createSearchIndex({
    definition: {
      mappings: {
        dynamic: false,
        fields: {
          name: [
            {
              type: 'string',
            },
            {
              type: 'autocomplete',
              tokenization: 'edgeGram',
              minGrams: 3,
              maxGrams: 5,
            },
          ],
        },
      },
    },
  });

  const countries = db.collection('countries');
  await countries.insertMany(countries_data);
  await countries.createSearchIndex({
    definition: {
      mappings: {
        dynamic: false,
        fields: {
          name: [
            {
              type: 'string',
            },
            {
              type: 'autocomplete',
              tokenization: 'edgeGram',
              minGrams: 3,
              maxGrams: 5,
            },
          ],
        },
      },
    },
  });

  const hotels = db.collection('hotels');
  await hotels.insertMany(hotels_data);
  await hotels.createSearchIndex({
    definition: {
      mappings: {
        dynamic: false,
        fields: {
          hotel_name: [
            {
              type: 'string',
            },
            {
              type: 'autocomplete',
              tokenization: 'edgeGram',
              minGrams: 3,
              maxGrams: 5,
            },
          ],
          city: [
            {
              type: 'string',
            },
            {
              type: 'autocomplete',
              tokenization: 'edgeGram',
              minGrams: 3,
              maxGrams: 5,
            },
          ],
          country: [
            {
              type: 'string',
            },
            {
              type: 'autocomplete',
              tokenization: 'edgeGram',
              minGrams: 3,
              maxGrams: 5,
            },
          ],
        },
      },
    },
  });
} catch (error) {
  console.error('Error seeding database:', error);
} finally {
  await client.close();
}
