import { useState } from 'react';
import { message } from 'antd';

// Interface cho giá trị trường thông tin phụ lục
export interface GiaTriTruongThongTin {
  truongThongTinId: string;
  tenTruong: string;
  kieuDuLieu: 'String' | 'Number' | 'Date';
  giaTri: any;
}

// Định nghĩa kiểu dữ liệu cho Thông tin Văn Bằng
export interface ThongTinVanBang {
  id: string;
  soVaoSo: number;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: Date;
  quyetDinhId: string;
  tenQuyetDinh?: string; // Thêm trường tên Quyết định để hiển thị
  truongThongTin: GiaTriTruongThongTin[];
}

// Kiểu dữ liệu cho Quyết định tốt nghiệp (để select)
export interface QuyetDinhTotNghiep {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: Date;
  trichYeu: string;
}

// Hook quản lý state và logic
export function useInitModel<T extends ThongTinVanBang>() {
  const [danhSachVanBang, setDanhSachVanBang] = useState<T[]>([]);
  const [vanBangSelected, setVanBangSelected] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  
  // Danh sách quyết định để chọn
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinhTotNghiep[]>([]);
  
  // Chứa số mới nhất cho số vào sổ
  const [soVaoSoMoi, setSoVaoSoMoi] = useState<number>(1);

  // Hàm thêm văn bằng mới
  const themVanBang = (values: Omit<T, 'id' | 'soVaoSo'>) => {
    setLoading(true);
    try {
      const newItem = {
        ...values,
        id: Math.floor(Math.random() * 10000).toString(), // Giả lập ID
        soVaoSo: soVaoSoMoi, // Dùng số vào sổ mới nhất
      } as T;

      // Tăng số vào sổ lên 1 cho lần tiếp theo
      setSoVaoSoMoi(soVaoSoMoi + 1);

      // Thêm vào danh sách
      setDanhSachVanBang(prev => [...prev, newItem]);
      message.success('Đã thêm thông tin văn bằng mới thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm thông tin văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật văn bằng
  const capNhatVanBang = (values: T) => {
    setLoading(true);
    try {
      setDanhSachVanBang(prev =>
        prev.map(item => (item.id === values.id ? values : item))
      );
      message.success('Đã cập nhật thông tin văn bằng thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa văn bằng
  const xoaVanBang = (id: string) => {
    setLoading(true);
    try {
      // Kiểm tra nếu văn bằng đã được tra cứu/sử dụng (giả lập)
      const daDuocTraCuu = false; // Trong thực tế, cần kiểm tra từ backend
      
      if (daDuocTraCuu) {
        message.error('Không thể xóa thông tin văn bằng này vì đã được tra cứu hoặc sử dụng');
        return;
      }

      setDanhSachVanBang(prev => prev.filter(item => item.id !== id));
      message.success('Đã xóa thông tin văn bằng thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa thông tin văn bằng');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm tìm kiếm văn bằng
  const timKiemVanBang = (params: {
    soHieuVanBang?: string;
    soVaoSo?: number;
    maSinhVien?: string;
    hoTen?: string;
    ngaySinh?: Date;
  }) => {
    setLoading(true);
    try {
      // Đếm số tham số tìm kiếm có giá trị
      const paramCount = Object.values(params).filter(value => 
        value !== undefined && value !== '' && value !== null
      ).length;
      
      // Kiểm tra nếu có ít nhất 2 tham số
      if (paramCount < 2) {
        message.error('Vui lòng nhập ít nhất 2 tham số để tìm kiếm');
        return danhSachVanBang;
      }
      
      // Lọc theo các tiêu chí
      const result = danhSachVanBang.filter(vb => {
        let match = true;
        
        if (params.soHieuVanBang && params.soHieuVanBang.trim() !== '') {
          match = match && vb.soHieuVanBang.toLowerCase().includes(params.soHieuVanBang.toLowerCase());
        }
        
        if (params.soVaoSo) {
          match = match && vb.soVaoSo === params.soVaoSo;
        }
        
        if (params.maSinhVien && params.maSinhVien.trim() !== '') {
          match = match && vb.maSinhVien.toLowerCase().includes(params.maSinhVien.toLowerCase());
        }
        
        if (params.hoTen && params.hoTen.trim() !== '') {
          match = match && vb.hoTen.toLowerCase().includes(params.hoTen.toLowerCase());
        }
        
        if (params.ngaySinh) {
          const paramDate = new Date(params.ngaySinh);
          const vbDate = new Date(vb.ngaySinh);
          
          match = match && paramDate.getDate() === vbDate.getDate() && 
                  paramDate.getMonth() === vbDate.getMonth() && 
                  paramDate.getFullYear() === vbDate.getFullYear();
        }
        
        return match;
      });

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
    danhSachVanBang,
    setDanhSachVanBang,
    vanBangSelected,
    setVanBangSelected,
    loading,
    setLoading,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    danhSachQuyetDinh,
    setDanhSachQuyetDinh,
    soVaoSoMoi,
    setSoVaoSoMoi,
    themVanBang,
    capNhatVanBang,
    xoaVanBang,
    timKiemVanBang,
  };
} 