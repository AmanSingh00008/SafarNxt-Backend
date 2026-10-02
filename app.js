import "dotenv/config";
import express from "express";
import connectDB from "./src/db/index.js";

const app = express();

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed!", err);
        process.exit(1);
    });

export { app };




