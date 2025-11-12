import {readClientByEmail} from "./client.js";
import {readManager} from "./manager.js";
import {compare} from "../../utils/hash.js";

export const readPerson = async (email, password) => {
    const client = await readClientByEmail(email);
    const manager = await readManager(email);

    if (client) {
        const isPasswordValid = await compare(password, client.password);

        return isPasswordValid ? { id: client.id, status: "client" } : { id: null, status: null };
    } else if (manager) {
        const isPasswordValid = password === manager.password;

        return isPasswordValid ? { id: manager.id, status: "manager" } : { id: null, status: null };
    } else
        return { id: null, status: null };

};
