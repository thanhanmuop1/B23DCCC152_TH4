const db = require('../configs/database');

class SoVanBang {
    // Tạo sổ văn bằng mới cho năm hiện tại
    static async createNewBook(nam) {
        try {
            // Kiểm tra xem năm đã có sổ chưa
            const existingBook = await this.getByYear(nam);
            if (existingBook) {
                throw new Error(`Sổ văn bằng năm ${nam} đã tồn tại`);
            }

            const query = `
                INSERT INTO SoVanBang (nam, so_hien_tai)
                VALUES (?, 1)
            `;
            const [result] = await db.execute(query, [nam]);
            
            return {
                id: result.insertId,
                nam: nam,
                soHienTai: 1
            };
        } catch (error) {
            throw error;
        }
    }

    // Lấy sổ văn bằng theo năm
    static async getByYear(nam) {
        const query = `
            SELECT 
                id,
                nam,
                so_hien_tai as soHienTai
            FROM SoVanBang 
            WHERE nam = ?
        `;
        const [rows] = await db.execute(query, [nam]);
        return rows[0];
    }

    // Lấy tất cả sổ văn bằng
    static async getAll() {
        const query = `
            SELECT 
                id,
                nam,
                so_hien_tai as soHienTai
            FROM SoVanBang 
            ORDER BY nam DESC
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    // Lấy thông tin chi tiết sổ văn bằng bao gồm số lượng văn bằng
    static async getDetailById(id) {
        const query = `
            SELECT 
                s.id,
                s.nam,
                s.so_hien_tai as soHienTai,
                COUNT(v.id) as tongVanBang,
                COUNT(DISTINCT q.id) as tongQuyetDinh
            FROM SoVanBang s
            LEFT JOIN VanBang v ON s.id = v.so_van_bang_id
            LEFT JOIN QuyetDinhTotNghiep q ON s.id = q.so_van_bang_id
            WHERE s.id = ?
            GROUP BY s.id
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    // Lấy hoặc tạo sổ văn bằng cho năm hiện tại
    static async getOrCreateCurrentBook() {
        const currentYear = new Date().getFullYear();
        
        // Tìm sổ của năm hiện tại
        let book = await this.getByYear(currentYear);
        
        // Nếu chưa có thì tạo mới
        if (!book) {
            book = await this.createNewBook(currentYear);
        }
        
        return book;
    }

    //Cập nhật năm sổ văn bằng
    static async updateNamSoVanBang(id, nam) {
        const query = `UPDATE SoVanBang SET nam = ? WHERE id = ?`;
        await db.execute(query, [nam, id]);
        return {
            success: true,
            message: 'Cập nhật năm sổ văn bằng thành công',
            data: {
                nam: nam
            }
        };

    }

    //Xóa năm sổ văn bằng
    static async deleteNamSoVanBang(id) {
        const query = `DELETE FROM SoVanBang WHERE id = ?`;
        await db.execute(query, [id]);
        return {
            success: true,
            message: 'Xóa năm sổ văn bằng thành công',
            data: {
                id: id
            }
        };
    }
}

module.exports = SoVanBang; 