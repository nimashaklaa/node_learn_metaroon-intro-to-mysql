import express from "express";
import {InternController} from "../controllers/intern-controller";

const router = express.Router()
const internController = new InternController()

router.post('/add', internController.create );
router.get('/', internController.retrieveAll);
router.get('/:id', internController.retrieveById);
router.put('/:id', internController.update);
router.delete('/:id', internController.delete);

export default router