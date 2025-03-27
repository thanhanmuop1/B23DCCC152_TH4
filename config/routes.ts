export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
	path: '/danh-muc/quyet-dinh-tot-nghiep',
	name: 'Quyết định tốt nghiệp',
	component: './DanhMuc/QuyetDinhTotNghiep',
	access: 'canAccessQuyetDinhTotNghiep',  // Quyền truy cập (có thể tùy chỉnh theo yêu cầu)
  },
  {
	path: '/danh-muc/so-van-bang',
	name: 'Sổ văn bằng',
	component: './DanhMuc/SoVanBang',
	access: 'canAccessSoVanBang',  // Quyền truy cập (có thể tùy chỉnh theo yêu cầu)
  },
  {
	path: '/danh-muc/truong-thong-tin',
	name: 'Trường thông tin',
	component: './DanhMuc/TruongThongTin',
	access: 'canAccessTruongThongTin',  // Quyền truy cập (có thể tùy chỉnh theo yêu cầu)
  },
  {
	path: '/danh-muc/thong-tin-van-bang',
	name: 'Thông tin văn bằng',
	component: './DanhMuc/ThongTinVanBang',
	access: 'canAccessThongTinVanBang',  // Quyền truy cập (có thể tùy chỉnh theo yêu cầu)
  },
  {
	path: '/danh-muc/tra-cuu-van-bang',
	name: 'Tra cứu văn bằng',
	component: './DanhMuc/TraCuuVanBang',
	access: 'canAccessTraCuuVanBang',  // Quyền truy cập (có thể tùy chỉnh theo yêu cầu)
  },
  {
	path: '/danh-muc/thong-ke-luot-tra-cuu',
	name: 'Thống kê lượt tra cứu',
	component: './DanhMuc/ThongKeLuotTraCuu',
	access: 'canAccessThongKeLuotTraCuu',  // Quyền truy cập (có thể tùy chỉnh theo yêu cầu)
  },
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
