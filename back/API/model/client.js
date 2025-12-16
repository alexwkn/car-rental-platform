import prisma from "../../database/databaseORM.js";

export const readClientByEmail = async (email) => {
    return prisma.profile.findUnique({
         where: {
            email: email,
        }      
    });
};