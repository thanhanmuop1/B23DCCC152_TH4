const VanBang = require('../models/VanBang');

class VanBangController {
    // Lấy tất cả văn bằng
    async getAll(req, res) {
        try {
            const vanBangs = await VanBang.getAll();
            
            res.json({
                success: true,
                data: vanBangs
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách văn bằng',
                error: error.message
            });
        }
    }
    
    // Lấy văn bằng theo ID
    async getById(req, res) {
        try {
            const id = req.params.id;
            const vanBang = await VanBang.getById(id);
            
            if (!vanBang) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy văn bằng'
                });
            }
            
            res.json({
                success: true,
                data: vanBang
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin văn bằng',
                error: error.message
            });
        }
    }
    
    // Tìm kiếm văn bằng
    async search(req, res) {
        try {
            const searchParams = req.body;
            
            // Đếm số tham số tìm kiếm
            const paramCount = Object.values(searchParams).filter(value => value).length;
            if (paramCount < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp ít nhất 2 thông tin để tìm kiếm'
                });
            }
            
            const vanBangs = await VanBang.search(searchParams);
            
            // Nếu tìm thấy văn bằng, ghi nhận lượt tra cứu
            if (vanBangs.length > 0) {
                for (const vanBang of vanBangs) {
                    await VanBang.ghiNhanTraCuu(vanBang.id, vanBang.quyet_dinh_id);
                }
            }
            
            res.json({
                success: true,
                data: vanBangs
            });
        } catch (error) {
            res.status(error.message.includes('ít nhất 2 thông tin') ? 400 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    // Tạo văn bằng mới
    async create(req, res) {
        try {
            const { vanBang, truongDong } = req.body;
            
            // Validate dữ liệu đầu vào
            if (!vanBang || !vanBang.so_hieu_van_bang || !vanBang.ma_sinh_vien || 
                !vanBang.ho_ten || !vanBang.ngay_sinh || !vanBang.quyet_dinh_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp đầy đủ thông tin văn bằng'
                });
            }
            
            // Validate kiểu dữ liệu của các trường động
            if (truongDong) {
                const truongThongTins = await VanBang.getTruongThongTin();
                
                for (const [truongId, giatri] of Object.entries(truongDong)) {
                    const truong = truongThongTins.find(t => t.id == truongId);
                    if (!truong) {
                        return res.status(400).json({
                            success: false,
                            message: `Trường thông tin với ID ${truongId} không tồn tại`
                        });
                    }
                    
                    // Kiểm tra kiểu dữ liệu
                    if (truong.kieu_du_lieu === 'Number' && isNaN(giatri)) {
                        return res.status(400).json({
                            success: false,
                            message: `Giá trị của trường "${truong.ten_truong}" phải là số`
                        });
                    } else if (truong.kieu_du_lieu === 'Date' && isNaN(new Date(giatri).getTime())) {
                        return res.status(400).json({
                            success: false,
                            message: `Giá trị của trường "${truong.ten_truong}" phải là ngày hợp lệ`
                        });
                    }
                }
            }
            
            // Tạo văn bằng mới
            const newVanBang = await VanBang.create(vanBang, truongDong);
            
            res.status(201).json({
                success: true,
                message: 'Tạo văn bằng thành công',
                data: newVanBang
            });
        } catch (error) {
            // Xử lý lỗi duplicate key
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'Số hiệu văn bằng đã tồn tại'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo văn bằng',
                error: error.message
            });
        }
    }
    
    // Cập nhật văn bằng
    async update(req, res) {
        try {
            const id = req.params.id;
            const { vanBang, truongDong } = req.body;
            
            // Validate dữ liệu đầu vào (không cần đầy đủ cho PATCH)
            if (!vanBang || Object.keys(vanBang).length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng cung cấp thông tin cần cập nhật'
                });
            }
            
            // Không cho phép cập nhật số vào sổ
            if (vanBang.so_vao_so) {
                return res.status(400).json({
                    success: false,
                    message: 'Không được phép cập nhật số vào sổ'
                });
            }
            
            // Validate kiểu dữ liệu của các trường động
            if (truongDong) {
                const truongThongTins = await VanBang.getTruongThongTin();
                
                for (const [truongId, giatri] of Object.entries(truongDong)) {
                    const truong = truongThongTins.find(t => t.id == truongId);
                    if (!truong) {
                        return res.status(400).json({
                            success: false,
                            message: `Trường thông tin với ID ${truongId} không tồn tại`
                        });
                    }
                    
                    // Kiểm tra kiểu dữ liệu
                    if (truong.kieu_du_lieu === 'Number' && isNaN(giatri)) {
                        return res.status(400).json({
                            success: false,
                            message: `Giá trị của trường "${truong.ten_truong}" phải là số`
                        });
                    } else if (truong.kieu_du_lieu === 'Date' && isNaN(new Date(giatri).getTime())) {
                        return res.status(400).json({
                            success: false,
                            message: `Giá trị của trường "${truong.ten_truong}" phải là ngày hợp lệ`
                        });
                    }
                }
            }
            
            // Cập nhật văn bằng
            const updatedVanBang = await VanBang.update(id, vanBang, truongDong);
            
            res.json({
                success: true,
                message: 'Cập nhật văn bằng thành công',
                data: updatedVanBang
            });
        } catch (error) {
            // Xử lý lỗi duplicate key
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'Số hiệu văn bằng đã tồn tại'
                });
            }
            
            res.status(error.message.includes('Không tìm thấy') ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    // Xóa văn bằng
    async delete(req, res) {
        try {
            const id = req.params.id;
            const isDeleted = await VanBang.delete(id);
            
            if (!isDeleted) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy văn bằng để xóa'
                });
            }
            
            res.json({
                success: true,
                message: 'Xóa văn bằng thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa văn bằng',
                error: error.message
            });
        }
    }
    
    // Lấy danh sách trường thông tin động
    async getTruongThongTin(req, res) {
        try {
            const truongThongTins = await VanBang.getTruongThongTin();
            
            res.json({
                success: true,
                data: truongThongTins
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách trường thông tin',
                error: error.message
            });
        }
    }
}

module.exports = new VanBangController(); 