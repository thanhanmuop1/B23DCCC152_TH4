const QuyetDinhTotNghiep = require('../models/QuyetDinhTotNghiep');

class QuyetDinhController {
    // Tạo quyết định mới
    async create(req, res) {
        try {
            const quyetDinh = await QuyetDinhTotNghiep.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Tạo quyết định thành công',
                data: quyetDinh
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo quyết định',
                error: error.message
            });
        }
    }

    // Lấy danh sách quyết định
    async getAll(req, res) {
        try {
            const quyetDinhs = await QuyetDinhTotNghiep.getAll();
            res.json({
                success: true,
                data: quyetDinhs
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách quyết định',
                error: error.message
            });
        }
    }

    // Lấy chi tiết một quyết định
    async getById(req, res) {
        try {
            const quyetDinh = await QuyetDinhTotNghiep.getById(req.params.id);
            if (!quyetDinh) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy quyết định'
                });
            }
            res.json({
                success: true,
                data: quyetDinh
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy chi tiết quyết định',
                error: error.message
            });
        }
    }

    // Cập nhật quyết định
    async update(req, res) {
        try {
            const result = await QuyetDinhTotNghiep.update(req.params.id, req.body);
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy quyết định để cập nhật'
                });
            }
            res.json({
                success: true,
                message: 'Cập nhật quyết định thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật quyết định',
                error: error.message
            });
        }
    }

    // Xóa quyết định
    async delete(req, res) {
        try {
            const result = await QuyetDinhTotNghiep.delete(req.params.id);
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy quyết định để xóa'
                });
            }
            res.json({
                success: true,
                message: 'Xóa quyết định thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa quyết định',
                error: error.message
            });
        }
    }
}

module.exports = new QuyetDinhController(); 