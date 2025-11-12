import prisma from "../../database/databaseORM.js";

export const readManager = async (email) => {
    return prisma.manager.findUnique({
        where: {
            email: email,
        },
    });
};