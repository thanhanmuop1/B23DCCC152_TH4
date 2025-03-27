export interface LuotTraCuuRecord {
  id: number;
  thoi_gian: string;
  so_hieu_van_bang: string;
  ho_ten: string;
  so_quyet_dinh: string;
}

export interface ThongKeQuyetDinhRecord {
  id: number;
  so_quyet_dinh: string;
  ngay_ban_hanh: string;
  trich_yeu: string;
  so_luot_tra_cuu: number;
}

export interface ThongKeThoiGianRecord {
  ngay: string;
  so_luot_tra_cuu: number;
}

export interface TongQuanThongKe {
  tong_luot_tra_cuu: number;
  quyet_dinh_nhieu_nhat: ThongKeQuyetDinhRecord | null;
  thong_ke_7_ngay: ThongKeThoiGianRecord[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 