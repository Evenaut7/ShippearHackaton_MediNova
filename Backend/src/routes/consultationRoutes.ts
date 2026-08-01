import { Router } from 'express';
import { ConsultationController } from '../controllers/ConsultationController.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/', ConsultationController.list);
router.get('/:id', ConsultationController.get);
router.post('/', ConsultationController.create);
router.put('/:id', ConsultationController.update);
router.delete('/:id', ConsultationController.delete);

export default router;
