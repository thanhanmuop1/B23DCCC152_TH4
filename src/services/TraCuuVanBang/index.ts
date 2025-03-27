import axios from 'axios';
import { TraCuuParams, VanBangRecord, ApiResponse } from './typing';

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:3000/api/vanbang';

// Service cho TraCuuVanBang
export default class TraCuuVanBangService {
  // Tìm kiếm văn bằng
  static async search(params: TraCuuParams) {
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

  // Lấy chi tiết văn bằng theo ID
  static async getById(id: number) {
    return axios.get<ApiResponse<VanBangRecord>>(`${BASE_URL}/${id}`);
  }
} 