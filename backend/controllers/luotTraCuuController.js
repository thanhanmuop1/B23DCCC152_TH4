const LuotTraCuu = require('../models/LuotTraCuu');

class LuotTraCuuController {
  // Thêm lượt tra cứu mới
  async create(req, res) {
    try {
      const { van_bang_id, quyet_dinh_id } = req.body;
      
      if (!van_bang_id || !quyet_dinh_id) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin văn bằng hoặc quyết định'
        });
      }
      
      await LuotTraCuu.create({
        van_bang_id,
        quyet_dinh_id
      });
      
      res.status(201).json({
        success: true,
        message: 'Đã ghi nhận lượt tra cứu'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi ghi nhận lượt tra cứu',
        error: error.message
      });
    }
  }

  // Lấy thống kê theo quyết định
  async getThongKeTheoQuyetDinh(req, res) {
    try {
      const thongKe = await LuotTraCuu.getThongKeTheoQuyetDinh();
      
      res.json({
        success: true,
        data: thongKe
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê lượt tra cứu theo quyết định',
        error: error.message
      });
    }
  }

  // Lấy thống kê theo thời gian
  async getThongKeTheoThoiGian(req, res) {
    try {
      const { tu_ngay, den_ngay } = req.query;
      
      const thongKe = await LuotTraCuu.getThongKeTheoThoiGian(tu_ngay, den_ngay);
      
      res.json({
        success: true,
        data: thongKe
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thống kê lượt tra cứu theo thời gian',
        error: error.message
      });
    }
  }

  // Lấy chi tiết các lượt tra cứu gần đây
  async getLuotTraCuuGanDay(req, res) {
    try {
      const limit = req.query.limit || 10;
      
      const luotTraCuu = await LuotTraCuu.getLuotTraCuuGanDay(parseInt(limit));
      
      res.json({
        success: true,
        data: luotTraCuu
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách lượt tra cứu gần đây',
        error: error.message
      });
    }
  }

  // Lấy tổng quan thống kê
  async getTongQuanThongKe(req, res) {
    try {
      const tongLuotTraCuu = await LuotTraCuu.getTongLuotTraCuu();
      const thongKeQuyetDinh = await LuotTraCuu.getThongKeTheoQuyetDinh();
      const thongKeGanDay = await LuotTraCuu.getThongKeTheoThoiGian(
        // 7 ngày gần đây
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      );
      
      const quyetDinhNhieuLuotNhat = thongKeQuyetDinh.length > 0 ? thongKeQuyetDinh[0] : null;
      
      res.json({
        success: true,
        data: {
          tong_luot_tra_cuu: tongLuotTraCuu,
          quyet_dinh_nhieu_nhat: quyetDinhNhieuLuotNhat,
          thong_ke_7_ngay: thongKeGanDay
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy tổng quan thống kê',
        error: error.message
      });
    }
  }
}

module.exports = new LuotTraCuuController(); 