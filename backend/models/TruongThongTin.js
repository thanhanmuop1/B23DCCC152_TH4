const db = require('../configs/database');

class TruongThongTin {
	// Lấy tất cả trường thông tin
	static getAll() {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM TruongThongTin', (err, results) => {
				if (err) {
					return reject(err);
				}
				resolve(results);
			});
		});
	}

	// Lấy một trường thông tin theo ID
	static getById(id) {
		return new Promise((resolve, reject) => {
			db.query('SELECT * FROM TruongThongTin WHERE id = ?', [id], (err, results) => {
				if (err) {
					return reject(err);
				}
				resolve(results[0]);
			});
		});
	}

	// Thêm trường thông tin mới
	static create(truongThongTin) {
		return new Promise((resolve, reject) => {
			db.query(
				'INSERT INTO TruongThongTin (ten_truong, kieu_du_lieu) VALUES (?, ?)',
				[truongThongTin.ten_truong, truongThongTin.kieu_du_lieu],
				(err, result) => {
					if (err) {
						return reject(err);
					}
					resolve(result.insertId);
				},
			);
		});
	}

	// Cập nhật trường thông tin
	static update(id, truongThongTin) {
		return new Promise((resolve, reject) => {
			db.query(
				'UPDATE TruongThongTin SET ten_truong = ?, kieu_du_lieu = ? WHERE id = ?',
				[truongThongTin.ten_truong, truongThongTin.kieu_du_lieu, id],
				(err, result) => {
					if (err) {
						return reject(err);
					}
					resolve(result.affectedRows > 0);
				},
			);
		});
	}

	// Xóa trường thông tin
	static delete(id) {
		return new Promise((resolve, reject) => {
			db.query('DELETE FROM TruongThongTin WHERE id = ?', [id], (err, result) => {
				if (err) {
					return reject(err);
				}
				resolve(result.affectedRows > 0);
			});
		});
	}
}

module.exports = TruongThongTin;
