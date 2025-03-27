import { useState, useEffect } from 'react';
import { message } from 'antd';
import ThongTinVanBangService from '@/services/ThongTinVanBang';
import { VanBangRecord, TruongThongTinItem, ApiResponse } from '@/services/ThongTinVanBang/typing';

// Interface cho giá trị trường thông tin phụ lục
export interface GiaTriTruongThongTin {
  id?: number;
  truongThongTinId: number;
  tenTruong: string;
  kieuDuLieu: 'String' | 'Number' | 'Date';
  giaTri: any;
}

// Định nghĩa kiểu dữ liệu cho Thông tin Văn Bằng
export interface ThongTinVanBang {
  id: number;
  soVaoSo: number;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  ngaySinh: Date;
  quyetDinhId: number;
  soVanBangId: number;
  soQuyetDinh?: string; 
  namSo?: number;
  truongThongTin: Record<string, GiaTriTruongThongTin>;
}


// Hook quản lý state và logic
export function useInitModel() {
  const [danhSachVanBang, setDanhSachVanBang] = useState<ThongTinVanBang[]>([]);
  const [vanBangSelected, setVanBangSelected] = useState<ThongTinVanBang | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  
  // Danh sách trường thông tin
  const [danhSachTruongThongTin, setDanhSachTruongThongTin] = useState<TruongThongTinItem[]>([]);
  
  // Chứa số mới nhất cho số vào sổ
  const [soVaoSoMoi, setSoVaoSoMoi] = useState<number>(1);

  // Parse giá trị từ string sang kiểu dữ liệu tương ứng
  const parseGiaTri = (giaTri: string, kieuDuLieu: string): any => {
    if (kieuDuLieu === 'Number') {
      return parseFloat(giaTri);
    } else if (kieuDuLieu === 'Date') {
      return new Date(giaTri);
    } else {
      return giaTri;
    }
  };

  // Format giá trị sang string để gửi API
  const formatGiaTri = (giaTri: any, kieuDuLieu: string): string => {
    if (kieuDuLieu === 'Number') {
      return giaTri.toString();
    } else if (kieuDuLieu === 'Date') {
      return giaTri instanceof Date 
        ? giaTri.toISOString() 
        : new Date(giaTri).toISOString();
    } else {
      return giaTri.toString();
    }
  };

  // Chuyển đổi trường động từ API sang frontend
  const convertTruongDongToFrontend = (truongDong: Record<string, any> = {}): Record<string, GiaTriTruongThongTin> => {
    const result: Record<string, GiaTriTruongThongTin> = {};
    
    Object.entries(truongDong || {}).forEach(([key, value]) => {
      result[key] = {
        id: value.id,
        truongThongTinId: value.truong_id,
        tenTruong: key,
        kieuDuLieu: value.kieu_du_lieu as 'String' | 'Number' | 'Date',
        giaTri: parseGiaTri(value.gia_tri, value.kieu_du_lieu)
      };
    });
    
    return result;
  };

  // Chuyển đổi trường động từ frontend sang API
  const convertTruongDongToApi = (truongThongTin: Record<string, GiaTriTruongThongTin> = {}): Record<string, string> => {
    const result: Record<string, string> = {};
    
    Object.values(truongThongTin).forEach(truong => {
      result[truong.truongThongTinId.toString()] = formatGiaTri(truong.giaTri, truong.kieuDuLieu);
    });
    
    return result;
  };

  // Lấy danh sách văn bằng
  const fetchDanhSachVanBang = async () => {
    setLoading(true);
    try {
      const response = await ThongTinVanBangService.getList();
      
      if (response.data.success) {
        // Chuyển đổi dữ liệu từ format API sang format frontend
        const formattedData = response.data.data.map((item: VanBangRecord) => ({
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
          truongThongTin: convertTruongDongToFrontend(item.truong_dong)
        }));
        
        setDanhSachVanBang(formattedData);
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

  // Lấy chi tiết văn bằng
  const fetchChiTietVanBang = async (id: number) => {
    setLoading(true);
    try {
      const response = await ThongTinVanBangService.getById(id);
      
      if (response.data.success) {
        const item = response.data.data;
        const formattedVanBang = {
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
          truongThongTin: convertTruongDongToFrontend(item.truong_dong)
        };
        
        setVanBangSelected(formattedVanBang);
        return formattedVanBang;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tải chi tiết văn bằng');
        return null;
      }
    } catch (error) {
      message.error('Không thể kết nối đến server');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm văn bằng mới
  const themVanBang = async (values: Omit<ThongTinVanBang, 'id' | 'soVaoSo'>) => {
    setLoading(true);
    try {
      // Tách trường thông tin động khỏi dữ liệu chính
      const { truongThongTin, ...vanBangData } = values;
      
      // Chuyển đổi từ format frontend sang format API
      const vanBangPayload = {
        so_hieu_van_bang: vanBangData.soHieuVanBang,
        ma_sinh_vien: vanBangData.maSinhVien,
        ho_ten: vanBangData.hoTen,
        ngay_sinh: vanBangData.ngaySinh.toISOString(),
        quyet_dinh_id: vanBangData.quyetDinhId,
        so_van_bang_id: vanBangData.soVanBangId
      };
      
      // Chuyển đổi trường động
      const truongDongPayload = convertTruongDongToApi(truongThongTin);
      
      const response = await ThongTinVanBangService.create(vanBangPayload as any, truongDongPayload);
      
      if (response.data.success) {
        message.success('Đã thêm thông tin văn bằng mới thành công');
        await fetchDanhSachVanBang(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi thêm thông tin văn bằng');
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

  // Hàm cập nhật văn bằng
  const capNhatVanBang = async (values: ThongTinVanBang) => {
    setLoading(true);
    try {
      // Tách trường thông tin động khỏi dữ liệu chính
      const { truongThongTin, ...vanBangData } = values;
      
      // Chuyển đổi từ format frontend sang format API
      const vanBangPayload = {
        so_hieu_van_bang: vanBangData.soHieuVanBang,
        ma_sinh_vien: vanBangData.maSinhVien,
        ho_ten: vanBangData.hoTen,
        ngay_sinh: vanBangData.ngaySinh.toISOString(),
        quyet_dinh_id: vanBangData.quyetDinhId
      };
      
      // Chuyển đổi trường động
      const truongDongPayload = convertTruongDongToApi(truongThongTin);
      
      const response = await ThongTinVanBangService.update(values.id, vanBangPayload, truongDongPayload);
      
      if (response.data.success) {
        message.success('Đã cập nhật thông tin văn bằng thành công');
        await fetchDanhSachVanBang(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi cập nhật thông tin văn bằng');
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

  // Hàm thêm trường động vào văn bằng đã chọn
  const themTruongDong = async (truongThongTinId: number, giaTri: any) => {
    if (!vanBangSelected) {
      message.error('Chưa chọn văn bằng');
      return false;
    }
    
    // Tìm thông tin trường thông tin
    const truongThongTin = danhSachTruongThongTin.find(t => t.id === truongThongTinId);
    if (!truongThongTin) {
      message.error('Không tìm thấy thông tin trường');
      return false;
    }
    
    // Kiểm tra xem trường đã tồn tại chưa
    if (vanBangSelected.truongThongTin[truongThongTin.ten_truong]) {
      message.error(`Trường thông tin '${truongThongTin.ten_truong}' đã tồn tại`);
      return false;
    }
    
    // Tạo bản sao văn bằng và thêm trường mới
    const updatedTruongThongTin = { ...vanBangSelected.truongThongTin };
    updatedTruongThongTin[truongThongTin.ten_truong] = {
      truongThongTinId,
      tenTruong: truongThongTin.ten_truong,
      kieuDuLieu: truongThongTin.kieu_du_lieu as 'String' | 'Number' | 'Date',
      giaTri
    };
    
    const updatedVanBang = {
      ...vanBangSelected,
      truongThongTin: updatedTruongThongTin
    };
    
    // Cập nhật văn bằng với trường mới
    const result = await capNhatVanBang(updatedVanBang);
    if (result) {
      // Cập nhật state local nếu API thành công
      setVanBangSelected(updatedVanBang);
    }
    
    return result;
  };

  // Hàm cập nhật giá trị trường động
  const capNhatTruongDong = async (tenTruong: string, giaTri: any) => {
    if (!vanBangSelected) {
      message.error('Chưa chọn văn bằng');
      return false;
    }
    
    // Kiểm tra xem trường có tồn tại không
    if (!vanBangSelected.truongThongTin[tenTruong]) {
      message.error(`Không tìm thấy trường '${tenTruong}'`);
      return false;
    }
    
    // Tạo bản sao văn bằng và cập nhật giá trị
    const updatedTruongThongTin = { ...vanBangSelected.truongThongTin };
    updatedTruongThongTin[tenTruong] = {
      ...updatedTruongThongTin[tenTruong],
      giaTri
    };
    
    const updatedVanBang = {
      ...vanBangSelected,
      truongThongTin: updatedTruongThongTin
    };
    
    // Cập nhật văn bằng với giá trị mới
    const result = await capNhatVanBang(updatedVanBang);
    if (result) {
      // Cập nhật state local nếu API thành công
      setVanBangSelected(updatedVanBang);
    }
    
    return result;
  };

  // Hàm xóa trường động
  const xoaTruongDong = async (tenTruong: string) => {
    if (!vanBangSelected) {
      message.error('Chưa chọn văn bằng');
      return false;
    }
    
    // Kiểm tra xem trường có tồn tại không
    if (!vanBangSelected.truongThongTin[tenTruong]) {
      message.error(`Không tìm thấy trường '${tenTruong}'`);
      return false;
    }
    
    // Tạo bản sao văn bằng và xóa trường
    const updatedTruongThongTin = { ...vanBangSelected.truongThongTin };
    delete updatedTruongThongTin[tenTruong];
    
    const updatedVanBang = {
      ...vanBangSelected,
      truongThongTin: updatedTruongThongTin
    };
    
    // Cập nhật văn bằng sau khi xóa trường
    const result = await capNhatVanBang(updatedVanBang);
    if (result) {
      // Cập nhật state local nếu API thành công
      setVanBangSelected(updatedVanBang);
    }
    
    return result;
  };

  // Hàm xóa văn bằng
  const xoaVanBang = async (id: number) => {
    setLoading(true);
    try {
      const response = await ThongTinVanBangService.delete(id);
      
      if (response.data.success) {
        message.success('Đã xóa thông tin văn bằng thành công');
        await fetchDanhSachVanBang(); // Refresh danh sách
        return true;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi xóa thông tin văn bằng');
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

  // Hàm tìm kiếm văn bằng
  const timKiemVanBang = async (params: {
    soHieuVanBang?: string;
    soVaoSo?: number;
    maSinhVien?: string;
    hoTen?: string;
    ngaySinh?: Date;
  }) => {
    setLoading(true);
    try {
      // Chuyển đổi params từ format frontend sang format API
      const searchParams: any = {};
      
      if (params.soHieuVanBang) searchParams.so_hieu_van_bang = params.soHieuVanBang;
      if (params.soVaoSo) searchParams.so_vao_so = params.soVaoSo;
      if (params.maSinhVien) searchParams.ma_sinh_vien = params.maSinhVien;
      if (params.hoTen) searchParams.ho_ten = params.hoTen;
      if (params.ngaySinh) searchParams.ngay_sinh = params.ngaySinh.toISOString().split('T')[0];
      
      const response = await ThongTinVanBangService.search(searchParams);
      
      if (response.data.success) {
        // Chuyển đổi dữ liệu từ format API sang format frontend
        const formattedData = response.data.data.map((item: VanBangRecord) => ({
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
          truongThongTin: convertTruongDongToFrontend(item.truong_dong)
        }));
        
        return formattedData;
      } else {
        message.error(response.data.message || 'Có lỗi xảy ra khi tìm kiếm');
        return [];
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Không thể kết nối đến server');
      }
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách trường thông tin có thể thêm vào văn bằng
  const getTruongThongTinKhaDung = (): TruongThongTinItem[] => {
    if (!vanBangSelected || !danhSachTruongThongTin.length) {
      return danhSachTruongThongTin;
    }
    
    // Các trường đã có trong văn bằng
    const existingFields = Object.values(vanBangSelected.truongThongTin).map(
      field => field.truongThongTinId
    );
    
    // Lọc các trường chưa được thêm
    return danhSachTruongThongTin.filter(
      field => !existingFields.includes(field.id)
    );
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchDanhSachVanBang();
  }, []);

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
    danhSachTruongThongTin,
    soVaoSoMoi,
    setSoVaoSoMoi,
    fetchDanhSachVanBang,
    fetchChiTietVanBang,
    themVanBang,
    capNhatVanBang,
    xoaVanBang,
    timKiemVanBang,
    themTruongDong,
    capNhatTruongDong,
    xoaTruongDong,
    getTruongThongTinKhaDung,
    parseGiaTri,
    formatGiaTri,
  };
} 