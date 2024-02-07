# MYSQL CRUD operations
### Connecting MYSqL with the project
````ts
const DB = new DbUtil({
    HOST: DBConfig.DB_HOST,
    USER: DBConfig.DB_USER,
    PASSWORD: DBConfig.DB_PASSWORD,
    DATABASE: DBConfig.DB_DATABASE
})
````
### Creating a connection 
````ts
createConnection();{
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

````
lets move to the CRUD operations

#### 1.Creating a user

- intern-controller.ts =>
 ````ts
        const newIntern:IIntern = req.body
        const savedIntern = await  internRepository.save(newIntern)
````
- intern-repository.ts =>
````ts
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
````
checked the API in postman=> 
- Address := POST http://localhost:9000/api/v1/interns/add
- Body(JSON) :=
````json
{
  "First_Name":"Amandi",
  "Last_Name":"Nimasha",
  "Address":"Matara",
  "University":"UOM"
}
````
- Response := 
````json
{"message":"Intern saved successfully✅","affectedRows":1}
````

#### 2.Retrieve All Users

- intern-controller.ts =>
 ````ts
const searchParams = req.query;
const interns = await internRepository.retrieveAll(searchParams);
res.status(200).json(interns);
````
- intern-repository.ts =>
````ts
retrieveAll(searchParams?: { id?: number }): Promise<IIntern[]> {
    return new Promise((resolve, reject) => {
        try {
            //...
            let query = 'SELECT * FROM Interns';
            if (searchParams && searchParams.id) {
                query += ` WHERE InternID = ?`;
                this.connection.query<RowDataPacket[]>(query, [searchParams.id], (err, results) => {
                    if (err) {
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
            reject(ex);
        }
    })
}
````
checked the API in postman=>
- Address := GET http://localhost:9000/api/v1/interns/
- Response :=
````json
[
    {
        "InternID": 1,
        "First_Name": "Nilumi",
        "Last_Name": "Sasindi",
        "Address": "Matara",
        "University": "UOM"
    },
    {
        "InternID": 2,
        "First_Name": "Amandi",
        "Last_Name": "Nimasha",
        "Address": "Matara",
        "University": "UOM"
    }
  ]
````
#### 3.Retrieve User By Id

- intern-controller.ts =>
 ````ts
const id = parseInt(req.params.id, 10);
if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
}
const intern = await internRepository.retrieveById(id);
if (!intern) {
    return res.status(404).json({ message: 'Intern not found' });
}
res.status(200).json(intern);
````
- intern-repository.ts =>
````ts
retrieveById(id: number): Promise<IIntern | undefined> {
    return new Promise((resolve, reject) => {
        try {
           //...
            const query = 'SELECT * FROM Interns WHERE InternID = ?';
            this.connection.query<RowDataPacket[]>(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (results.length === 0) {
                    resolve(undefined); 
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
            reject(ex);
        }
    })
}
````
checked the API in postman=>
- Address := GET http://localhost:9000/api/v1/interns/:id=1
- Response := 
````json
{
    "InternID": 1,
    "First_Name": "Nilumi",
    "Last_Name": "Sasindi",
    "Address": "Matara",
    "University": "UOM"
}
````
#### 4.Update a user

- intern-controller.ts =>
 ````ts
async update(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id, 10);
        const { First_Name, Last_Name, Address, University } = req.body;
        const existingIntern = await internRepository.retrieveById(id);
        // Create an updated intern object
        const updatedIntern: IIntern = {
            InternID: id, First_Name, Last_Name, Address, University,
        }as IIntern;
        const affectedRows = await internRepository.update(updatedIntern);
        //...
    } catch (ex) {
        res.status(500).json({ message: 'Error occurred during update', stack: ex });
    }
}
````
- intern-repository.ts =>
````ts
update(record: IIntern): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            //...
            const { InternID, First_Name, Last_Name, Address, University } = record;
            //...
            const query = `
                    UPDATE Interns
                    SET First_Name = ?, Last_Name = ?, Address = ?, University = ?
                    WHERE InternID = ?
                `;
            const queryParams = [First_Name, Last_Name, Address, University, InternID];
            // Run the query
            this.connection.query<OkPacket>(query, queryParams, (err, result) => {
               //...
                resolve(result.affectedRows);
            });
        } catch (ex) {
            reject(ex);
        }
    })
}
````
checked the API in postman=>
- Address := PUT http://localhost:9000/api/v1/interns/:id
- Body(JSON) :=
````json
{   
    "First_Name": "Nilshi",
    "Last_Name": "Rathnayake",
    "Address": "Matara",
    "University": "UP" 
}
````
- Response :=
````json
{
    "message": "Intern updated successfully",
    "affectedRows": 1
}
````
### 5.Delete a user

- intern-controller.ts =>
 ````ts

    const id = parseInt(req.params.id, 10); // Assuming the id is passed as a URL parameter
    //...
    const deletedRows = await internRepository.delete(id);


````
- intern-repository.ts =>
````ts
delete(id: number): Promise<number> {
    return new Promise((resolve, reject) => {
        try {
            const query = 'DELETE FROM Interns WHERE InternID = ?';

            this.connection.query<OkPacket>(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.affectedRows);
            });
        } catch (ex) {
            reject(ex);
        }
    })
}
````
checked the API in postman=>
- Address := DELETE http://localhost:9000/api/v1/interns/:id
- Response :=
````json
{
    "message": "Intern deleted successfully",
    "deletedRows": 1
}
````
### 5.Delete All User

- intern-controller.ts =>
 ````ts
const deletedRows = await internRepository.deleteAll();
res.status(200).json({ message: 'Deleted all interns successfully', deletedRows });
````
- intern-repository.ts =>
````ts
deleteAll(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      //...  
      const query = 'DELETE FROM Interns';
      this.connection.query<OkPacket>(query, (err, result) => {
        //...
        resolve(result.affectedRows);
      });
    } catch (ex) {
      reject(ex);
    }
  })
}
````
checked the API in postman=>
- Address := DELETE http://localhost:9000/api/v1/interns/
- Response :=
````json
{
  "message": "Deleted all interns successfully",
  "deletedRows": 1
}
````
