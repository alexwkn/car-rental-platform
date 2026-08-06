import logger from "./utils/logger.js";

logger.info("[entrypoint] Lancement de initDB.js");
await import("./scripts/JS/initDB.js");

logger.info("[entrypoint] Le serveur démarre");
await import("./server.js");
