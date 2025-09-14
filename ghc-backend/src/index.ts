import express from "express";

import authRouter from "./routes/auth"
import certifierRoute from "./routes/certifier";
import producerRouter from "./routes/producer";
const app = express();


app.use(express.json())
const PORT = process.env.PORT || 3000;
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/producer",producerRouter)
app.use("/api/v1/certifier",certifierRoute)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});