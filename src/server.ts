import express from 'express'
import itemRoutes from "./routes/item-routes";
import dotenv from 'dotenv'
import {Server} from "http";
import path from "path";

dotenv.config()

const PORT = 9000
const app = express()
let server: Server

// json serialize
app.use(express.json())

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


// routes
app.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})
app.use('/api/v1/interns', itemRoutes)


server = app.listen(PORT, ()=> {
    console.log(`🚀 Server is running on port ${PORT}`)
})

export {app,server}

