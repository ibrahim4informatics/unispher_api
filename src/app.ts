import express, { Request, Response } from "express";
import authRouter from "./auth/auth.routes";
import universityRouter from "./university/university.routes";
import globalErrorHandler from "./midlewares/error.midleware";
import cors from "cors";
import { NotFoundError } from "./shared/errors/NotFoundError";
import { express as userAgent } from "express-useragent"
import fieldRouter from "./fields/field.routes";
import departmentsRouter from "./departments/department.routes";
import facultyRouter from "./faculty/faculty.routes";
import levelsRouter from "./levels/levels.routes";
import studentRouter from "./student/student.routes";
import userRouter from "./user/user.routes";
import teacherRouter from "./teacher/teacher.routes";
import postsRouter from "./posts/posts.routes";
import likesRouter from "./likes/likes.routes"
import commentsRouter from "./comments/comment.routes";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use(userAgent())


app.use("/api/auth", authRouter);
app.use("/api/university", universityRouter);
app.use("/api/fields", fieldRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api/levels", levelsRouter);
app.use("/api/user", userRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter)
app.use("/api/comments", commentsRouter)

app.get("/api/health", async (req: Request, res: Response) => {
    throw new NotFoundError("This route does not exist");
});
app.use(globalErrorHandler);



export default app;