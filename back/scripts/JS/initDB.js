import {readFileSync} from "node:fs";
import {pool} from "../../database/database.js";
import {hash} from "../../utils/hash.js";
import logger from "../../utils/logger.js";

const requests = readFileSync(
    './scripts/SQL/initDB.sql',
    {encoding: "utf-8"}
);

// hashe le mdp pour les users
const hashPasswordsOf = async (table, idColumn) => {
    const { rows } = await pool.query(`SELECT ${idColumn}, password FROM ${table}`);
    for (const row of rows) {
        const hashedPassword = await hash(row.password);
        await pool.query(
            `UPDATE ${table} SET password = $1 WHERE ${idColumn} = $2`,
            [hashedPassword, row[idColumn]]
        );
    }
};

try {

    await pool.query(requests, []);
    await hashPasswordsOf("profile", "profile_id");
    await hashPasswordsOf("manager", "id");

    logger.info("Seed terminé (done)");
} catch (e) {
    logger.error(e.message, { stack: e.stack });
}