import express from 'express';
import { trackVisitor, getVisitors } from '../controllers/visitorController.js';

const router = express.Router();

router.post('/track', trackVisitor);   // your website calls this
router.get('/', getVisitors);          // your dashboard calls this

export default router;