import axios from 'axios';
import { QuyetDinhTotNghiepRecord, ApiResponse } from './typing';

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:3000/api/quyetdinh';

// Service cho QuyetDinhTotNghiep
export default class QuyetDinhTotNghiepService {
  // Lấy danh sách
  static async getList() {
    return axios.get<ApiResponse<QuyetDinhTotNghiepRecord[]>>(`${BASE_URL}`);
  }

  // Lấy chi tiết theo ID
  static async getById(id: number) {
    return axios.get<ApiResponse<QuyetDinhTotNghiepRecord>>(`${BASE_URL}/${id}`);
  }
  
  // Thêm mới quyết định
  static async create(quyetDinh: Omit<QuyetDinhTotNghiepRecord, 'id'>) {
    return axios.post<ApiResponse<QuyetDinhTotNghiepRecord>>(`${BASE_URL}`, {
      so_quyet_dinh: quyetDinh.so_quyet_dinh,
      ngay_ban_hanh: quyetDinh.ngay_ban_hanh,
      trich_yeu: quyetDinh.trich_yeu,
      so_van_bang_id: quyetDinh.so_van_bang_id
    });
  }
  
  // Cập nhật quyết định
  static async update(id: number, quyetDinh: Omit<QuyetDinhTotNghiepRecord, 'id'>) {
    return axios.put<ApiResponse<QuyetDinhTotNghiepRecord>>(`${BASE_URL}/${id}`, {
      so_quyet_dinh: quyetDinh.so_quyet_dinh,
      ngay_ban_hanh: quyetDinh.ngay_ban_hanh,
      trich_yeu: quyetDinh.trich_yeu,
      so_van_bang_id: quyetDinh.so_van_bang_id
    });
  }
  
  // Xóa quyết định
  static async delete(id: number) {
    return axios.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  }
} 