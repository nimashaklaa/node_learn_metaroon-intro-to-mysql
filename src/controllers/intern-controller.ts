import {Request, Response} from "express";
import {internRepository} from "../repositories/intern-repository";
import IIntern from "../defenitions/interfaces/intern";
import {getRepository} from "typeorm";
import {InternEntity} from "../entities/intern-entity";

export class InternController {
    // async create(req: Request, res: Response){
    //     const {First_Name, Last_Name, Address, University} = req.body
    //     if(!First_Name || !Last_Name || !Address || !University){
    //         return res.status(400).json({message: 'Missing Arguments!'})
    //     }
    //
    //     try{
    //         const newIntern: IIntern = req.body
    //         const savedIntern = internRepository.save(newIntern)
    //         res.status(200).json({message: 'Intern saved successfully', affectedRows: savedIntern})
    //     }catch(ex){
    //         res.status(500).json({message: 'Error occurred', stack: ex})
    //     }
    // }


    // Using typeORM
    async create(req: Request, res: Response){
        const {First_Name, Last_Name, Address, University} = req.body
        if(!First_Name || !Last_Name || !Address || !University){
            return res.status(400).json({message: 'Missing Arguments!'})
        }

        try{
            const intern: IIntern = req.body
            const internRepository = getRepository(InternEntity)
            const createdIntern = internRepository.create(intern)
            const savedIntern = await internRepository.save(createdIntern)
            res.status(200).json({message: 'Intern saved successfully'})
        }catch(ex){
            console.log(ex)
            res.status(500).json({message: 'Error occurred', stack: ex})
        }
    }
}