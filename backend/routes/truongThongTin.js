const express = require('express');
const router = express.Router();
const truongThongTinController = require('../controllers/truongThongTinController');

// Routes cho bảng TruongThongTin
router.get('/', truongThongTinController.getAllTruongThongTin);
router.get('/:id', truongThongTinController.getTruongThongTinById);
router.post('/', truongThongTinController.createTruongThongTin);
router.put('/:id', truongThongTinController.updateTruongThongTin);
router.delete('/:id', truongThongTinController.deleteTruongThongTin);

module.exports = router;
