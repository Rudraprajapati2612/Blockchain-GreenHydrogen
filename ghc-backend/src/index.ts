import express from "express";

import authRouter from "./routes/auth"
const app = express();


app.use(express.json())
const PORT = process.env.PORT || 3000;
app.use("/api/v1/auth",authRouter)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});