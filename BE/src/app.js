import "dotenv/config";
import cors from "cors";
import express from "express";
import router from "./routes/root.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import vitriRouter from "./routes/vitri.routes.js";
import commentRouter from "./routes/comment.routes.js";
import phongRouter from "./routes/phong.routes.js";
import datPhongRouter from "./routes/datPhong.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"))

app.use(router);
app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/vi-tri", vitriRouter);
app.use("/api/binh-luan", commentRouter);
app.use("/api/phong-thue", phongRouter);
app.use("/api/dat-phong", datPhongRouter);

app.use(errorHandler);



export default app;
