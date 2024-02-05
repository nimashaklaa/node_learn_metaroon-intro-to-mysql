import mysql from "mysql2";
import {DBConfig} from "../configs/db-config";
export default mysql.createConnection({
    host: DBConfig.DB_HOST,
    user: DBConfig.DB_USER,
    password: DBConfig.DB_PASSWORD,
    database: DBConfig.DB_DATABASE,
})