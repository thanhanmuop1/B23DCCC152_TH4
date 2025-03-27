import axios from 'axios';
import { 
  ApiResponse, 
  LuotTraCuuRecord, 
  ThongKeQuyetDinhRecord, 
  ThongKeThoiGianRecord,
  TongQuanThongKe
} from './typing';

// Định nghĩa base URL cho API
const BASE_URL = 'http://localhost:3000/api/luot-tra-cuu';

// Service cho LuotTraCuu
export default class LuotTraCuuService {
  // Ghi nhận lượt tra cứu mới
  static async create(van_bang_id: number, quyet_dinh_id: number) {
    return axios.post<ApiResponse<null>>(`${BASE_URL}`, {
      van_bang_id,
      quyet_dinh_id
    });
  }

  // Lấy thống kê theo quyết định
  static async getThongKeTheoQuyetDinh() {
    return axios.get<ApiResponse<ThongKeQuyetDinhRecord[]>>(`${BASE_URL}/thong-ke/quyet-dinh`);
  }

  // Lấy thống kê theo thời gian
  static async getThongKeTheoThoiGian(tuNgay?: string, denNgay?: string) {
    let url = `${BASE_URL}/thong-ke/thoi-gian`;
    
    const params = new URLSearchParams();
    if (tuNgay) params.append('tu_ngay', tuNgay);
    if (denNgay) params.append('den_ngay', denNgay);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    return axios.get<ApiResponse<ThongKeThoiGianRecord[]>>(url);
  }

  // Lấy chi tiết các lượt tra cứu gần đây
  static async getLuotTraCuuGanDay(limit: number = 10) {
    return axios.get<ApiResponse<LuotTraCuuRecord[]>>(`${BASE_URL}/gan-day?limit=${limit}`);
  }

  // Lấy tổng quan thống kê
  static async getTongQuanThongKe() {
    return axios.get<ApiResponse<TongQuanThongKe>>(`${BASE_URL}/tong-quan`);
  }
} 