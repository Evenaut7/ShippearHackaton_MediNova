// src/routes/audioRoutes.ts
import { Router } from 'express';
import { AudioController } from '../controllers/AudioController.js';

const router = Router();

router.post('/upload-token', AudioController.uploadToken);
router.post('/generate-report', AudioController.generateReport);

export default router;
