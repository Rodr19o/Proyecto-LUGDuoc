import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",

});
export default prisma;
