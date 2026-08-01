import { Router } from 'express';
import { PatientController } from '../controllers/PatientController.js';
const router = Router();
router.get('/', PatientController.list);
router.get('/:id', PatientController.get);
router.post('/', PatientController.create);
router.put('/:id', PatientController.update);
router.delete('/:id', PatientController.delete);
export default router;
