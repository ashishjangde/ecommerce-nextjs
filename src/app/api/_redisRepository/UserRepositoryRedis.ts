import handleDatabaseOperation from "../_utils/handelDatabaseOperation";
import redisClient from "@/db/connectRedisDb";
import { User } from "@prisma/client";

const EXPIRATION_TIME = 60; 

export const userRepositoryRedis = {

  saveUser: async (
    userId: string,
    userData: Partial<User>,
  ): Promise<void> => {
    return await handleDatabaseOperation(async () => {
      const key = `user:${userId}`;
      await redisClient.set(key, JSON.stringify(userData));
      await redisClient.expire(key, EXPIRATION_TIME);
    });
  },


  getUserById: async (
    userId: string
  ): Promise<User | null> => {
    return await handleDatabaseOperation(async () => {
      const key = `user:${userId}`;
      const data = await redisClient.get(key);
      if (data) {
        await redisClient.expire(key, EXPIRATION_TIME); 
        return JSON.parse(data) as User;
      }
      return null;
    });
  },

  updateUser: async (
    userId: string,
    userData: Partial<User>
  ): Promise<void> => {
    return await handleDatabaseOperation(async () => {
      const key = `user:${userId}`;
      await redisClient.set(key, JSON.stringify(userData));
      await redisClient.expire(key, EXPIRATION_TIME); 
    });
  },

  getUserByEmail: async (
    email: string
  ): Promise<User | null> => {
    return await handleDatabaseOperation(async () => {
      const keys = await redisClient.keys(`user:*`); 
      for (const key of keys) {
        const data = await redisClient.get(key);
        const user = JSON.parse(data as string) as User;
        if (user.email === email) {
          await redisClient.expire(key, EXPIRATION_TIME); 
          return user;
        }
      }
      return null;
    });
  },

  deleteUser: async (userId: string): Promise<number | null> => {
    return await handleDatabaseOperation(async () => {
      const key = `user:${userId}`;
      if (await redisClient.exists(key)) {
        await redisClient.del(key);
      }
     return null;
    });
  },


  
};

export default userRepositoryRedis;
