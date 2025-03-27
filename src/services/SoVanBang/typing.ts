export interface SoVanBangRecord {
  id: number;
  nam: number;
  soHienTai: number;
  moTa?: string;
  ngayTao?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
