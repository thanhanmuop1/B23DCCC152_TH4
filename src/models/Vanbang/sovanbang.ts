import { useState, useEffect } from 'react';
import { message } from 'antd';
import { 
  getDanhSachSoVanBang, 
  themSoVanBang as themSoVanBangAPI,
  getSoVanBangHienTai,
  getChiTietSoVanBang,
  getSoVanBangTheoNam
} from '@/services/DanhMuc/SoVanBang/soVanBang';

// Định nghĩa kiểu dữ liệu cho Sổ Văn Bằng theo đúng DB
export interface SoVanBang {
  id: string;
  nam: number;
  so_hien_tai: number;
}

// Hook quản lý state và logic
export function useInitModel<T extends SoVanBang>() {
  const [danhSachSoVanBang, setDanhSachSoVanBang] = useState<T[]>([]);
  const [soVanBangSelected, setSoVanBangSelected] = useState<T | null>(null);
  const [soVanBangHienTai, setSoVanBangHienTai] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  // Hàm lấy danh sách sổ văn bằng
  const layDanhSachSoVanBang = async () => {
    setLoading(true);
    try {
      const response = await getDanhSachSoVanBang();
      setDanhSachSoVanBang(response.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lấy danh sách sổ văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy sổ văn bằng hiện tại
  const laySoVanBangHienTai = async () => {
    setLoading(true);
    try {
      const response = await getSoVanBangHienTai();
      setSoVanBangHienTai(response.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lấy sổ văn bằng hiện tại');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy chi tiết sổ văn bằng
  const layChiTietSoVanBang = async (id: string) => {
    setLoading(true);
    try {
      const response = await getChiTietSoVanBang(id);
      setSoVanBangSelected(response.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi lấy chi tiết sổ văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm sổ văn bằng theo năm
  const timKiemSoVanBangTheoNam = async (nam: number) => {
    setLoading(true);
    try {
      const response = await getSoVanBangTheoNam(nam);
      return response.data;
    } catch (error) {
      message.error('Có lỗi xảy ra khi tìm kiếm sổ văn bằng theo năm');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm sổ văn bằng mới
  const themSoVanBang = async (values: Omit<T, 'id'>) => {
    setLoading(true);
    try {
      const response = await themSoVanBangAPI(values);
      setDanhSachSoVanBang(prev => [...prev, response.data]);
      message.success('Đã thêm sổ văn bằng mới thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm sổ văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    layDanhSachSoVanBang();
    laySoVanBangHienTai();
  }, []);

  return {
    danhSachSoVanBang,
    setDanhSachSoVanBang,
    soVanBangSelected,
    setSoVanBangSelected,
    soVanBangHienTai,
    loading,
    setLoading,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    themSoVanBang,
    layChiTietSoVanBang,
    timKiemSoVanBangTheoNam,
  };
}