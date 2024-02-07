import {Request, Response} from "express";
import {internRepository} from "../repositories/intern-repository";
import IIntern from "../defenitions/interfaces/intern";


export class InternController {
    // Using typeORM
    async create(req: Request, res: Response){
        const {First_Name, Last_Name, Address, University} = req.body
        if(!First_Name || !Last_Name || !Address || !University){
            return res.status(400).json({message: 'Missing Arguments!'})
        }

        try{
            // const intern: IIntern = req.body
            // const internRepository = getRepository(InternEntity)
            // const createdIntern = internRepository.create(intern)
            // const savedIntern = await internRepository.save(createdIntern)
            const newIntern:IIntern = req.body
            const savedIntern = await  internRepository.save(newIntern)
            res.status(200).json({message: 'Intern saved successfully✅',affectedRows:savedIntern})
        }catch(ex){
            console.log(ex)
            res.status(500).json({message: '🛑Error occurred', stack: ex})
        }
    }
    //Retrieve All
    async retrieveAll(req: Request, res: Response) {
        try {
            const searchParams = req.query;

            const interns = await internRepository.retrieveAll(searchParams);
            console.log('Retrieval succeed!');
            res.status(200).json(interns);
        } catch (ex) {
            console.log('🔴 Error occurred during retrieval: ', ex);
            res.status(500).json({ message: 'Error occurred during retrieval', stack: ex });
        }
    }
    async retrieveById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            const intern = await internRepository.retrieveById(id);

            if (!intern) {
                return res.status(404).json({ message: 'Intern not found' });
            }

            res.status(200).json(intern);
        } catch (ex) {
            console.log('🔴 Error occurred during retrieval: ', ex);
            res.status(500).json({ message: 'Error occurred during retrieval', stack: ex });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10);
            const { First_Name, Last_Name, Address, University } = req.body;

            if (isNaN(id) || !First_Name || !Last_Name || !Address || !University) {
                return res.status(400).json({ message: 'Invalid ID or Missing Arguments' });
            }
            // Check if the intern with the given id exists
            const existingIntern = await internRepository.retrieveById(id);

            if (!existingIntern) {
                return res.status(404).json({ message: 'Intern not found' });
            }
            // Create an updated intern object
            const updatedIntern: IIntern = {
                InternID: id,
                First_Name,
                Last_Name,
                Address,
                University,
            }as IIntern;

            const affectedRows = await internRepository.update(updatedIntern);

            if (affectedRows > 0) {
                return res.status(200).json({ message: 'Intern updated successfully', affectedRows });
            } else {
                return res.status(500).json({ message: 'Failed to update intern' });
            }
        } catch (ex) {
            console.log('🔴 Error occurred during update: ', ex);
            res.status(500).json({ message: 'Error occurred during update', stack: ex });
        }
    }
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id, 10); // Assuming the id is passed as a URL parameter

            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid ID format' });
            }

            const deletedRows = await internRepository.delete(id);

            if (deletedRows === 0) {
                return res.status(404).json({ message: 'Intern not found' });
            }

            res.status(200).json({ message: 'Intern deleted successfully', deletedRows });
        } catch (ex) {
            console.log('🔴 Error occurred during deletion: ', ex);
            res.status(500).json({ message: 'Error occurred during deletion', stack: ex });
        }
    }
    async deleteAll(req: Request, res: Response) {
        try {
            const deletedRows = await internRepository.deleteAll();
            res.status(200).json({ message: 'Deleted all interns successfully', deletedRows });
        } catch (ex) {
            console.log('🔴 Error occurred during deletion: ', ex);
            res.status(500).json({ message: 'Error occurred during deletion', stack: ex });
        }
    }


}