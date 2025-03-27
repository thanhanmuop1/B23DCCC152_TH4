const db = require('../configs/database');

class VanBang {
    // Lấy tất cả văn bằng
    static async getAll() {
        try {
            const query = `
                SELECT vb.*, qd.so_quyet_dinh, svb.nam as nam_so 
                FROM VanBang vb
                JOIN QuyetDinhTotNghiep qd ON vb.quyet_dinh_id = qd.id
                JOIN SoVanBang svb ON vb.so_van_bang_id = svb.id
                ORDER BY vb.id DESC
            `;
            const [vanBangs] = await db.execute(query);
            
            // Lấy giá trị các trường động cho mỗi văn bằng
            for (let vanBang of vanBangs) {
                vanBang.truong_dong = await this.getTruongDongValues(vanBang.id);
            }
            
            return vanBangs;
        } catch (err) {
            console.error(err);
            throw new Error('Lỗi khi lấy danh sách văn bằng');
        }
    }

    // Lấy văn bằng theo ID
    static async getById(id) {
        try {
            const query = `
                SELECT vb.*, qd.so_quyet_dinh, svb.nam as nam_so 
                FROM VanBang vb
                JOIN QuyetDinhTotNghiep qd ON vb.quyet_dinh_id = qd.id
                JOIN SoVanBang svb ON vb.so_van_bang_id = svb.id
                WHERE vb.id = ?
            `;
            const [vanBangs] = await db.execute(query, [id]);
            
            if (vanBangs.length === 0) {
                return null;
            }
            
            const vanBang = vanBangs[0];
            
            // Lấy giá trị các trường động
            vanBang.truong_dong = await this.getTruongDongValues(id);
            
            return vanBang;
        } catch (err) {
            console.error(err);
            throw new Error('Lỗi khi lấy thông tin văn bằng');
        }
    }
    
    // Lấy giá trị các trường động của văn bằng
    static async getTruongDongValues(vanBangId) {
        try {
            const query = `
                SELECT gt.*, tt.ten_truong, tt.kieu_du_lieu
                FROM GiaTriTruongThongTin gt
                JOIN TruongThongTin tt ON gt.truong_thong_tin_id = tt.id
                WHERE gt.van_bang_id = ?
            `;
            const [values] = await db.execute(query, [vanBangId]);
            
            // Chuyển đổi sang object để dễ sử dụng
            const result = {};
            for (let value of values) {
                let parsedValue = value.gia_tri;
                // Chuyển đổi kiểu dữ liệu phù hợp
                if (value.kieu_du_lieu === 'Number') {
                    parsedValue = parseFloat(value.gia_tri);
                } else if (value.kieu_du_lieu === 'Date') {
                    parsedValue = new Date(value.gia_tri);
                }
                
                result[value.ten_truong] = {
                    id: value.id,
                    truong_id: value.truong_thong_tin_id,
                    gia_tri: parsedValue,
                    kieu_du_lieu: value.kieu_du_lieu
                };
            }
            console.log(result);
            return result;
        } catch (err) {
            console.error(err);
            throw new Error('Lỗi khi lấy thông tin trường động');
        }
    }

