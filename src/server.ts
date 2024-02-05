import express from 'express'
import itemRoutes from "./routes/item-routes";
import dotenv from 'dotenv'
import {Server} from "http";
import path from "path";
import DbUtil from "./utils/db-util";
import {DBConfig} from "./configs/db-config";
import {createConnection} from "typeorm";

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


// Init DB
// const DB = new DbUtil({
//     HOST: DBConfig.DB_HOST,
//     USER: DBConfig.DB_USER,
//     PASSWORD: DBConfig.DB_PASSWORD,
//     DATABASE: DBConfig.DB_DATABASE
// })
//
// DB.createConnection().then((connection)=> {
//     console.log('🟢 Connected successfully to the database');
//     server = app.listen(PORT, ()=> {
//         console.log(`🚀 Server is running on port ${PORT}`)
//     })
// }).catch((ex)=> {
//     console.error('🔴 Database connection unsuccessful!', ex)
// })

// Using TypeORM
createConnection().then(()=> {
    console.log('🟢 Connected successfully to the database');
        server = app.listen(PORT, ()=> {
        console.log(`🚀 Server is running on port ${PORT}`)
    })
}).catch((ex)=> {
    console.log('🔴 Server connection error', ex)
})


export {app,server}

