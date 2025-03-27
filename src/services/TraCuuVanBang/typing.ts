export interface TraCuuParams {
  so_hieu_van_bang?: string;
  so_vao_so?: number;
  ma_sinh_vien?: string;
  ho_ten?: string;
  ngay_sinh?: string;
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
  so_quyet_dinh: string;
  nam_so: number;
  truong_dong: Record<string, any>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 