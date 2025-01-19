import { Router } from "express";
import { addReAccreditation, getReAccreditation } from "../controller/reAccreditation.js";
import { upload } from "../controller/multer.js";

const router = Router();

router.post('/reAccreditation', addReAccreditation);
router.get('/reAccreditation', getReAccreditation);

export default router;