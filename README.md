# whatsapp-backend

### Getting Started

1. Make sure you have the following setup
   - Node.js v20.10.0
   - pnpm (npm install -g pnpm)
2. Dependencies
   - If you have docker installed, you can run `docker-compose up` to start the database, redis, kafka etc.
   - else, you can use your own custom/local mongodb, redis, kafka and zookeeper setup
3. Make sure to add environment variables to the .env file, see `utils/env.ts` for which environment variables are required
4. See `package.json` for all the available scripts
