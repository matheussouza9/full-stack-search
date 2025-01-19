import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { ObjectId } from 'mongodb';

import { getDB } from './db/connection';

import joi from 'joi';
import {
  ContainerTypes,
  ValidatedRequest,
  ValidatedRequestSchema,
  createValidator,
} from 'express-joi-validation';

dotenv.config();

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
    try {
      const db = await getDB();

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
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
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
    try {
      const id = new ObjectId(req.params.id);

      const db = await getDB();
      const hotel = await db.collection('hotels').findOne(id);

      if (!hotel) {
        res.status(404).send();
        return;
      }

      res.send(hotel);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
);

const cityParamsSchema = joi.object({
  id: joi.string().hex().length(24).required(),
});

app.get('/cities/:id', validator.params(cityParamsSchema), async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);

    const db = await getDB();
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
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

const countryParamsSchema = joi.object({
  id: joi.string().hex().length(24).required(),
});

app.get(
  '/countries/:id',
  validator.params(countryParamsSchema),
  async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);

      const db = await getDB();
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
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  },
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`);
});
