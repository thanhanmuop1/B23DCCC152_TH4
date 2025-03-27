const db = require('../configs/database');

class TruongThongTin {
	// Lấy tất cả trường thông tin
	static async getAll() {
		try {
			const results = await db.query('SELECT * FROM TruongThongTin');
			return results;
		} catch (err) {
			throw new Error('Lỗi khi lấy danh sách trường thông tin');
		}
	}

	// Lấy một trường thông tin theo ID
	static async getById(id) {
		try {
			const results = await db.query('SELECT * FROM TruongThongTin WHERE id = ?', [id]);
			return results[0];
		} catch (err) {
			throw new Error('Lỗi khi lấy trường thông tin theo ID');
		}
	}

	// Thêm trường thông tin mới
	static async create(truongThongTin) {
		try {
			const results = await db.query('INSERT INTO TruongThongTin (ten_truong, kieu_du_lieu) VALUES (?, ?)', [
				truongThongTin.ten_truong,
				truongThongTin.kieu_du_lieu,
			]);
			return results;
		} catch (err) {
			throw new Error('Lỗi khi thêm trường thông tin mới');
		}
	}

	// Cập nhật trường thông tin
	static async update(id, truongThongTin) {
		try {
			console.log(id);
			console.log(truongThongTin);
			const results = await db.query('UPDATE truongthongtin SET ten_truong = ?, kieu_du_lieu = ? WHERE id = ?', [
				truongThongTin.ten_truong,
				truongThongTin.kieu_du_lieu,
				id,
			]);
			return results;
		} catch (err) {
			throw new Error('Lỗi khi cập nhật trường thông tin');
		}
	}

	// Xóa trường thông tin
	static async delete(id) {
		try {
			const results = await db.query('DELETE FROM TruongThongTin WHERE id = ?', [id]);
			return results;
		} catch (err) {
			throw new Error('Lỗi khi xóa trường thông tin');
		}
	}
}

module.exports = TruongThongTin;
