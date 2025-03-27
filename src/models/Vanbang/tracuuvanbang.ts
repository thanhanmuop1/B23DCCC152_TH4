import { useState } from 'react';
import { message } from 'antd';
import { GiaTriTruongThongTin } from './thongtinvanbang';

// Định nghĩa kiểu dữ liệu cho Tra cứu Văn Bằng
export interface TraCuuVanBang {
  id: string;
  soHieuVanBang: string;
  soVaoSo: number;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: Date;
  quyetDinhId: string;
  tenQuyetDinh?: string;
  luotTraCuu: number;
  truongThongTin: GiaTriTruongThongTin[];
}

// Kiểu dữ liệu cho Quyết định tốt nghiệp (để hiển thị)
export interface QuyetDinhTotNghiep {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: Date;
  trichYeu: string;
  luotTraCuu: number; // Số lượt tra cứu theo quyết định
}

// Kiểu dữ liệu cho tham số tìm kiếm
export interface TraCuuParams {
  soHieuVanBang?: string;
  soVaoSo?: number;
  maSinhVien?: string;
  hoTen?: string;
  ngaySinh?: Date;
}

// Hook quản lý state và logic
export function useInitModel<T extends TraCuuVanBang>() {
  const [ketQuaTraCuu, setKetQuaTraCuu] = useState<T[]>([]);
  const [vanBangSelected, setVanBangSelected] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<QuyetDinhTotNghiep[]>([]);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [thongKeTraCuu, setThongKeTraCuu] = useState<{ quyetDinh: string; luotTraCuu: number }[]>([]);

  // Hàm tìm kiếm văn bằng
  const traCuuVanBang = (params: TraCuuParams) => {
    setLoading(true);
    try {
      // Đếm số tham số tìm kiếm có giá trị
      const paramCount = Object.values(params).filter(value => 
        value !== undefined && value !== '' && value !== null
      ).length;
      
      // Kiểm tra nếu có ít nhất 2 tham số
      if (paramCount < 2) {
        message.error('Vui lòng nhập ít nhất 2 tham số để tra cứu');
        setKetQuaTraCuu([]);
        return false;
      }
      
      // Giả lập API call để tìm kiếm
      setTimeout(() => {
        // Trong thực tế, đây sẽ là API call đến backend
        const mockData: TraCuuVanBang[] = [
          {
            id: '1',
            soVaoSo: 1,
            soHieuVanBang: 'VB-12345/2023',
            maSinhVien: 'SV001',
            hoTen: 'Nguyễn Văn A',
            ngaySinh: new Date('2000-05-15'),
            quyetDinhId: '1',
            tenQuyetDinh: 'QĐ-12345/2023',
            luotTraCuu: 5,
            truongThongTin: [
              {
                truongThongTinId: '1',
                tenTruong: 'Điểm trung bình',
                kieuDuLieu: 'Number',
                giaTri: 8.5,
              },
              {
                truongThongTinId: '2',
                tenTruong: 'Xếp loại',
                kieuDuLieu: 'String',
                giaTri: 'Giỏi',
              },
              {
                truongThongTinId: '3',
                tenTruong: 'Nơi sinh',
                kieuDuLieu: 'String',
                giaTri: 'Hà Nội',
              },
              {
                truongThongTinId: '4',
                tenTruong: 'Ngày cấp',
                kieuDuLieu: 'Date',
                giaTri: new Date('2023-06-30'),
              },
            ],
          },
          {
            id: '2',
            soVaoSo: 2,
            soHieuVanBang: 'VB-12346/2023',
            maSinhVien: 'SV002',
            hoTen: 'Trần Thị B',
            ngaySinh: new Date('2001-03-20'),
            quyetDinhId: '1',
            tenQuyetDinh: 'QĐ-12345/2023',
            luotTraCuu: 3,
            truongThongTin: [
              {
                truongThongTinId: '1',
                tenTruong: 'Điểm trung bình',
                kieuDuLieu: 'Number',
                giaTri: 7.8,
              },
              {
                truongThongTinId: '2',
                tenTruong: 'Xếp loại',
                kieuDuLieu: 'String',
                giaTri: 'Khá',
              },
              {
                truongThongTinId: '3',
                tenTruong: 'Nơi sinh',
                kieuDuLieu: 'String',
                giaTri: 'TP.HCM',
              },
              {
                truongThongTinId: '4',
                tenTruong: 'Ngày cấp',
                kieuDuLieu: 'Date',
                giaTri: new Date('2023-06-30'),
              },
            ],
          },
          {
            id: '3',
            soVaoSo: 3,
            soHieuVanBang: 'VB-12347/2023',
            maSinhVien: 'SV003',
            hoTen: 'Lê Văn C',
            ngaySinh: new Date('1999-11-10'),
            quyetDinhId: '2',
            tenQuyetDinh: 'QĐ-67890/2023',
            luotTraCuu: 2,
            truongThongTin: [
              {
                truongThongTinId: '1',
                tenTruong: 'Điểm trung bình',
                kieuDuLieu: 'Number',
                giaTri: 9.2,
              },
              {
                truongThongTinId: '2',
                tenTruong: 'Xếp loại',
                kieuDuLieu: 'String',
                giaTri: 'Xuất sắc',
              },
              {
                truongThongTinId: '3',
                tenTruong: 'Nơi sinh',
                kieuDuLieu: 'String',
                giaTri: 'Đà Nẵng',
              },
              {
                truongThongTinId: '4',
                tenTruong: 'Ngày cấp',
                kieuDuLieu: 'Date',
                giaTri: new Date('2023-08-15'),
              },
            ],
          },
        ];
        
        // Lọc dữ liệu dựa trên tham số tìm kiếm
        const result = mockData.filter(item => {
          let match = true;
          
          if (params.soHieuVanBang) {
            match = match && item.soHieuVanBang.toLowerCase().includes(params.soHieuVanBang.toLowerCase());
          }
          
          if (params.soVaoSo) {
            match = match && item.soVaoSo === params.soVaoSo;
          }
          
          if (params.maSinhVien) {
            match = match && item.maSinhVien.toLowerCase().includes(params.maSinhVien.toLowerCase());
          }
          
          if (params.hoTen) {
            match = match && item.hoTen.toLowerCase().includes(params.hoTen.toLowerCase());
          }
          
          if (params.ngaySinh) {
            const paramDate = new Date(params.ngaySinh);
            const itemDate = new Date(item.ngaySinh);
            
            match = match && paramDate.getDate() === itemDate.getDate() && 
                    paramDate.getMonth() === itemDate.getMonth() && 
                    paramDate.getFullYear() === itemDate.getFullYear();
          }
          
          return match;
        });
        
        setKetQuaTraCuu(result as T[]);
        setLoading(false);
        
        if (result.length > 0) {
          message.success(`Đã tìm thấy ${result.length} kết quả`);
          return true;
        } else {
          message.info('Không tìm thấy kết quả phù hợp');
          return false;
        }
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Lỗi khi tra cứu:', error);
      message.error('Có lỗi xảy ra khi tra cứu văn bằng');
      setKetQuaTraCuu([]);
      setLoading(false);
      return false;
    }
  };

  // Hàm xem chi tiết văn bằng và ghi nhận lượt tra cứu
  const xemChiTietVanBang = (vanBang: T) => {
    setVanBangSelected(vanBang);
    setVisibleDetail(true);
    
    // Ghi nhận lượt tra cứu và cập nhật thống kê
    ghiNhanLuotTraCuu(vanBang);
  };

  // Hàm ghi nhận lượt tra cứu
  const ghiNhanLuotTraCuu = (vanBang: T) => {
    // Tăng lượt tra cứu cho văn bằng 
    const updatedVanBang = {
      ...vanBang,
      luotTraCuu: vanBang.luotTraCuu + 1,
    };

    // Cập nhật danh sách kết quả tra cứu
    setKetQuaTraCuu(prev => 
      prev.map(item => (item.id === updatedVanBang.id ? updatedVanBang as T : item))
    );

    // Tìm quyết định để cập nhật lượt tra cứu
    const quyetDinhIndex = danhSachQuyetDinh.findIndex(qd => qd.id === vanBang.quyetDinhId);
    
    if (quyetDinhIndex !== -1) {
      // Tạo bản sao của danh sách
      const updatedDanhSachQuyetDinh = [...danhSachQuyetDinh];
      
      // Cập nhật lượt tra cứu cho quyết định
      updatedDanhSachQuyetDinh[quyetDinhIndex] = {
        ...updatedDanhSachQuyetDinh[quyetDinhIndex],
        luotTraCuu: updatedDanhSachQuyetDinh[quyetDinhIndex].luotTraCuu + 1,
      };
      
      setDanhSachQuyetDinh(updatedDanhSachQuyetDinh);
      
      // Cập nhật dữ liệu thống kê
      updateThongKeTraCuu(updatedDanhSachQuyetDinh);
    }
  };

  // Hàm cập nhật thống kê tra cứu
  const updateThongKeTraCuu = (quyetDinhs: QuyetDinhTotNghiep[]) => {
    const thongKe = quyetDinhs.map(qd => ({
      quyetDinh: qd.soQuyetDinh,
      luotTraCuu: qd.luotTraCuu,
    }));
    
    setThongKeTraCuu(thongKe);
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
    traCuuVanBang,
    xemChiTietVanBang,
    loadQuyetDinhTotNghiep,
  };
} 