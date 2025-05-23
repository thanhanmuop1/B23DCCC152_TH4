const express = require('express');
const cors = require('cors');
const quyetDinhRoutes = require('./routes/quyetDinhRoutes');
const soVanBangRoutes = require('./routes/soVanBangRoutes');
const truongThongTinRoutes = require('./routes/truongThongTin');
const vanBangRoutes = require('./routes/vanBangRoutes');
const luotTraCuuRoutes = require('./routes/luotTraCuuRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/quyetdinh', quyetDinhRoutes);
app.use('/api/sovanbang', soVanBangRoutes);
app.use('/api/truongthongtin', truongThongTinRoutes);
app.use('/api/vanbang', vanBangRoutes);
app.use('/api/luot-tra-cuu', luotTraCuuRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: 'Đã xảy ra lỗi server',
		error: err.message,
	});
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server đang chạy trên port ${PORT}`);
});
