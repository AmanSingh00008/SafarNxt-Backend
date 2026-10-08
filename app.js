import "dotenv/config";
import express from "express";
import connectDB from "./src/db/index.js";
import bookingRouter from "./src/routes/booking.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/bookings", bookingRouter);

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




