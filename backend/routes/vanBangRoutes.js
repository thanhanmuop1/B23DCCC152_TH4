const express = require('express');
const router = express.Router();
const vanBangController = require('../controllers/vanBangController');

// Routes quản lý văn bằng
router.get('/', vanBangController.getAll);
router.get('/truong-thong-tin', vanBangController.getTruongThongTin);
router.get('/:id', vanBangController.getById);
router.post('/search', vanBangController.search);
router.post('/', vanBangController.create);
router.patch('/:id', vanBangController.update);
router.delete('/:id', vanBangController.delete);

module.exports = router; 