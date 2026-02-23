import express, { Request, Response } from "express";
import authRouter from "./auth/auth.routes";
const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);



export default app;