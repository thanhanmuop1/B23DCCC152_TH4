const express = require('express');
const router = express.Router();
const luotTraCuuController = require('../controllers/luotTraCuuController');

// Route ghi nhận lượt tra cứu mới
router.post('/', luotTraCuuController.create);

// Route lấy thống kê theo quyết định
router.get('/thong-ke/quyet-dinh', luotTraCuuController.getThongKeTheoQuyetDinh);

// Route lấy thống kê theo thời gian
router.get('/thong-ke/thoi-gian', luotTraCuuController.getThongKeTheoThoiGian);

// Route lấy danh sách lượt tra cứu gần đây
router.get('/gan-day', luotTraCuuController.getLuotTraCuuGanDay);

// Route lấy tổng quan thống kê
router.get('/tong-quan', luotTraCuuController.getTongQuanThongKe);

module.exports = router; 