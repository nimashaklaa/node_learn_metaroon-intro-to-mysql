import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class InternEntity{
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