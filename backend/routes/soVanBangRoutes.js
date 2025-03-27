const express = require('express');
const router = express.Router();
const soVanBangController = require('../controllers/soVanBangController');

// Routes cho Sổ văn bằng
router.post('/', soVanBangController.create);
router.get('/', soVanBangController.getAll);
router.get('/current', soVanBangController.getCurrentBook);
router.get('/:id', soVanBangController.getDetail);
router.get('/nam/:nam', soVanBangController.getByYear);
router.put('/:id', soVanBangController.update);
router.delete('/:id', soVanBangController.delete);

module.exports = router; 