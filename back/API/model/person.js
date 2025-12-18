import {readClientByEmail} from "./client.js";
import {readManager} from "./manager.js";
import {compare} from "../../utils/hash.js";

const safeCompare = async (plainText, hashedOrPlain) => {
    try {
        return await compare(plainText, hashedOrPlain);
    } catch (e) {
        // If the stored password is not an argon2 hash (seed data), fall back to plain comparison
        if (typeof hashedOrPlain === 'string' && !hashedOrPlain.startsWith('$')) {
            return plainText === hashedOrPlain;
        }
        throw e;
    }
};

export const readPerson = async (email, password) => {
    const client = await readClientByEmail(email);
    const manager = await readManager(email);

    if (client) {
            const isPasswordValid = await safeCompare(password, client.password);

        return isPasswordValid ? { id: client.id, status: "client" } : { id: null, status: null };
    } else if (manager) {
        const isPasswordValid = await safeCompare(password, manager.password);

        return isPasswordValid ? { id: manager.id, status: "manager" } : { id: null, status: null };
    } else
        return { id: null, status: null };

};
