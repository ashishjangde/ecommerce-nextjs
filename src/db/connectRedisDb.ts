import CreateClient from 'redis';

const redisClient = CreateClient
    .createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
      })
    .connect();

export default redisClient;