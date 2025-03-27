import { useState } from 'react';
import { message } from 'antd';
import TraCuuVanBangService from '@/services/TraCuuVanBang';
import { TraCuuParams, VanBangRecord } from '@/services/TraCuuVanBang/typing';
import LuotTraCuuService from '@/services/LuotTraCuu';
import { GiaTriTruongThongTin } from './thongtinvanbang';

// Định nghĩa kiểu dữ liệu cho Tra cứu Văn Bằng
export interface TraCuuVanBang {
  id: number;
  soVaoSo: number;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: Date;
  quyetDinhId: number;
  soVanBangId: number;
  soQuyetDinh: string;
  namSo: number;
  truongDong: Record<string, any>;
}

// Kiểu dữ liệu cho Quyết định tốt nghiệp (để hiển thị)
export interface QuyetDinhTotNghiep {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: Date;
  trichYeu: string;
  luotTraCuu: number; // Số lượt tra cứu theo quyết định
}

// Định nghĩa interface cho tham số tìm kiếm
export interface TraCuuFormParams {
  soHieuVanBang?: string;
  soVaoSo?: number;
  maSinhVien?: string;
  hoTen?: string;
  ngaySinh?: string;
}

// Hook để quản lý state và logic cho tính năng tra cứu
export function useInitModel() {
  const [ketQuaTraCuu, setKetQuaTraCuu] = useState<TraCuuVanBang[]>([]);
  const [vanBangSelected, setVanBangSelected] = useState<TraCuuVanBang | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinhTotNghiep[]>([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [thongKeTraCuu, setThongKeTraCuu] = useState<{ quyetDinh: string; luotTraCuu: number }[]>([]);

  // Hàm tra cứu văn bằng
  const traCuuVanBang = async (params: TraCuuFormParams) => {
    setLoading(true);
    setHasSearched(true);
    try {
      // Chuyển đổi tham số từ frontend sang backend format
      const apiParams: TraCuuParams = {
        so_hieu_van_bang: params.soHieuVanBang,
        so_vao_so: params.soVaoSo,
        ma_sinh_vien: params.maSinhVien,
        ho_ten: params.hoTen,
        ngay_sinh: params.ngaySinh
      };
      
      const response = await TraCuuVanBangService.search(apiParams);
      
      if (response.data.success) {
        // Chuyển đổi dữ liệu từ backend sang format frontend
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          soVaoSo: item.so_vao_so,
          soHieuVanBang: item.so_hieu_van_bang,
          maSinhVien: item.ma_sinh_vien,
          hoTen: item.ho_ten,
          ngaySinh: new Date(item.ngay_sinh),
          quyetDinhId: item.quyet_dinh_id,
          soVanBangId: item.so_van_bang_id,
          soQuyetDinh: item.so_quyet_dinh,
          namSo: item.nam_so,
          truongDong: item.truong_dong
        }));
        
        setKetQuaTraCuu(formattedData);
        
        if (formattedData.length === 0) {
          message.info('Không tìm thấy văn bằng phù hợp');
        } else {
          message.success(`Đã tìm thấy ${formattedData.length} văn bằng`);
        }
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tìm kiếm');
        setKetQuaTraCuu([]);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể kết nối đến server');
      }
      console.error(error);
      setKetQuaTraCuu([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xem chi tiết văn bằng và ghi nhận lượt tra cứu
  const xemChiTietVanBang = async (vanBang: TraCuuVanBang) => {
    setVanBangSelected(vanBang);
    setVisibleDetail(true);
    
    // Ghi nhận lượt tra cứu
    try {
      await LuotTraCuuService.create(vanBang.id, vanBang.quyetDinhId);
    } catch (error) {
      console.error('Lỗi khi ghi nhận lượt tra cứu:', error);
    }
  };

  // Reset form tìm kiếm
  const resetTraCuu = () => {
    setKetQuaTraCuu([]);
    setVanBangSelected(null);
    setHasSearched(false);
  };

  // Hàm tải danh sách quyết định 
  const loadQuyetDinhTotNghiep = () => {
    setLoading(true);
    
    // Giả lập API call
    setTimeout(() => {
      const mockQuyetDinh: QuyetDinhTotNghiep[] = [
        {
          id: '1',
          soQuyetDinh: 'QĐ-12345/2023',
          ngayBanHanh: new Date('2023-06-15'),
          trichYeu: 'Quyết định công nhận tốt nghiệp cho sinh viên khóa 2020',
          luotTraCuu: 8,
        },
        {
          id: '2',
          soQuyetDinh: 'QĐ-67890/2023',
          ngayBanHanh: new Date('2023-07-20'),
          trichYeu: 'Quyết định công nhận tốt nghiệp cho sinh viên khóa 2021 đợt 1',
          luotTraCuu: 2,
        },
        {
          id: '3',
          soQuyetDinh: 'QĐ-54321/2023',
          ngayBanHanh: new Date('2023-09-10'),
          trichYeu: 'Quyết định công nhận tốt nghiệp cho sinh viên khóa 2021 đợt 2',
          luotTraCuu: 5,
        },
      ];
      
      setDanhSachQuyetDinh(mockQuyetDinh);
      updateThongKeTraCuu(mockQuyetDinh);
      setLoading(false);
    }, 1000);
  };

  // Hàm cập nhật thống kê tra cứu
  const updateThongKeTraCuu = (quyetDinhs: QuyetDinhTotNghiep[]) => {
    const thongKe = quyetDinhs.map(qd => ({
      quyetDinh: qd.soQuyetDinh,
      luotTraCuu: qd.luotTraCuu,
    }));
    
    setThongKeTraCuu(thongKe);
  };

  return {
    ketQuaTraCuu,
    setKetQuaTraCuu,
    vanBangSelected,
    setVanBangSelected,
    loading,
    setLoading,
    danhSachQuyetDinh,
    setDanhSachQuyetDinh,
    visibleDetail,
    setVisibleDetail,
    thongKeTraCuu,
    hasSearched,
    setHasSearched,
    traCuuVanBang,
    xemChiTietVanBang,
    resetTraCuu,
    loadQuyetDinhTotNghiep,
  };
} 