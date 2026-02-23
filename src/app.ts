import express, { Request, Response } from "express";
import authRouter from "./auth/auth.routes";
import globalErrorHandler from "./midlewares/error.midleware";
import cors from "cors";
import { NotFoundError } from "./shared/errors/NotFoundError";
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({origin:"*"}));
app.use("/api/auth", authRouter);
app.get("/api/health", async (req: Request, res: Response) => {
    throw new NotFoundError("This route does not exist");
});
app.use(globalErrorHandler);



export default app;