import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { MongoClient, ObjectId } from 'mongodb';

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

const hotelsParamsSchema = joi.object({
  id: joi.string().hex().length(24).required(),
});

app.get(
  '/hotels/:id',
  validator.params(hotelsParamsSchema),
  async (req, res) => {
    const mongoClient = new MongoClient(DATABASE_URL);
    try {
      await mongoClient.connect();
      const db = mongoClient.db();

      const id = new ObjectId(req.params.id);
      const hotel = await db.collection('hotels').findOne(id);

      if (!hotel) {
        res.status(404).send();
        return;
      }

      res.send(hotel);
    } finally {
      await mongoClient.close();
    }
  },
);

const cityParamsSchema = joi.object({
  id: joi.string().hex().length(24).required(),
});

app.get('/cities/:id', validator.params(cityParamsSchema), async (req, res) => {
  const mongoClient = new MongoClient(DATABASE_URL);
  try {
    await mongoClient.connect();
    const db = mongoClient.db();

    const id = new ObjectId(req.params.id);
    const city = await db.collection('cities').findOne(id);

    if (!city) {
      res.status(404).send();
      return;
    }

    const hotels_agg = [
      {
        $search: {
          text: {
            query: city.name,
            path: 'city',
          },
        },
      },
    ];

    const hotels = await db
      .collection('hotels')
      .aggregate(hotels_agg)
      .toArray();

    res.send({ ...city, hotels });
  } finally {
    await mongoClient.close();
  }
});

const countryParamsSchema = joi.object({
  id: joi.string().hex().length(24).required(),
});

app.get(
  '/countries/:id',
  validator.params(countryParamsSchema),
  async (req, res) => {
    const mongoClient = new MongoClient(DATABASE_URL);
    try {
      await mongoClient.connect();
      const db = mongoClient.db();

      const id = new ObjectId(req.params.id);
      const country = await db.collection('countries').findOne(id);

      if (!country) {
        res.status(404).send();
        return;
      }

      const hotels_agg = [
        {
          $search: {
            text: {
              query: country.name,
              path: 'country',
            },
          },
        },
      ];

      const hotels = await db
        .collection('hotels')
        .aggregate(hotels_agg)
        .toArray();

      res.send({ ...country, hotels });
    } finally {
      await mongoClient.close();
    }
  },
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
