import prisma from "@/db/connectDb.js";
import { handleDatabaseOperation } from "../_utils/handelDatabaseOperation.js";
import { User } from "@prisma/client"


export const userRepository = {

    createUser: ( userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User> =>
        handleDatabaseOperation(() =>
            prisma.user.create({ data: userData as User })
        ),

    getUserByEmail: async (email: string): Promise<User | null> => {
        return await handleDatabaseOperation(async () => {
            return await prisma.user.findUnique({ where: { email } });
        });
    },

    getUserById: async (id: string): Promise<User | null> => {
        return await handleDatabaseOperation(async () => {
            return await prisma.user.findUnique({ where: { id } });
        });
    },

    updateUser: async (id: string, userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User> => {
        return await handleDatabaseOperation(async () => {
            return await prisma.user.update({ where: { id }, data: userData });
        });
    },

  
    saveUser: async (user: User & Partial<Omit<User, "id" | "createdAt" | "updatedAt" | "email">>): Promise<User> => {
        return await handleDatabaseOperation(async () => {
            return await prisma.user.update({ where: { id: user.id }, data: user });
        });
    }
};