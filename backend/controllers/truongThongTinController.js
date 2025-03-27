const TruongThongTin = require('../models/TruongThongTin');

// Lấy tất cả trường thông tin
exports.getAllTruongThongTin = async (req, res) => {
	try {
		const truongThongTin = await TruongThongTin.getAll();
		res.status(200).json({
			success: true,
			data: truongThongTin,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Lỗi khi lấy danh sách trường thông tin',
			error: error.message,
		});
	}
};

// Lấy một trường thông tin theo ID
exports.getTruongThongTinById = async (req, res) => {
	try {
		const id = req.params.id;
		const truongThongTin = await TruongThongTin.getById(id);

		if (!truongThongTin) {
			return res.status(404).json({
				success: false,
				message: 'Không tìm thấy trường thông tin',
			});
		}

		res.status(200).json({
			success: true,
			data: truongThongTin,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Lỗi khi lấy thông tin trường',
			error: error.message,
		});
	}
};

// Thêm trường thông tin mới
exports.createTruongThongTin = async (req, res) => {
	try {
		const { ten_truong, kieu_du_lieu } = req.body;

		// Validate dữ liệu đầu vào
		if (!ten_truong || !kieu_du_lieu) {
			return res.status(400).json({
				success: false,
				message: 'Vui lòng cung cấp đầy đủ thông tin: tên trường và kiểu dữ liệu',
			});
		}

		// Kiểm tra kiểu dữ liệu hợp lệ
		const validTypes = ['String', 'Number', 'Date'];
		if (!validTypes.includes(kieu_du_lieu)) {
			return res.status(400).json({
				success: false,
				message: 'Kiểu dữ liệu không hợp lệ. Chỉ chấp nhận: String, Number, Date',
			});
		}

		const id = await TruongThongTin.create({ ten_truong, kieu_du_lieu });

		res.status(201).json({
			success: true,
			message: 'Thêm trường thông tin thành công',
			data: { id, ten_truong, kieu_du_lieu },
		});
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				success: false,
				message: 'Tên trường đã tồn tại',
			});
		}

		res.status(500).json({
			success: false,
			message: 'Lỗi khi thêm trường thông tin',
			error: error.message,
		});
	}
};

// Cập nhật trường thông tin
exports.updateTruongThongTin = async (req, res) => {
	try {
		const id = req.params.id;
		const { ten_truong, kieu_du_lieu } = req.body;
		console.log(req.body);
		// Validate dữ liệu đầu vào
		if (!ten_truong || !kieu_du_lieu) {
			return res.status(400).json({
				success: false,
				message: 'Vui lòng cung cấp đầy đủ thông tin: tên trường và kiểu dữ liệu',
			});
		}

		// Kiểm tra kiểu dữ liệu hợp lệ
		const validTypes = ['String', 'Number', 'Date'];
		if (!validTypes.includes(kieu_du_lieu)) {
			return res.status(400).json({
				success: false,
				message: 'Kiểu dữ liệu không hợp lệ. Chỉ chấp nhận: String, Number, Date',
			});
		}

		const isUpdated = await TruongThongTin.update(id, { ten_truong, kieu_du_lieu });

		if (!isUpdated) {
			return res.status(404).json({
				success: false,
				message: 'Không tìm thấy trường thông tin',
			});
		}

		res.status(200).json({
			success: true,
			message: 'Cập nhật trường thông tin thành công',
			data: { id, ten_truong, kieu_du_lieu },
		});
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY') {
			return res.status(409).json({
				success: false,
				message: 'Tên trường đã tồn tại',
			});
		}

		res.status(500).json({
			success: false,
			message: 'Lỗi khi cập nhật trường thông tin',
			error: error.message,
		});
	}
};

// Xóa trường thông tin
exports.deleteTruongThongTin = async (req, res) => {
	try {
		const id = req.params.id;

		const isDeleted = await TruongThongTin.delete(id);

		if (!isDeleted) {
			return res.status(404).json({
				success: false,
				message: 'Không tìm thấy trường thông tin',
			});
		}

		res.status(200).json({
			success: true,
			message: 'Xóa trường thông tin thành công',
		});
	} catch (error) {
		// Kiểm tra lỗi khóa ngoại tham chiếu
		if (error.code === 'ER_ROW_IS_REFERENCED_2') {
			return res.status(409).json({
				success: false,
				message: 'Không thể xóa vì trường thông tin đang được sử dụng',
			});
		}

		res.status(500).json({
			success: false,
			message: 'Lỗi khi xóa trường thông tin',
			error: error.message,
		});
	}
};
