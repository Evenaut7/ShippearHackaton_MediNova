// src/routes/audioRoutes.ts
import { Router } from 'express';
import { upload } from '../config/multer.js';
import { AudioController } from '../controllers/AudioController.js';

const router = Router();

// El campo en el form-data debe llamarse 'audio'
router.post('/generate-report', upload.single('audio'), AudioController.generateReport);

export default router;