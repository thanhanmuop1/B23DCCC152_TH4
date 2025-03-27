const express = require('express');
const router = express.Router();
const quyetDinhController = require('../controllers/quyetDinhController');

// Routes cho Quyết định tốt nghiệp
router.post('/', quyetDinhController.create);
router.get('/', quyetDinhController.getAll);
router.get('/:id', quyetDinhController.getById);
router.put('/:id', quyetDinhController.update);
router.delete('/:id', quyetDinhController.delete);

module.exports = router; 