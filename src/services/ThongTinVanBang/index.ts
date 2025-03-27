import axios from 'axios';
import { VanBangRecord, ApiResponse, TruongThongTinItem } from './typing';

const BASE_URL = 'http://localhost:3000/api/vanbang';

export default class ThongTinVanBangService {
  // Lấy danh sách văn bằng
  static async getList() {
    return axios.get<ApiResponse<VanBangRecord[]>>(`${BASE_URL}`);
  }

  // Lấy chi tiết văn bằng theo ID
  static async getById(id: number) {
    return axios.get<ApiResponse<VanBangRecord>>(`${BASE_URL}/${id}`);
  }

  // Tìm kiếm văn bằng
  static async search(params: {
    so_hieu_van_bang?: string;
    so_vao_so?: number;
    ma_sinh_vien?: string;
    ho_ten?: string;
    ngay_sinh?: string;
  }) {
    // Đếm số field có giá trị để kiểm tra yêu cầu ít nhất 2 field
    const filledFieldCount = Object.values(params).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;
    
    if (filledFieldCount < 2) {
      return Promise.reject({
        response: {
          data: {
            success: false,
            message: 'Vui lòng cung cấp ít nhất 2 thông tin để tìm kiếm'
          }
        }
      });
    }
    
    return axios.post<ApiResponse<VanBangRecord[]>>(`${BASE_URL}/search`, params);
  }

  // Tạo văn bằng mới
  static async create(vanBang: Partial<Omit<VanBangRecord, 'id'>>, truongDong?: Record<string, string>) {
    return axios.post<ApiResponse<VanBangRecord>>(`${BASE_URL}`, {
      vanBang,
      truongDong
    });
  }

  // Cập nhật văn bằng
  static async update(id: number, vanBang: Partial<VanBangRecord>, truongDong?: Record<string, string>) {
    return axios.patch<ApiResponse<VanBangRecord>>(`${BASE_URL}/${id}`, {
      vanBang,
      truongDong
    });
  }

  // Xóa văn bằng
  static async delete(id: number) {
    return axios.delete<ApiResponse<boolean>>(`${BASE_URL}/${id}`);
  }
}