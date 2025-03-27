const SoVanBang = require('../models/SoVanBang');

class SoVanBangController {
    // Tạo sổ văn bằng mới
    async create(req, res) {
        try {
            const { nam } = req.body;

            // Validate năm
            if (!nam || isNaN(nam) || nam < 1900 || nam > 2100) {
                return res.status(400).json({
                    success: false,
                    message: 'Năm không hợp lệ'
                });
            }

            const newBook = await SoVanBang.createNewBook(nam);

            res.status(201).json({
                success: true,
                message: 'Tạo sổ văn bằng mới thành công',
                data: newBook
            });
        } catch (error) {
            res.status(error.message.includes('đã tồn tại') ? 400 : 500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Lấy danh sách tất cả sổ văn bằng
    async getAll(req, res) {
        try {
            const books = await SoVanBang.getAll();
            res.json({
                success: true,
                data: books
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách sổ văn bằng'
            });
        }
    }

    // Lấy chi tiết sổ văn bằng
    async getDetail(req, res) {
        try {
            const book = await SoVanBang.getDetailById(req.params.id);
            
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sổ văn bằng'
                });
            }

            res.json({
                success: true,
                data: book
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy chi tiết sổ văn bằng'
            });
        }
    }

    // Lấy sổ văn bằng theo năm
    async getByYear(req, res) {
        try {
            const { nam } = req.params;
            const book = await SoVanBang.getByYear(nam);
            
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy sổ văn bằng năm ${nam}`
                });
            }

            res.json({
                success: true,
                data: book
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy sổ văn bằng theo năm'
            });
        }
    }

    // Lấy hoặc tạo sổ văn bằng năm hiện tại
    async getCurrentBook(req, res) {
        try {
            const currentBook = await SoVanBang.getOrCreateCurrentBook();
            res.json({
                success: true,
                data: currentBook
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy sổ văn bằng năm hiện tại'
            });
        }
    }
}

module.exports = new SoVanBangController(); 