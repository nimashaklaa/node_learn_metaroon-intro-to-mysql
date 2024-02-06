import {RowDataPacket} from "mysql2";

export default interface IIntern extends RowDataPacket {
    InternID?: number,
    First_Name?: string,
    Last_Name?: string,
    Address?: string,
    University?: string
}