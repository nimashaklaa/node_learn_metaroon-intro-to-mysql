import express from "express";
import {InternController} from "../controllers/intern-controller";

const router = express.Router()
const internController = new InternController()

router.post('/add', internController.create );
router.get('/', ()=> {});

export default router