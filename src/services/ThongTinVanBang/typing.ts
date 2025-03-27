export interface GiaTriTruongThongTinRecord {
  id?: number;
  truong_thong_tin_id: number;
  van_bang_id?: number;
  gia_tri: string;
  ten_truong?: string;
  kieu_du_lieu?: string;
}

export interface TruongThongTinItem {
  id: number;
  ten_truong: string;
  kieu_du_lieu: string;
  mo_ta?: string;
  bat_buoc?: boolean;
}

export interface VanBangRecord {
  id: number;
  so_vao_so: number;
  so_hieu_van_bang: string;
  ma_sinh_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  quyet_dinh_id: number;
  so_van_bang_id: number;
  so_quyet_dinh?: string;
  nam_so?: number;
  truong_dong?: Record<string, {
    id: number;
    truong_id: number;
    gia_tri: string;
    kieu_du_lieu: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 