import { Router } from 'express';
import { ProfessionalController } from '../controllers/ProfessionalController.js';

const router = Router();

router.get('/', ProfessionalController.list);
router.get('/:id', ProfessionalController.get);
router.post('/', ProfessionalController.create);
router.put('/:id', ProfessionalController.update);
router.delete('/:id', ProfessionalController.delete);

export default router;
