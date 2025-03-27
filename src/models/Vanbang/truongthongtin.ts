import { useState } from 'react';
import { message } from 'antd';

// Định nghĩa kiểu dữ liệu cho Trường Thông Tin
export interface TruongThongTin {
  id: string;
  tenTruong: string;
  kieuDuLieu: 'String' | 'Number' | 'Date';
  batBuoc: boolean;
}

// Hook quản lý state và logic
export function useInitModel<T extends TruongThongTin>() {
  const [danhSachTruongThongTin, setDanhSachTruongThongTin] = useState<T[]>([]);
  const [truongThongTinSelected, setTruongThongTinSelected] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  // Hàm thêm trường thông tin mới
  const themTruongThongTin = (values: Omit<T, 'id'>) => {
    setLoading(true);
    try {
      const newItem = {
        ...values,
        id: Math.floor(Math.random() * 10000).toString(), // Giả lập ID
      } as T;

      setDanhSachTruongThongTin(prev => [...prev, newItem]);
      message.success('Đã thêm trường thông tin mới thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm trường thông tin');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật trường thông tin
  const capNhatTruongThongTin = (values: T) => {
    setLoading(true);
    try {
      setDanhSachTruongThongTin(prev =>
        prev.map(item => (item.id === values.id ? values : item))
      );
      message.success('Đã cập nhật trường thông tin thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trường thông tin');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa trường thông tin
  const xoaTruongThongTin = (id: string) => {
    setLoading(true);
    try {
      // Kiểm tra nếu trường đã được sử dụng (giả lập)
      const daDuocSuDung = false; // Trong thực tế, cần kiểm tra từ backend
      
      if (daDuocSuDung) {
        message.error('Không thể xóa trường thông tin này vì đã được sử dụng trong văn bằng');
        return;
      }

      setDanhSachTruongThongTin(prev => prev.filter(item => item.id !== id));
      message.success('Đã xóa trường thông tin thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa trường thông tin');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm trường thông tin
  const timKiemTruongThongTin = (keyword: string) => {
    setLoading(true);
    try {
      const result = danhSachTruongThongTin.filter(item =>
        item.tenTruong.toLowerCase().includes(keyword.toLowerCase())
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
    danhSachTruongThongTin,
    setDanhSachTruongThongTin,
    truongThongTinSelected,
    setTruongThongTinSelected,
    loading,
    setLoading,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    themTruongThongTin,
    capNhatTruongThongTin,
    xoaTruongThongTin,
    timKiemTruongThongTin,
  };
} 