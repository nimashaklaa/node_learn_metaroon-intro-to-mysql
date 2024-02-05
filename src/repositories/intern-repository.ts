import {RepoBase} from "../defenitions/repo-base";
import IIntern from "../defenitions/interfaces/intern";
import mysql, {OkPacket} from "mysql2";
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
                const {First_Name,Last_Name,University,Address} = record
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
}

export const internRepository = new InternRepository()