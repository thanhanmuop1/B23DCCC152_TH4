import { useState, useEffect } from 'react';
import { message } from 'antd';
import SoVanBangService from '@/services/SoVanBang';

// Định nghĩa kiểu dữ liệu cho Sổ Văn Bằng
export interface SoVanBang {
  id: number;
  nam: number;
  soHienTai: number;
  moTa?: string;
  ngayTao?: string;
}

// Hook quản lý state và logic
export function useInitModel() {
  const [danhSachSoVanBang, setDanhSachSoVanBang] = useState<SoVanBang[]>([]);
  const [soVanBangSelected, setSoVanBangSelected] = useState<SoVanBang | null>(null);
  const [soVanBangHienTai, setSoVanBangHienTai] = useState<SoVanBang | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  // Hàm lấy danh sách sổ văn bằng
  const fetchDanhSachSoVanBang = async () => {
    setLoading(true);
    try {
      const response = await SoVanBangService.getList();
      if (response.data.success) {
        setDanhSachSoVanBang(response.data.data);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy danh sách sổ văn bằng');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy sổ văn bằng hiện tại
  const fetchSoVanBangHienTai = async () => {
    setLoading(true);
    try {
      const response = await SoVanBangService.getCurrentBook();
      if (response.data.success) {
        setSoVanBangHienTai(response.data.data);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy sổ văn bằng hiện tại');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy chi tiết sổ văn bằng
  const fetchChiTietSoVanBang = async (id: number) => {
    setLoading(true);
    try {
      const response = await SoVanBangService.getById(id);
      if (response.data.success) {
        setSoVanBangSelected(response.data.data);
        return response.data.data;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi lấy chi tiết sổ văn bằng');
        return null;
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm sổ văn bằng theo năm
  const timKiemSoVanBangTheoNam = async (nam: number) => {
    setLoading(true);
    try {
      const response = await SoVanBangService.getByYear(nam);
      if (response.data.success) {
        return response.data.data;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tìm kiếm sổ văn bằng theo năm');
        return null;
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm sổ văn bằng mới
  const themSoVanBang = async (values: Omit<SoVanBang, 'id'>) => {
    setLoading(true);
    try {
      const response = await SoVanBangService.create(values);
      if (response.data.success) {
        message.success('Đã thêm sổ văn bằng mới thành công');
        fetchDanhSachSoVanBang(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi thêm sổ văn bằng');
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể kết nối đến server');
      }
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật sổ văn bằng
  const capNhatSoVanBang = async (id: number, values: Partial<SoVanBang>) => {
    setLoading(true);
    try {
      const response = await SoVanBangService.update(id, values);
      if (response.data.success) {
        message.success('Cập nhật sổ văn bằng thành công');
        fetchDanhSachSoVanBang(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi cập nhật sổ văn bằng');
        return false;
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể kết nối đến server');
      }
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa sổ văn bằng
  const xoaSoVanBang = async (id: number) => {
    setLoading(true);
    try {
      const response = await SoVanBangService.delete(id);
      if (response.data.success) {
        message.success('Xóa sổ văn bằng thành công');
        fetchDanhSachSoVanBang(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa sổ văn bằng');
        return false;
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        message.error('Không thể xóa sổ văn bằng này vì đã được sử dụng');
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể kết nối đến server');
      }
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchDanhSachSoVanBang();
    fetchSoVanBangHienTai();
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
    fetchDanhSachSoVanBang,
    fetchSoVanBangHienTai,
    fetchChiTietSoVanBang,
    themSoVanBang,
    capNhatSoVanBang,
    xoaSoVanBang,
    timKiemSoVanBangTheoNam,
  };
}