    // Tìm kiếm văn bằng
    static async search(params) {
        try {
            let query = `
                SELECT vb.*, qd.so_quyet_dinh, svb.nam as nam_so 
                FROM VanBang vb
                JOIN QuyetDinhTotNghiep qd ON vb.quyet_dinh_id = qd.id
                JOIN SoVanBang svb ON vb.so_van_bang_id = svb.id
                WHERE 1=1
            `;
            
            const values = [];
            
            // Thêm điều kiện tìm kiếm nếu có
            if (params.so_hieu_van_bang) {
                query += ' AND vb.so_hieu_van_bang = ?';
                values.push(params.so_hieu_van_bang);
            }
            
            if (params.so_vao_so) {
                query += ' AND vb.so_vao_so = ?';
                values.push(params.so_vao_so);
            }
            
            if (params.ma_sinh_vien) {
                query += ' AND vb.ma_sinh_vien = ?';
                values.push(params.ma_sinh_vien);
            }
            
            if (params.ho_ten) {
                query += ' AND vb.ho_ten LIKE ?';
                values.push(`%${params.ho_ten}%`);
            }
            
            if (params.ngay_sinh) {
                query += ' AND vb.ngay_sinh = ?';
                values.push(params.ngay_sinh);
            }
            
            // Đảm bảo có ít nhất 2 tham số tìm kiếm
            if (values.length < 2) {
                throw new Error('Vui lòng cung cấp ít nhất 2 thông tin để tìm kiếm');
            }
            
            query += ' ORDER BY vb.id DESC';
            
            const [vanBangs] = await db.execute(query, values);
            
            // Lấy giá trị các trường động cho mỗi văn bằng
            for (let vanBang of vanBangs) {
                vanBang.truong_dong = await this.getTruongDongValues(vanBang.id);
            }
            
            return vanBangs;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    // Tạo văn bằng mới và lưu các giá trị trường động
    static async create(vanBangData, truongDongValues) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Số vào sổ sẽ tự động tăng qua trigger trong database
            // Chúng ta chỉ cần cung cấp quyet_dinh_id và so_van_bang_id
            const queryVanBang = `
                INSERT INTO VanBang (
                    so_hieu_van_bang, 
                    ma_sinh_vien, 
                    ho_ten, 
                    ngay_sinh, 
                    quyet_dinh_id, 
                    so_van_bang_id
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const [resultVanBang] = await connection.execute(queryVanBang, [
                vanBangData.so_hieu_van_bang,
                vanBangData.ma_sinh_vien,
                vanBangData.ho_ten,
                vanBangData.ngay_sinh,
                vanBangData.quyet_dinh_id,
                vanBangData.so_van_bang_id
            ]);
            
            const vanBangId = resultVanBang.insertId;
            
            // Lưu các giá trị trường động
            if (truongDongValues && Object.keys(truongDongValues).length > 0) {
                for (const [truongThongTinId, giatri] of Object.entries(truongDongValues)) {
                    const queryGiaTri = `
                        INSERT INTO GiaTriTruongThongTin (
                            van_bang_id, 
                            truong_thong_tin_id, 
                            gia_tri
                        ) VALUES (?, ?, ?)
                    `;
                    
                    await connection.execute(queryGiaTri, [
                        vanBangId,
                        truongThongTinId,
                        giatri
                    ]);
                }
            }
            
            await connection.commit();
            
            // Lấy văn bằng vừa tạo kèm theo giá trị trường động
            return await this.getById(vanBangId);
        } catch (err) {
            await connection.rollback();
            console.error(err);
            throw err;
        } finally {
            connection.release();
        }
    }

    // Cập nhật văn bằng (không cho phép cập nhật số vào sổ)
    static async update(id, vanBangData, truongDongValues) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Kiểm tra văn bằng có tồn tại không
            const vanBangHienTai = await this.getById(id);
            if (!vanBangHienTai) {
                throw new Error('Không tìm thấy văn bằng');
            }
            
            // Không cho phép cập nhật số vào sổ
            if (vanBangData.so_vao_so && vanBangData.so_vao_so !== vanBangHienTai.so_vao_so) {
                throw new Error('Không được phép cập nhật số vào sổ');
            }
            
            // Cập nhật thông tin cơ bản của văn bằng
            const queryVanBang = `
                UPDATE VanBang SET
                    so_hieu_van_bang = ?,
                    ma_sinh_vien = ?,
                    ho_ten = ?,
                    ngay_sinh = ?,
                    quyet_dinh_id = ?
                WHERE id = ?
            `;
            
            await connection.execute(queryVanBang, [
                vanBangData.so_hieu_van_bang || vanBangHienTai.so_hieu_van_bang,
                vanBangData.ma_sinh_vien || vanBangHienTai.ma_sinh_vien,
                vanBangData.ho_ten || vanBangHienTai.ho_ten,
                vanBangData.ngay_sinh || vanBangHienTai.ngay_sinh,
                vanBangData.quyet_dinh_id || vanBangHienTai.quyet_dinh_id,
                id
            ]);
            
            // Cập nhật các giá trị trường động nếu có
            if (truongDongValues && Object.keys(truongDongValues).length > 0) {
                for (const [truongThongTinId, giatri] of Object.entries(truongDongValues)) {
                    // Kiểm tra xem trường này đã có giá trị chưa
                    const checkQuery = `
                        SELECT id FROM GiaTriTruongThongTin 
                        WHERE van_bang_id = ? AND truong_thong_tin_id = ?
                    `;
                    const [existingValues] = await connection.execute(checkQuery, [id, truongThongTinId]);
                    
                    if (existingValues.length > 0) {
                        // Cập nhật giá trị hiện có
                        const updateQuery = `
                            UPDATE GiaTriTruongThongTin 
                            SET gia_tri = ? 
                            WHERE van_bang_id = ? AND truong_thong_tin_id = ?
                        `;
                        await connection.execute(updateQuery, [giatri, id, truongThongTinId]);
                    } else {
                        // Thêm giá trị mới
                        const insertQuery = `
                            INSERT INTO GiaTriTruongThongTin (
                                van_bang_id, 
                                truong_thong_tin_id, 
                                gia_tri
                            ) VALUES (?, ?, ?)
                        `;
                        await connection.execute(insertQuery, [id, truongThongTinId, giatri]);
                    }
                }
            }
            
            await connection.commit();
            
            // Lấy văn bằng sau khi cập nhật
            return await this.getById(id);
        } catch (err) {
            await connection.rollback();
            console.error(err);
            throw err;
        } finally {
            connection.release();
        }
    }

    // Xóa văn bằng
    static async delete(id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            // Xóa các giá trị trường động trước
            await connection.execute('DELETE FROM GiaTriTruongThongTin WHERE van_bang_id = ?', [id]);
            
            // Xóa bản ghi lượt tra cứu
            await connection.execute('DELETE FROM LuotTraCuu WHERE van_bang_id = ?', [id]);
            
            // Xóa văn bằng
            const [result] = await connection.execute('DELETE FROM VanBang WHERE id = ?', [id]);
            
            await connection.commit();
            
            return result.affectedRows > 0;
        } catch (err) {
            await connection.rollback();
            console.error(err);
            throw err;
        } finally {
            connection.release();
        }
    }
    
    // Ghi nhận lượt tra cứu
    static async ghiNhanTraCuu(vanBangId, quyetDinhId) {
        try {
            const query = `
                INSERT INTO LuotTraCuu (van_bang_id, quyet_dinh_id)
                VALUES (?, ?)
            `;
            
            await db.execute(query, [vanBangId, quyetDinhId]);
            return true;
        } catch (err) {
            console.error(err);
            throw new Error('Lỗi khi ghi nhận lượt tra cứu');
        }
    }
    
    // Lấy danh sách trường thông tin động
    static async getTruongThongTin() {
        try {
            const query = 'SELECT * FROM TruongThongTin';
            const [rows] = await db.execute(query);
            return rows;
        } catch (err) {
            console.error(err);
            throw new Error('Lỗi khi lấy danh sách trường thông tin');
        }
    }
}

module.exports = VanBang; 