import { useState, useEffect } from 'react';

// Định nghĩa kiểu dữ liệu cho thống kê tổng quan
export interface TongQuanThongKe {
  tongSoVanBang: number;
  phanTramThayDoiVanBang: number;
  soSoVanBang: number;
  soSoMoi: number;
  soQuyetDinh: number;
  quyetDinhMoi: number;
  luotTraCuu: number;
  phanTramThayDoiTraCuu: number;
}

// Kiểu dữ liệu cho biểu đồ lượt tra cứu theo thời gian
export interface LuotTraCuuTheoThang {
  thang: string;
  luotTraCuu: number;
}

// Kiểu dữ liệu cho biểu đồ văn bằng theo quyết định
export interface VanBangTheoQuyetDinh {
  quyetDinh: string;
  soLuong: number;
}

// Hook quản lý state và logic cho thống kê
export function useThongKeModel() {
  const [tongQuan, setTongQuan] = useState<TongQuanThongKe>({
    tongSoVanBang: 0,
    phanTramThayDoiVanBang: 0,
    soSoVanBang: 0,
    soSoMoi: 0,
    soQuyetDinh: 0,
    quyetDinhMoi: 0,
    luotTraCuu: 0,
    phanTramThayDoiTraCuu: 0
  });

  const [luotTraCuuTheoThang, setLuotTraCuuTheoThang] = useState<LuotTraCuuTheoThang[]>([]);
  const [vanBangTheoQuyetDinh, setVanBangTheoQuyetDinh] = useState<VanBangTheoQuyetDinh[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hàm tải dữ liệu thống kê tổng quan
  const loadThongKeTongQuan = () => {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      // Dữ liệu mẫu
      const mockData: TongQuanThongKe = {
        tongSoVanBang: 1234,
        phanTramThayDoiVanBang: 12,
        soSoVanBang: 8,
        soSoMoi: 2,
        soQuyetDinh: 15,
        quyetDinhMoi: 1,
        luotTraCuu: 578,
        phanTramThayDoiTraCuu: -5
      };

      setTongQuan(mockData);
      setIsLoading(false);
    }, 1000);
  };

  // Hàm tải dữ liệu lượt tra cứu theo thời gian
  const loadLuotTraCuuTheoThang = () => {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      // Dữ liệu mẫu cho 7 tháng gần đây
      const mockData: LuotTraCuuTheoThang[] = [
        { thang: 'Jan', luotTraCuu: 10 },
        { thang: 'Feb', luotTraCuu: 20 },
        { thang: 'Mar', luotTraCuu: 15 },
        { thang: 'Apr', luotTraCuu: 25 },
        { thang: 'May', luotTraCuu: 22 },
        { thang: 'Jun', luotTraCuu: 30 },
        { thang: 'Jul', luotTraCuu: 28 }
      ];

      setLuotTraCuuTheoThang(mockData);
      setIsLoading(false);
    }, 1000);
  };

  // Hàm tải dữ liệu văn bằng theo quyết định
  const loadVanBangTheoQuyetDinh = () => {
    setIsLoading(true);

    // Giả lập API call
    setTimeout(() => {
      // Dữ liệu mẫu
      const mockData: VanBangTheoQuyetDinh[] = [
        { quyetDinh: 'QĐ 001', soLuong: 45 },
        { quyetDinh: 'QĐ 002', soLuong: 30 },
        { quyetDinh: 'QĐ 003', soLuong: 25 },
        { quyetDinh: 'QĐ 004', soLuong: 60 },
        { quyetDinh: 'QĐ 005', soLuong: 20 }
      ];

      setVanBangTheoQuyetDinh(mockData);
      setIsLoading(false);
    }, 1000);
  };

  // Hàm tải tất cả dữ liệu
  const loadAllData = () => {
    loadThongKeTongQuan();
    loadLuotTraCuuTheoThang();
    loadVanBangTheoQuyetDinh();
  };

  return {
    tongQuan,
    luotTraCuuTheoThang,
    vanBangTheoQuyetDinh,
    isLoading,
    loadThongKeTongQuan,
    loadLuotTraCuuTheoThang,
    loadVanBangTheoQuyetDinh,
    loadAllData
  };
} 