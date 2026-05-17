import express from 'express';
import { trackVisitor, getVisitors } from '../controllers/visitorController.js';
import auth from '../middlewheres/auth.js';

const router = express.Router();

router.post('/track', trackVisitor);   // your website calls this
router.get('/', auth ,getVisitors);          // your dashboard calls this

export default router;