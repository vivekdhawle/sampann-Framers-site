import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors" 
const app=express()
app.use(express.json({
    limit:"16kb"
}))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(cookieParser())





import userRouter from "./routers/user.routes.js"
import vendorRouter from "./routers/vendors.routes.js"
import postRouter from "./routers/post.routes.js"
import plantsRouter from "./routers/plants.routes.js"
app.use("/api/v1/users",userRouter)
app.use("/api/v1/vendors",vendorRouter)
app.use("/api/v1/posts",postRouter)
app.use("/api/v1/plants",plantsRouter)
export default app