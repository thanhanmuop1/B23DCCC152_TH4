export interface TruongThongTinRecord {
  id: number;
  ten_truong: string;
  kieu_du_lieu: 'String' | 'Number' | 'Date'; 
}

export interface TruongThongTinResponse {
  success: boolean;
  data: TruongThongTinRecord[];
  message?: string;
} 