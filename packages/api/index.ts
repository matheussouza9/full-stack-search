import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { MongoClient } from 'mongodb';

import joi from 'joi';
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator,
} from 'express-joi-validation';

dotenv.config();

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();
const validator = createValidator();

app.use(cors());
app.use(express.json());

const searchQuerySchema = joi.object({
  term: joi.string().required(),
});

interface SearchRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    term: string;
  };
}

app.get(
  '/search',
  validator.query(searchQuerySchema),
  async (req: ValidatedRequest<SearchRequestSchema>, res) => {
    const mongoClient = new MongoClient(DATABASE_URL);
    try {
      await mongoClient.connect();
      const db = mongoClient.db();

      const term = req.query.term;

      const hotels = db.collection('hotels');
      const hotels_agg = [
        {
          $search: {
            compound: {
              should: [
                {
                  autocomplete: {
                    query: term,
                    path: 'hotel_name',
                    score: {
                      boost: {
                        value: 2,
                      },
                    },
                  },
                },
                {
                  autocomplete: {
                    query: term,
                    path: 'city',
                  },
                },
                {
                  autocomplete: {
                    query: term,
                    path: 'country',
                  },
                },
              ],
              minimumShouldMatch: 1,
            },
          },
        },
        {
          $limit: 10,
        },
        {
          $project: {
            _id: 1,
            hotel_name: 1,
            city: 1,
            country: 1,
          },
        },
      ];

      const cities = db.collection('cities');
      const cities_agg = [
        {
          $search: {
            autocomplete: {
              query: term,
              path: 'name',
            },
          },
        },
        {
          $limit: 10,
        },
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ];

      const countries = db.collection('countries');
      const countries_agg = [
        {
          $search: {
            autocomplete: {
              query: term,
              path: 'name',
            },
          },
        },
        {
          $limit: 10,
        },
        {
          $project: {
            _id: 1,
            name: 1,
          },
        },
      ];

      const [hotels_result, cities_result, countries_result] =
        await Promise.all([
          hotels.aggregate(hotels_agg).toArray(),
          cities.aggregate(cities_agg).toArray(),
          countries.aggregate(countries_agg).toArray(),
        ]);

      res.send({
        hotels: hotels_result,
        cities: cities_result,
        countries: countries_result,
      });
    } finally {
      await mongoClient.close();
    }
  },
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
