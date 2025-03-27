import { useCallback, useState } from 'react';
import { message } from 'antd';
import { v4 as uuidv4 } from 'uuid';

// Định nghĩa interface cho quyết định tốt nghiệp
export interface QuyetDinhTotNghiep {
  id: string;
  soQuyetDinh: string;
  ngayBanHanh: Date;
  trichYeu: string;
  soVanBangId: string;
}

// Định nghĩa interface cho sổ văn bằng để sử dụng trong dropdown
export interface SoVanBang {
  id: string;
  ten: string;
}

// Hook để quản lý state của quyết định tốt nghiệp
export function useInitModel<T extends QuyetDinhTotNghiep>() {
  const [danhSachQuyetDinh, setDanhSachQuyetDinh] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [quyetDinhSelected, setQuyetDinhSelected] = useState<T | null>(null);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  // Mock data cho sổ văn bằng
  const [danhSachSoVanBang] = useState<SoVanBang[]>([
    { id: '1', ten: 'Sổ văn bằng khóa 2020' },
    { id: '2', ten: 'Sổ văn bằng khóa 2021' },
    { id: '3', ten: 'Sổ văn bằng khóa 2022' },
  ]);

  // Hàm thêm quyết định mới
  const themQuyetDinh = useCallback((quyetDinh: Omit<T, 'id'>) => {
    const newQuyetDinh = {
      ...quyetDinh,
      id: uuidv4(),
    } as T;
    
    setDanhSachQuyetDinh((prev) => [...prev, newQuyetDinh]);
    message.success('Thêm quyết định thành công');
    return true;
  }, []);

  // Hàm cập nhật quyết định
  const capNhatQuyetDinh = useCallback((quyetDinh: T) => {
    setDanhSachQuyetDinh((prev) => 
      prev.map((item) => (item.id === quyetDinh.id ? quyetDinh : item))
    );
    message.success('Cập nhật quyết định thành công');
    return true;
  }, []);

  // Hàm xóa quyết định
  const xoaQuyetDinh = useCallback((id: string) => {
    setDanhSachQuyetDinh((prev) => prev.filter((item) => item.id !== id));
    message.success('Xóa quyết định thành công');
    return true;
  }, []);

  // Hàm tìm kiếm quyết định theo số quyết định
  const timKiemQuyetDinh = useCallback((soQuyetDinh: string) => {
    setSearching(true);
    // Giả lập delay khi tìm kiếm
    setTimeout(() => {
      if (!soQuyetDinh.trim()) {
        setDanhSachQuyetDinh([]);
      } else {
        const ketQuaTimKiem = danhSachQuyetDinh.filter((item) =>
          item.soQuyetDinh.toLowerCase().includes(soQuyetDinh.toLowerCase())
        );
        setDanhSachQuyetDinh(ketQuaTimKiem);
      }
      setSearching(false);
    }, 500);
  }, [danhSachQuyetDinh]);

  return {
    danhSachQuyetDinh,
    setDanhSachQuyetDinh,
    loading,
    setLoading,
    searching,
    quyetDinhSelected,
    setQuyetDinhSelected,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    danhSachSoVanBang,
    themQuyetDinh,
    capNhatQuyetDinh,
    xoaQuyetDinh,
    timKiemQuyetDinh,
  };
} 