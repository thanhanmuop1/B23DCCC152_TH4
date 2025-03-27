import axios from 'axios';
import { TruongThongTinRecord } from './typing';

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:3000/api/truongthongtin';

// Service cho TruongThongTin
export default class TruongThongTinService {
  // Lấy danh sách
  static async getList() {
    return axios.get(`${BASE_URL}`);
  }

  // Lấy chi tiết theo ID
  static async getById(id: number) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // Thêm mới
  static async create(data: Omit<TruongThongTinRecord, 'id'>) {
    return axios.post(`${BASE_URL}`, data);
  }

  // Cập nhật
  static async update(id: number, data: Partial<TruongThongTinRecord>) {
    return axios.put(`${BASE_URL}/${id}`, data);
  }

  // Xóa
  static async delete(id: number) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
} 