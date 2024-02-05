import mysql from 'mysql2';
import dotenv from 'dotenv'
import {IMysqlConfig} from "../defenitions/interfaces/mysql-config";
dotenv.config()

export default class DbUtil {
    private static instance: DbUtil;
    private HOST: string | undefined;
    private USER: string | undefined;
    private PASSWORD: string | undefined;
    private DATABASE: string | undefined;
    private connection: mysql.Connection | undefined;

    constructor(private connectionConfig: IMysqlConfig) {
        this.HOST = connectionConfig.HOST;
        this.USER = connectionConfig.USER;
        this.PASSWORD = connectionConfig.PASSWORD;
        this.DATABASE = connectionConfig.DATABASE;
    }

    public static async getInstance(): Promise<DbUtil> {
        if (!DbUtil.instance) {
            DbUtil.instance = new DbUtil({
                HOST: process.env.DB_HOST,
                USER: process.env.DB_USER,
                PASSWORD: process.env.DB_PASSWORD,
                DATABASE: process.env.DB_DATABASE
            });
            await DbUtil.instance.createConnection();
            return DbUtil.instance;
        }
        return DbUtil.instance;
    }

    // Create a connection to the database
    public createConnection() {
        return new Promise((resolve, reject) => {
            try {
                this.connection = mysql.createConnection({
                    host: this.HOST,
                    user: this.USER,
                    password: this.PASSWORD,
                    database: this.DATABASE
                });

                // Test the connection
                this.connection.connect((err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(this.connection);
                });
            } catch (ex) {
                console.log('🔴 Connection failed with the database', ex);
                reject(ex);
            }
        });
    }

    // close connection
    public closeConnection(connection: mysql.Connection) {
        connection.end();
    }
}
