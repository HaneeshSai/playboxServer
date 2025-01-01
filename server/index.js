import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import boxRoutes from "./src/routes/boxRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import ownerRoutes from "./src/routes/ownerRoutes.js";
import eventsRoutes from "./src/routes/eventsRoutes.js"; // Import events routes
import coachingRoutes from "./src/routes/coachingRoutes.js"; // Import coaching routes
import { checkPaymentStatusAndCancelBookings } from "./utils/cancelBooking.js";
import { checkIfConfirmedAndStartSession } from "./utils/startSessions.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("heyyy");
});

app.use("/box", boxRoutes);
app.use("/user", userRoutes);
app.use("/owner", ownerRoutes);
app.use("", eventsRoutes); // Use events routes
app.use("", coachingRoutes); // Use coaching routes

checkPaymentStatusAndCancelBookings();
checkIfConfirmedAndStartSession();

app.listen(port, () => {
  console.log("server running now");
});