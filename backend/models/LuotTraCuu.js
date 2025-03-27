const db = require('../configs/database');

class LuotTraCuu {
  // Thêm lượt tra cứu mới
  static async create(data) {
    const query = `
      INSERT INTO LuotTraCuu (van_bang_id, quyet_dinh_id)
      VALUES (?, ?)
    `;
    
    const [result] = await db.execute(query, [
      data.van_bang_id,
      data.quyet_dinh_id
    ]);
    
    return result;
  }

  // Lấy thống kê theo quyết định
  static async getThongKeTheoQuyetDinh() {
    const query = `
      SELECT 
        qd.id,
        qd.so_quyet_dinh,
        qd.ngay_ban_hanh,
        qd.trich_yeu,
        COUNT(ltc.id) as so_luot_tra_cuu
      FROM QuyetDinhTotNghiep qd
      LEFT JOIN LuotTraCuu ltc ON qd.id = ltc.quyet_dinh_id
      GROUP BY qd.id
      ORDER BY so_luot_tra_cuu DESC
    `;
    
    const [rows] = await db.execute(query);
    return rows;
  }

  // Lấy thống kê theo khoảng thời gian
  static async getThongKeTheoThoiGian(tuNgay, denNgay) {
    let query = `
      SELECT 
        DATE(ltc.thoi_gian) as ngay,
        COUNT(ltc.id) as so_luot_tra_cuu
      FROM LuotTraCuu ltc
    `;
    
    const params = [];
    
    if (tuNgay || denNgay) {
      query += ' WHERE 1=1 ';
      
      if (tuNgay) {
        query += ' AND DATE(ltc.thoi_gian) >= ? ';
        params.push(tuNgay);
      }
      
      if (denNgay) {
        query += ' AND DATE(ltc.thoi_gian) <= ? ';
        params.push(denNgay);
      }
    }
    
    query += `
      GROUP BY DATE(ltc.thoi_gian)
      ORDER BY ngay
    `;
    
    const [rows] = await db.execute(query, params);
    return rows;
  }

  // Lấy chi tiết các lượt tra cứu gần đây
  static async getLuotTraCuuGanDay(limit = 10) {
    const query = `
      SELECT 
        ltc.id,
        ltc.thoi_gian,
        vb.so_hieu_van_bang,
        vb.ho_ten,
        qd.so_quyet_dinh
      FROM LuotTraCuu ltc
      JOIN VanBang vb ON ltc.van_bang_id = vb.id
      JOIN QuyetDinhTotNghiep qd ON ltc.quyet_dinh_id = qd.id
      ORDER BY ltc.thoi_gian DESC
      LIMIT ?
    `;
    
    const [rows] = await db.execute(query, [limit]);
    return rows;
  }

  // Lấy tổng số lượt tra cứu
  static async getTongLuotTraCuu() {
    const query = `SELECT COUNT(*) as tong_luot FROM LuotTraCuu`;
    const [rows] = await db.execute(query);
    return rows[0].tong_luot;
  }
}

module.exports = LuotTraCuu; 