import express from 'express';
import { getCoaching } from '../controllers/coachingController.js';

const router = express.Router();

router.get('/coaching', getCoaching);

export default router;