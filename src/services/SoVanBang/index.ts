import axios from 'axios';
import { SoVanBangRecord, ApiResponse } from './typing';

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:3000/api/sovanbang';

// Service cho SoVanBang
export default class SoVanBangService {
  // Lấy danh sách
  static async getList() {
    return axios.get<ApiResponse<SoVanBangRecord[]>>(`${BASE_URL}`);
  }

  // Lấy chi tiết theo ID
  static async getById(id: number) {
    return axios.get<ApiResponse<SoVanBangRecord>>(`${BASE_URL}/${id}`);
  }
  
  // Lấy sổ văn bằng hiện tại
  static async getCurrentBook() {
    return axios.get<ApiResponse<SoVanBangRecord>>(`${BASE_URL}/current`);
  }
  
  // Lấy sổ văn bằng theo năm
  static async getByYear(year: number) {
    return axios.get<ApiResponse<SoVanBangRecord>>(`${BASE_URL}/year/${year}`);
  }
  
  // Thêm mới sổ văn bằng
  static async create(sovanbang: Omit<SoVanBangRecord, 'id'>) {
    console.log(sovanbang);
    return axios.post<ApiResponse<SoVanBangRecord>>(`${BASE_URL}`, sovanbang);
  }
  
  // Cập nhật sổ văn bằng
  static async update(id: number, sovanbang: Partial<SoVanBangRecord>) {
    console.log(sovanbang);
    return axios.put(`${BASE_URL}/${id}`, sovanbang);
  }
  
  // Xóa sổ văn bằng
  static async delete(id: number) {
    return axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  }
}