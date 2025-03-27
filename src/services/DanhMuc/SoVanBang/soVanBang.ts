import axios from '@/utils/axios';
import { SoVanBang } from '@/pages/DanhMuc/SoVanBang/sovanbang';

// API endpoints
const API_URL = `http://localhost:3000/api/sovanbang`;

// Lấy danh sách sổ văn bằng
export const getDanhSachSoVanBang = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy sổ văn bằng hiện tại
export const getSoVanBangHienTai = async () => {
  try {
    const response = await axios.get(`${API_URL}/current`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết sổ văn bằng theo ID
export const getChiTietSoVanBang = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy sổ văn bằng theo năm
export const getSoVanBangTheoNam = async (nam: number) => {
  try {
    const response = await axios.get(`${API_URL}/nam/${nam}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tìm kiếm sổ văn bằng
export const timKiemSoVanBang = async (keyword: string) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Thêm sổ văn bằng mới
export const themSoVanBang = async (data: Omit<SoVanBang, 'id'>) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 
