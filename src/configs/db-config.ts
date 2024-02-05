import dotenv from "dotenv";
dotenv.config();

export abstract class DBConfig {
    public static DB_HOST: string = process.env.DB_HOST || 'localhost';
    public static DB_USER: string = process.env.DB_USER as string;
    public static DB_PASSWORD: string = process.env.DB_PASSWORD as string;
    public static DB_DATABASE: string = process.env.DB_DATABASE as string;
}