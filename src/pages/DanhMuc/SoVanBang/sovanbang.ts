import { useState } from 'react';
import { message } from 'antd';

// Định nghĩa kiểu dữ liệu cho Sổ Văn Bằng theo đúng DB
export interface SoVanBang {
  id: string;
  nam: number;          // Thay đổi namHoc thành nam (number)
  so_hien_tai: number;  // Thay đổi soHienTai thành so_hien_tai
}

// Hook quản lý state và logic
export function useInitModel<T extends SoVanBang>() {
  const [danhSachSoVanBang, setDanhSachSoVanBang] = useState<T[]>([]);
  const [soVanBangSelected, setSoVanBangSelected] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  // Hàm thêm sổ văn bằng mới
  const themSoVanBang = (values: Omit<T, 'id' | 'so_hien_tai'>) => {
    setLoading(true);
    try {
      const newItem = {
        ...values,
        id: Math.floor(Math.random() * 10000).toString(), // Giả lập ID
        so_hien_tai: 1, // Giá trị mặc định khi tạo mới
      } as T;

      setDanhSachSoVanBang(prev => [...prev, newItem]);
      message.success('Đã thêm sổ văn bằng mới thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm sổ văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật sổ văn bằng
  const capNhatSoVanBang = (values: T) => {
    setLoading(true);
    try {
      setDanhSachSoVanBang(prev =>
        prev.map(item => (item.id === values.id ? values : item))
      );
      message.success('Đã cập nhật sổ văn bằng thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật sổ văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa sổ văn bằng
  const xoaSoVanBang = (id: string) => {
    setLoading(true);
    try {
      // Kiểm tra nếu sổ có dữ liệu liên quan (giả lập)
      const coLienQuan = false; // Trong thực tế, cần kiểm tra từ backend
      
      if (coLienQuan) {
        message.error('Không thể xóa sổ văn bằng này vì đã có dữ liệu liên quan');
        return;
      }

      setDanhSachSoVanBang(prev => prev.filter(item => item.id !== id));
      message.success('Đã xóa sổ văn bằng thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa sổ văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm sổ văn bằng
  const timKiemSoVanBang = (keyword: string) => {
    setLoading(true);
    try {
      const result = danhSachSoVanBang.filter(item =>
        item.nam.toString().includes(keyword)
      );
      return result;
    } catch (error) {
      message.error('Có lỗi xảy ra khi tìm kiếm');
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    danhSachSoVanBang,
    setDanhSachSoVanBang,
    soVanBangSelected,
    setSoVanBangSelected,
    loading,
    setLoading,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    themSoVanBang,
    capNhatSoVanBang,
    xoaSoVanBang,
    timKiemSoVanBang,
  };
} 