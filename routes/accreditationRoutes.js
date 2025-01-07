import { Router } from "express";
import { addAccreditation, getAccreditation } from "../controller/accreditation.js";
import { upload } from "../controller/multer.js";

const router = Router();

router.post('/accreditation',  upload.fields([{ name: 'constitution', maxCount: 1 },{ name: 'letter', maxCount: 1 },{ name: 'appendices', maxCount: 1 }]), addAccreditation);
router.get('/accreditation', getAccreditation);

export default router;