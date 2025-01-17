# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

### Limitations

Given the time constraints, we do not expect a fully production-ready solution. We're primarily interested in the approach and the overall quality of the solution. 
Feel free to modify the current codebase as needed, including adding or removing dependencies. 
For larger or more time-intensive changes, you're welcome to outline your ideas in the write-up section below and discuss them further during the call.

<img src="./assets/search-example.png" width="400px" />

### Write-up

MongoDB does not provide performant partial text search native capabilities for local/self-hosted deployments. Creating [Text Indexes](https://www.mongodb.com/docs/manual/core/link-text-indexes/) could be an option, but it does not perform partial text search by default. Only exact matches are returned. So, to perform partial-text searches using text indexes, a way could be to create ngrams with all possible lenght combinations of the search terms and then index them all. Also, for each new data entry or update, your ngrams would need to be recomputed and indexed. This solution would require a lot of development time due to its complexity and would likely be hard to maintain in the long run.

Another solution could be using [Query $regex](https://www.mongodb.com/docs/manual/reference/operator/query/regex/), but it does not follow text indexes. It's definetly not performant for large datasets.

The optimal (MongoDB-based) solution is to use [Atlas Search](https://www.mongodb.com/docs/atlas/atlas-search). It's a full-text search & vector-search capability, specifically designed for this purpose. However, it's only available for [Mongo Atlas, the MongoDB Cloud Infrastructure](https://www.mongodb.com/products/platform/atlas-database).

#### Personal Experience
I tried to use the [MongoDB Atlas Local Docker Image](https://hub.docker.com/r/mongodb/mongodb-atlas-local), but I couldn't make it work.

### Database structure

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "name": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
