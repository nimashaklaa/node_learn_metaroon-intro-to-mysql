import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { RowDataPacket } from "mysql2";
import IIntern from "../defenitions/interfaces/intern";

@Entity()
export class InternEntity {
    @PrimaryGeneratedColumn()
    Intern_ID: number | undefined;

    @Column({ type: "varchar", length: 255 })
    First_Name: string | undefined;

    @Column({ type: "varchar", length: 255 })
    Last_Name: string | undefined;

    @Column({ type: "varchar", length: 255 })
    Address: string | undefined;

    @Column({ type: "varchar", length: 255 })
    University: string | undefined;
}