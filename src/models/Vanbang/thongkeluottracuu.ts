import { useState, useEffect } from 'react';
import { message } from 'antd';
import LuotTraCuuService from '@/services/LuotTraCuu';
import { ThongKeQuyetDinhRecord, ThongKeThoiGianRecord, LuotTraCuuRecord, TongQuanThongKe } from '@/services/LuotTraCuu/typing';

// Định nghĩa interface cho dữ liệu thống kê
export interface ThongKeLuotTraCuu {
  id: number;
  soQuyetDinh: string;
  ngayBanHanh: Date;
  trichYeu: string;
  soLuotTraCuu: number;
}

export interface ThongKeThoiGian {
  ngay: Date;
  soLuotTraCuu: number;
}

export interface LuotTraCuu {
  id: number;
  thoiGian: Date;
  soHieuVanBang: string;
  hoTen: string;
  soQuyetDinh: string;
}

// Hook để quản lý state của thống kê lượt tra cứu
export function useInitModel() {
  const [danhSachThongKe, setDanhSachThongKe] = useState<ThongKeLuotTraCuu[]>([]);
  const [danhSachThongKeThoiGian, setDanhSachThongKeThoiGian] = useState<ThongKeThoiGian[]>([]);
  const [danhSachLuotTraCuuGanDay, setDanhSachLuotTraCuuGanDay] = useState<LuotTraCuu[]>([]);
  const [tongQuanThongKe, setTongQuanThongKe] = useState<TongQuanThongKe | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tuNgay, setTuNgay] = useState<string>('');
  const [denNgay, setDenNgay] = useState<string>('');

  // Hàm lấy thống kê theo quyết định
  const fetchThongKeTheoQuyetDinh = async () => {
    setLoading(true);
    try {
      const response = await LuotTraCuuService.getThongKeTheoQuyetDinh();
      if (response.data.success) {
        // Chuyển đổi dữ liệu từ backend sang format frontend
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          soQuyetDinh: item.so_quyet_dinh,
          ngayBanHanh: new Date(item.ngay_ban_hanh),
          trichYeu: item.trich_yeu,
          soLuotTraCuu: item.so_luot_tra_cuu
        }));
        setDanhSachThongKe(formattedData);
      } else {
        message.error('Có lỗi xảy ra khi tải dữ liệu thống kê');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy thống kê theo thời gian
  const fetchThongKeTheoThoiGian = async (tuNgay?: string, denNgay?: string) => {
    setLoading(true);
    try {
      const response = await LuotTraCuuService.getThongKeTheoThoiGian(tuNgay, denNgay);
      if (response.data.success) {
        // Chuyển đổi dữ liệu từ backend sang format frontend
        const formattedData = response.data.data.map((item) => ({
          ngay: new Date(item.ngay),
          soLuotTraCuu: item.so_luot_tra_cuu
        }));
        setDanhSachThongKeThoiGian(formattedData);
      } else {
        message.error('Có lỗi xảy ra khi tải dữ liệu thống kê theo thời gian');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy chi tiết các lượt tra cứu gần đây
  const fetchLuotTraCuuGanDay = async (limit: number = 10) => {
    setLoading(true);
    try {
      const response = await LuotTraCuuService.getLuotTraCuuGanDay(limit);
      if (response.data.success) {
        // Chuyển đổi dữ liệu từ backend sang format frontend
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          thoiGian: new Date(item.thoi_gian),
          soHieuVanBang: item.so_hieu_van_bang,
          hoTen: item.ho_ten,
          soQuyetDinh: item.so_quyet_dinh
        }));
        setDanhSachLuotTraCuuGanDay(formattedData);
      } else {
        message.error('Có lỗi xảy ra khi tải dữ liệu lượt tra cứu gần đây');
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy tổng quan thống kê
  const fetchTongQuanThongKe = async () => {
    setLoading(true);
    try {
      const response = await LuotTraCuuService.getTongQuanThongKe();
      if (response.data.success) {
        setTongQuanThongKe(response.data.data);
      } else {
        message.error('Có lỗi xảy ra khi tải dữ liệu tổng quan thống kê');
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
    fetchTongQuanThongKe();
    fetchThongKeTheoQuyetDinh();
    fetchLuotTraCuuGanDay();
    // Mặc định lấy 7 ngày gần đây
    const defaultTuNgay = new Date();
    defaultTuNgay.setDate(defaultTuNgay.getDate() - 7);
    const formattedTuNgay = defaultTuNgay.toISOString().split('T')[0];
    const formattedDenNgay = new Date().toISOString().split('T')[0];
    
    setTuNgay(formattedTuNgay);
    setDenNgay(formattedDenNgay);
    
    fetchThongKeTheoThoiGian(formattedTuNgay, formattedDenNgay);
  }, []);

  // Hàm lọc thống kê theo khoảng thời gian
  const filterThongKeTheoThoiGian = (tuNgay: string, denNgay: string) => {
    setTuNgay(tuNgay);
    setDenNgay(denNgay);
    fetchThongKeTheoThoiGian(tuNgay, denNgay);
  };

  return {
    danhSachThongKe,
    danhSachThongKeThoiGian,
    danhSachLuotTraCuuGanDay,
    tongQuanThongKe,
    loading,
    tuNgay,
    denNgay,
    filterThongKeTheoThoiGian,
    fetchThongKeTheoQuyetDinh,
    fetchThongKeTheoThoiGian,
    fetchLuotTraCuuGanDay,
    fetchTongQuanThongKe
  };
} 