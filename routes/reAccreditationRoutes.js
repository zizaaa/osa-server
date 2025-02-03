import { Router } from "express";
import { addReAccreditation, getReAccreditation } from "../controller/reAccreditation.js";
import { upload } from "../controller/multer.js";

const router = Router();

router.post('/reAccreditation', upload.fields([{ name: 'letter', maxCount: 1 },{ name: 'appendices', maxCount: 1 }]), addReAccreditation);
router.get('/reAccreditation', getReAccreditation);

export default router;