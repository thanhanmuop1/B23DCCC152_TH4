import { useState, useEffect } from 'react';
import { message } from 'antd';
import TruongThongTinService from '@/services/TruongThongTin';
import type { TruongThongTinRecord } from '@/services/TruongThongTin/typing';

// Cập nhật interface để phù hợp với backend
export interface TruongThongTin {
  id: number;
  ten_truong: string;
  kieu_du_lieu: 'String' | 'Number' | 'Date';
}

// Hook quản lý state và logic
export function useInitModel() {
  const [danhSachTruongThongTin, setDanhSachTruongThongTin] = useState<TruongThongTin[]>([]);
  const [truongThongTinSelected, setTruongThongTinSelected] = useState<TruongThongTin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchDanhSachTruongThongTin();
  }, []);

  // Hàm lấy danh sách từ API
  const fetchDanhSachTruongThongTin = async () => {
    setLoading(true);
    try {
      const response = await TruongThongTinService.getList();
      if (response.data.success) {
        // Cần chuyển đổi dữ liệu từ backend sang format frontend
        const formattedData = response.data.data.map((item: any) => ({
          id: item.id,
          ten_truong: item.ten_truong,
          kieu_du_lieu: item.kieu_du_lieu as 'String' | 'Number' | 'Date'
        }));
        setDanhSachTruongThongTin(formattedData);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tải dữ liệu');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm trường thông tin mới
  const themTruongThongTin = async (values: Omit<TruongThongTin, 'id'>) => {
    setLoading(true);
    try {
      const response = await TruongThongTinService.create(values);
      if (response.data.success) {
        message.success('Thêm trường thông tin thành công');
        await fetchDanhSachTruongThongTin(); // Refresh danh sách
        setVisibleModal(false);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi thêm');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể kết nối đến server');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật trường thông tin
  const capNhatTruongThongTin = async (values: TruongThongTin) => {
    setLoading(true);
    try {
      const response = await TruongThongTinService.update(values.id, values);
      if (response.data.success) {
        message.success('Cập nhật trường thông tin thành công');
        await fetchDanhSachTruongThongTin(); // Refresh danh sách
        setVisibleModal(false);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi cập nhật');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa trường thông tin
  const xoaTruongThongTin = async (id: number) => {
    setLoading(true);
    try {
      const response = await TruongThongTinService.delete(id);
      if (response.data.success) {
        message.success('Xóa trường thông tin thành công');
        await fetchDanhSachTruongThongTin(); // Refresh danh sách
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa');
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        message.error('Không thể xóa trường thông tin này vì đã được sử dụng');
      } else {
        message.error('Không thể kết nối đến server');
      }
      console.error(error);
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
    fetchDanhSachTruongThongTin,
  };
} 