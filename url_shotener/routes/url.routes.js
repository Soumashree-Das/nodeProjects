import express from 'express';
// const { handleGenerateNewShortUrl } = require('../controller/url.controller.js'); // Ensure correct import
import  { handleAnalytics, handleGenerateNewShortUrl,urlRedirection,deleteUrlByShortId } from '../controller/url.controller.js'
// import shortid from 'shortid';
const router = express.Router();

router.post('/', handleGenerateNewShortUrl); // ✅ Fixed function call
router.get('/:shortID', urlRedirection); // ✅ Fixed function call
router.get('/analytics/:shortID', handleAnalytics); // ✅ Fixed function call
router.delete('/:shortID', deleteUrlByShortId);

export default router;// ✅ Correct export
