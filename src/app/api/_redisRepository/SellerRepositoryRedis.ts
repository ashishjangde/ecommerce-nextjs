import handleDatabaseOperation from "../_utils/handelDatabaseOperation";
import redisClient from "@/db/connectRedisDb";
import { Seller } from "@prisma/client";

const EXPIRATION_TIME = 60; 

export const SellerRepositoryRedis = {

  saveSeller: async (
    sellerId: string,
    sellerData: Seller,
  ): Promise<void> => {
    return await handleDatabaseOperation(async () => {
      const key = `seller:${sellerId}`;
      await redisClient.set(key, JSON.stringify(sellerData));
      await redisClient.expire(key, EXPIRATION_TIME);
    });
  },

  getSellerById: async (
    sellerId: string
  ): Promise<Seller | null> => {
    return await handleDatabaseOperation(async () => {
      const key = `seller:${sellerId}`;
      const data = await redisClient.get(key);
      if (data) {
        await redisClient.expire(key, EXPIRATION_TIME); 
        return JSON.parse(data) as Seller;
      }
      return null;
    });
  },


  getSellerByEmail: async (
    email: string
  ): Promise<Seller | null> => {
    return await handleDatabaseOperation(async () => {
      const keys = await redisClient.keys(`seller:*`); 
      for (const key of keys) {
        const data = await redisClient.get(key);
        const seller = JSON.parse(data as string) as Seller;
        if (seller.email === email) {
          await redisClient.expire(key, EXPIRATION_TIME); 
          return seller;
        }
      }
      return null;
    });
  },


  getSellerByUserId: async (
    userId: string
  ): Promise<Seller | null> => {
    return await handleDatabaseOperation(async () => {
      const keys = await redisClient.keys(`seller:*`);
      for (const key of keys) {
        const data = await redisClient.get(key);
        const seller = JSON.parse(data as string) as Seller;
        if (seller.userId === userId) {
          await redisClient.expire(key, EXPIRATION_TIME);
          return seller;
        }
      }
      return null;
    });
  },

 
 


  deleteSeller: async (sellerId: string): Promise<number | null> => {
    return await handleDatabaseOperation(async () => {
      const key = `seller:${sellerId}`;
      if (await redisClient.exists(key)) {
        await redisClient.del(key);
        return 1; 
      }
      return null;
    });
  },




  updateSeller: async (
    sellerId: string,
    sellerData: Partial<Seller>,
  ): Promise<void> => {
    return await handleDatabaseOperation(async () => {
      const key = `seller:${sellerId}`;
      const existingData = await redisClient.get(key);

      if (!existingData) {
        await redisClient.set(key, JSON.stringify(sellerData));
        await redisClient.expire(key, EXPIRATION_TIME); 
        return;
      }


      const updatedData = { ...JSON.parse(existingData), ...sellerData };
      await redisClient.set(key, JSON.stringify(updatedData));
      await redisClient.expire(key, EXPIRATION_TIME); 
    });
  },
};

export default SellerRepositoryRedis;
