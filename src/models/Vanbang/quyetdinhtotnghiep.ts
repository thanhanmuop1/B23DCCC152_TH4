import { useState, useEffect } from 'react';
import { message } from 'antd';
import QuyetDinhTotNghiepService from '@/services/QuyetDinhTotNghiep';
import SoVanBangService from '@/services/SoVanBang';
import { SoVanBang } from './sovanbang';

// Định nghĩa interface cho quyết định tốt nghiệp
export interface QuyetDinhTotNghiep {
  id: number;
  soQuyetDinh: string;
  ngayBanHanh: Date;
  trichYeu: string;
  soVanBangId: number;
  nam?: number; // Từ join với bảng SoVanBang
}

// Hook để quản lý state của quyết định tốt nghiệp
export function useInitModel() {
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinhTotNghiep[]>([]);
  const [quyetDinhSelected, setQuyetDinhSelected] = useState<QuyetDinhTotNghiep | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [danhSachSoVanBang, setDanhSachSoVanBang] = useState<SoVanBang[]>([]);

  // Hàm lấy danh sách sổ văn bằng từ API
  const fetchDanhSachSoVanBang = async () => {
    try {
      const response = await SoVanBangService.getList();
      if (response.data.success) {
        setDanhSachSoVanBang(response.data.data);
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tải danh sách sổ văn bằng');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    }
  };

  // Hàm lấy danh sách từ API
  const fetchDanhSachQuyetDinh = async () => {
    setLoading(true);
    try {
      const response = await QuyetDinhTotNghiepService.getList();
      if (response.data.success) {
        // Chuyển đổi dữ liệu từ backend sang format frontend
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          soQuyetDinh: item.so_quyet_dinh,
          ngayBanHanh: new Date(item.ngay_ban_hanh),
          trichYeu: item.trich_yeu,
          soVanBangId: item.so_van_bang_id,
          nam: item.nam
        }));
        setDanhSachQuyetDinh(formattedData);
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

  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchDanhSachQuyetDinh();
    fetchDanhSachSoVanBang();
  }, []);

  // Hàm thêm quyết định mới
  const themQuyetDinh = async (quyetDinh: Omit<QuyetDinhTotNghiep, 'id'>) => {
    setLoading(true);
    try {
      // Chuyển đổi dữ liệu từ frontend sang format backend
      const quyetDinhData = {
        so_quyet_dinh: quyetDinh.soQuyetDinh,
        ngay_ban_hanh: quyetDinh.ngayBanHanh.toISOString(),
        trich_yeu: quyetDinh.trichYeu,
        so_van_bang_id: quyetDinh.soVanBangId
      };
      const response = await QuyetDinhTotNghiepService.create(quyetDinhData);
      
      if (response.data.success) {
        message.success('Thêm quyết định thành công');
        await fetchDanhSachQuyetDinh(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi thêm quyết định');
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

  // Hàm cập nhật quyết định
  const capNhatQuyetDinh = async (quyetDinh: QuyetDinhTotNghiep) => {
    setLoading(true);
    try {
      // Chuyển đổi dữ liệu từ frontend sang format backend
      const quyetDinhData = {
        so_quyet_dinh: quyetDinh.soQuyetDinh,
        ngay_ban_hanh: quyetDinh.ngayBanHanh.toISOString(),
        trich_yeu: quyetDinh.trichYeu,
        so_van_bang_id: quyetDinh.soVanBangId
      };
      console.log(quyetDinhData);
      const response = await QuyetDinhTotNghiepService.update(quyetDinh.id, quyetDinhData);
      
      if (response.data.success) {
        message.success('Cập nhật quyết định thành công');
        await fetchDanhSachQuyetDinh(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi cập nhật quyết định');
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

  // Hàm xóa quyết định
  const xoaQuyetDinh = async (id: number) => {
    setLoading(true);
    try {
      const response = await QuyetDinhTotNghiepService.delete(id);
      
      if (response.data.success) {
        message.success('Xóa quyết định thành công');
        await fetchDanhSachQuyetDinh(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa quyết định');
        return false;
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        message.error('Không thể xóa quyết định này vì đã được sử dụng');
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

  // Hàm tìm kiếm quyết định
  const timKiemQuyetDinh = (keyword: string) => {
    setLoading(true);
    try {
      // Tìm kiếm từ dữ liệu đã có trong state
      const result = danhSachQuyetDinh.filter(item =>
        item.soQuyetDinh.toLowerCase().includes(keyword.toLowerCase()) ||
        item.trichYeu.toLowerCase().includes(keyword.toLowerCase())
      );
      setDanhSachQuyetDinh(result);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tìm kiếm');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    danhSachQuyetDinh,
    setDanhSachQuyetDinh,
    quyetDinhSelected,
    setQuyetDinhSelected,
    loading,
    setLoading,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    danhSachSoVanBang,
    themQuyetDinh,
    capNhatQuyetDinh,
    xoaQuyetDinh,
    timKiemQuyetDinh,
    fetchDanhSachQuyetDinh,
    fetchDanhSachSoVanBang
  };
} 