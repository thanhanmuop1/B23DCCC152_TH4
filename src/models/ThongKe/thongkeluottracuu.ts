import { useState, useEffect } from 'react';
import { message } from 'antd';
import LuotTraCuuService from '@/services/LuotTraCuu';

// Định nghĩa kiểu dữ liệu cho thống kê
export interface ThongKeTraCuu {
  quyetDinh: string;
  luotTraCuu: number;
}

export interface ThongKeTheoThang {
  thang: string;
  luotTraCuu: number;
}

export interface ThongKeVanBang {
  quyetDinh: string;
  soLuong: number;
}

export interface TongQuanThongKe {
  tongSoVanBang: number;
  soSoVanBang: number;
  soQuyetDinh: number;
  luotTraCuu: number;
  phanTramThayDoiVanBang: number;
  phanTramThayDoiTraCuu: number;
  soSoMoi: number;
  quyetDinhMoi: number;
}

// Hook để quản lý state và logic cho thống kê
export function useThongKeModel() {
  // State cho thống kê
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [luotTraCuuTheoThang, setLuotTraCuuTheoThang] = useState<ThongKeTheoThang[]>([]);
  const [vanBangTheoQuyetDinh, setVanBangTheoQuyetDinh] = useState<ThongKeVanBang[]>([]);
  const [tongQuan, setTongQuan] = useState<TongQuanThongKe>({
    tongSoVanBang: 0,
    soSoVanBang: 0,
    soQuyetDinh: 0,
    luotTraCuu: 0,
    phanTramThayDoiVanBang: 0,
    phanTramThayDoiTraCuu: 0,
    soSoMoi: 0,
    quyetDinhMoi: 0
  });

  // Lấy tổng quan thống kê
  const fetchTongQuanThongKe = async () => {
    setIsLoading(true);
    try {
      const response = await LuotTraCuuService.getTongQuanThongKe();
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Tạm thời gán một số thông tin giả lập vì API chưa trả về đầy đủ
        setTongQuan({
          tongSoVanBang: 345, // Giả lập
          soSoVanBang: 5, // Giả lập
          soQuyetDinh: 12, // Giả lập
          luotTraCuu: data.tong_luot_tra_cuu,
          phanTramThayDoiVanBang: 8, // Giả lập
          phanTramThayDoiTraCuu: data.quyet_dinh_nhieu_nhat ? 15 : 0, // Giả lập
          soSoMoi: 1, // Giả lập
          quyetDinhMoi: 3 // Giả lập
        });
      } else {
        message.error('Có lỗi xảy ra khi tải dữ liệu tổng quan');
      }
    } catch (error) {
      console.error('Lỗi khi tải tổng quan thống kê:', error);
      message.error('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy thống kê lượt tra cứu theo thời gian
  const fetchLuotTraCuuTheoThang = async () => {
    setIsLoading(true);
    try {
      // Tính toán 7 tháng gần đây
      const today = new Date();
      const sevenMonthsAgo = new Date(today);
      sevenMonthsAgo.setMonth(today.getMonth() - 6);
      
      const tuNgay = sevenMonthsAgo.toISOString().split('T')[0];
      const denNgay = today.toISOString().split('T')[0];
      
      const response = await LuotTraCuuService.getThongKeTheoThoiGian(tuNgay, denNgay);
      
      if (response.data.success) {
        // Chuyển đổi dữ liệu theo ngày thành dữ liệu theo tháng
        const dataByDay = response.data.data;
        const dataByMonth: Record<string, number> = {};
        
        // Tạo cấu trúc dữ liệu cho 7 tháng gần đây
        for (let i = 0; i <= 6; i++) {
          const date = new Date(today);
          date.setMonth(today.getMonth() - i);
          const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
          dataByMonth[monthKey] = 0;
        }
        
        // Tổng hợp dữ liệu theo tháng
        dataByDay.forEach((item) => {
          const date = new Date(item.ngay);
          const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
          dataByMonth[monthKey] = (dataByMonth[monthKey] || 0) + item.so_luot_tra_cuu;
        });
        
        // Chuyển đổi sang dạng mảng để hiển thị biểu đồ
        const formattedData = Object.keys(dataByMonth).map(key => ({
          thang: key,
          luotTraCuu: dataByMonth[key]
        })).reverse(); // Sắp xếp từ tháng cũ đến tháng mới
        
        setLuotTraCuuTheoThang(formattedData);
      } else {
        message.error('Có lỗi xảy ra khi tải dữ liệu thống kê theo thời gian');
      }
    } catch (error) {
      console.error('Lỗi khi tải thống kê lượt tra cứu theo thời gian:', error);
      message.error('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  // Lấy thống kê lượt tra cứu theo quyết định
  const fetchThongKeTheoQuyetDinh = async () => {
    setIsLoading(true);
    try {
      const response = await LuotTraCuuService.getThongKeTheoQuyetDinh();
      
      if (response.data.success) {
        const formattedData = response.data.data.map(item => ({
          quyetDinh: item.so_quyet_dinh,
          soLuong: item.so_luot_tra_cuu
        }));
        
        setVanBangTheoQuyetDinh(formattedData);
      } else {
        message.error('Có lỗi xảy ra khi tải dữ liệu thống kê theo quyết định');
      }
    } catch (error) {
      console.error('Lỗi khi tải thống kê theo quyết định:', error);
      message.error('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  // Tải tất cả dữ liệu thống kê
  const loadAllData = () => {
    fetchTongQuanThongKe();
    fetchLuotTraCuuTheoThang();
    fetchThongKeTheoQuyetDinh();
  };

  return {
    isLoading,
    luotTraCuuTheoThang,
    vanBangTheoQuyetDinh,
    tongQuan,
    fetchTongQuanThongKe,
    fetchLuotTraCuuTheoThang,
    fetchThongKeTheoQuyetDinh,
    loadAllData
  };
} 