import {RepoBase} from "../defenitions/repo-base";
import IIntern from "../defenitions/interfaces/intern";
import mysql, {OkPacket,RowDataPacket} from "mysql2";
import connection from '../db'

class InternRepository extends RepoBase<IIntern>{
    private connection: mysql.Connection | undefined

    constructor() {
        super();
        this.connection = connection
    }

    // save intern
    save(record: IIntern) : Promise<number> {
        return new Promise((resolve, reject)=> {
            try{
                const {First_Name,Last_Name,Address,University} = record
                const query = `INSERT INTO Interns (First_Name, Last_Name, Address, University) VALUES (?, ? , ?, ?)`
                const queryParams = [First_Name, Last_Name, Address, University]

            //     run the query
                this.connection?.query<OkPacket>(query, queryParams, (err, result) => {
                    if(err){
                        console.log('🔴 Error occurred: ', err)
                        reject(err)
                        return
                    }
                    resolve(result.affectedRows)
                })
            }catch(ex){
                reject(ex)
            }
        })
    }
    retrieveAll(searchParams?: { id?: number }): Promise<IIntern[]> {
        return new Promise((resolve, reject) => {
            try {
                if (!this.connection) {
                    console.error('🔴 Database connection is undefined');
                    reject('Database connection is undefined');
                    return;
                }

                let query = 'SELECT * FROM Interns';

                if (searchParams && searchParams.id) {
                    query += ` WHERE InternID = ?`;
                    this.connection.query<RowDataPacket[]>(query, [searchParams.id], (err, results) => {
                        if (err) {
                            console.log('🔴 Error occurred during retrieval: ', err);
                            reject(err);
                            return;
                        }

                        const interns: IIntern[] = results.map((row: RowDataPacket) => ({
                            InternID: row.InternID as number,
                            First_Name: row.First_Name as string,
                            Last_Name: row.Last_Name as string,
                            Address: row.Address as string,
                            University: row.University as string

                        }))as IIntern[];

                        resolve(interns);
                    });
                } else {
                    this.connection.query<RowDataPacket[]>(query, (err, results) => {
                        if (err) {
                            console.log('🔴 Error occurred during retrieval: ', err);
                            reject(err);
                            return;
                        }

                        const interns: IIntern[] = results.map((row: RowDataPacket) => ({
                            InternID: row.InternID as number,
                            First_Name: row.First_Name as string,
                            Last_Name: row.Last_Name as string,
                            Address: row.Address as string,
                            University: row.University as string

                        }))as IIntern[];

                        resolve(interns);
                    });
                }
            } catch (ex) {
                console.log('🔴 Error occurred during retrieval: ', ex);
                reject(ex);
            }
        });
    }
    retrieveById(id: number): Promise<IIntern | undefined> {
        return new Promise((resolve, reject) => {
            try {
                if (!this.connection) {
                    console.error('🔴 Database connection is undefined');
                    reject('Database connection is undefined');
                    return;
                }

                const query = 'SELECT * FROM Interns WHERE InternID = ?';

                this.connection.query<RowDataPacket[]>(query, [id], (err, results) => {
                    if (err) {
                        console.log('🔴 Error occurred during retrieval: ', err);
                        reject(err);
                        return;
                    }

                    if (results.length === 0) {
                        resolve(undefined); // No record found with the given id
                    } else {
                        const row = results[0];
                        const intern: IIntern = {
                            InternID: row.InternID as number,
                            First_Name: row.First_Name as string,
                            Last_Name: row.Last_Name as string,
                            Address: row.Address as string,
                            University: row.University as string
                        } as IIntern;

                        resolve(intern);
                    }
                });
            } catch (ex) {
                console.log('🔴 Error occurred during retrieval: ', ex);
                reject(ex);
            }
        });
    }
    // Update intern by ID
    update(record: IIntern): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                if (!this.connection) {
                    console.error('🔴 Database connection is undefined');
                    reject('Database connection is undefined');
                    return;
                }

                const { InternID, First_Name, Last_Name, Address, University } = record;

                if (!InternID) {
                    reject('InternID is required for update');
                    return;
                }

                const query = `
                    UPDATE Interns
                    SET First_Name = ?, Last_Name = ?, Address = ?, University = ?
                    WHERE InternID = ?
                `;
                const queryParams = [First_Name, Last_Name, Address, University, InternID];

                // Run the query
                this.connection.query<OkPacket>(query, queryParams, (err, result) => {
                    if (err) {
                        console.log('🔴 Error occurred: ', err);
                        reject(err);
                        return;
                    }
                    resolve(result.affectedRows);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }
    delete(id: number): Promise<number> {
        return new Promise((resolve, reject) => {
            try {
                if (!this.connection) {
                    console.error('🔴 Database connection is undefined');
                    reject('Database connection is undefined');
                    return;
                }

                const query = 'DELETE FROM Interns WHERE InternID = ?';

                this.connection.query<OkPacket>(query, [id], (err, result) => {
                    if (err) {
                        console.log('🔴 Error occurred during deletion: ', err);
                        reject(err);
                        return;
                    }

                    resolve(result.affectedRows);
                });
            } catch (ex) {
                console.log('🔴 Error occurred during deletion: ', ex);
                reject(ex);
            }
        });
    }



}

export const internRepository = new InternRepository()