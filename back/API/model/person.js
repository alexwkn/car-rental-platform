import {readClientByEmail} from "./client.js";
import {readManager} from "./manager.js";
import {compare} from "../../utils/hash.js";


export const readPerson = async (email, password) => {
    const client = await readClientByEmail(email);
    const manager = await readManager(email);

    if (client) {
        const isPasswordValid = await compare(password, client.password);

        return isPasswordValid ? { id: client.profile_id, name: client.name, email: client.email, adress: client.adress, status: "client" } : { id: null, status: null };
    } else if (manager) {
        const isPasswordValid = await compare(password, manager.password);

        return isPasswordValid ? { id: manager.id, name: manager.name, email: manager.email, status: "manager" } : { id: null, status: null };
    } else
        return { id: null, status: null };

};
