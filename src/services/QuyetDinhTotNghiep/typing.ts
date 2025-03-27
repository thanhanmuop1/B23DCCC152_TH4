export interface QuyetDinhTotNghiepRecord {
  id: number;
  so_quyet_dinh: string;
  ngay_ban_hanh: string;
  trich_yeu: string;
  so_van_bang_id: number;
  nam?: number; // Từ join với bảng SoVanBang
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
} 