const db = require('../configs/database');

class QuyetDinhTotNghiep {
    static async create(quyetDinh) {
        console.log(quyetDinh);
        const query = `
            INSERT INTO QuyetDinhTotNghiep 
            (so_quyet_dinh, ngay_ban_hanh, trich_yeu, so_van_bang_id) 
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            quyetDinh.so_quyet_dinh,
            quyetDinh.ngay_ban_hanh,
            quyetDinh.trich_yeu,
            quyetDinh.so_van_bang_id
        ]);
        console.log(result);
        return result;
    }

    static async getAll() {
        const query = `
            SELECT qd.*, svb.nam 
            FROM QuyetDinhTotNghiep qd
            JOIN SoVanBang svb ON qd.so_van_bang_id = svb.id
        `;
        const [rows] = await db.execute(query);
        return rows;
    }

    static async getById(id) {
        const query = `
            SELECT qd.*, svb.nam 
            FROM QuyetDinhTotNghiep qd
            JOIN SoVanBang svb ON qd.so_van_bang_id = svb.id
            WHERE qd.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        return rows[0];
    }

    static async update(id, quyetDinh) {
        const query = `
            UPDATE QuyetDinhTotNghiep 
            SET so_quyet_dinh = ?, 
                ngay_ban_hanh = ?, 
                trich_yeu = ?, 
                so_van_bang_id = ?
            WHERE id = ?
        `;
        const [result] = await db.execute(query, [
            quyetDinh.so_quyet_dinh,
            quyetDinh.ngay_ban_hanh,
            quyetDinh.trich_yeu,
            quyetDinh.so_van_bang_id,
            id
        ]);
        return result;
    }

    static async delete(id) {
        const query = 'DELETE FROM QuyetDinhTotNghiep WHERE id = ?';
        const [result] = await db.execute(query, [id]);
        return result;
    }
}

module.exports = QuyetDinhTotNghiep; 