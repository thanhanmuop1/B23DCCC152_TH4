import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { message, Form } from 'antd';
import { useInitModel, ThongTinVanBang } from '@/models/Vanbang/thongtinvanbang';
import { useInitModel as useInitModelQuyetDinh } from '@/models/Vanbang/quyetdinhtotnghiep'; 
import { useInitModel as useInitModelSoVanBang } from '@/models/Vanbang/sovanbang';
import { useInitModel as useInitModelTruongThongTin } from '@/models/Vanbang/truongthongtin';
import SearchToolbar from './components/SearchToolbar';
import VanBangList from './components/VanBangList';
import VanBangModal from './components/VanBangModal';
import VanBangDetail from './components/VanBangDetail';
import AdvancedSearchDrawer from './components/AdvancedSearchDrawer';
import 'moment/locale/vi';
import moment from 'moment';

moment.locale('vi');

const ThongTinVanBangPage: React.FC = () => {
  const vanBangModel = useInitModel();
  const quyetDinhModel = useInitModelQuyetDinh();
  const soVanBangModel = useInitModelSoVanBang();
  const truongThongTinModel = useInitModelTruongThongTin();

  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleSearchForm, setVisibleSearchForm] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchForm] = Form.useForm();

  // Lấy dữ liệu khi component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          vanBangModel.fetchDanhSachVanBang(),
          quyetDinhModel.fetchDanhSachQuyetDinh(),
          soVanBangModel.fetchDanhSachSoVanBang(),
          truongThongTinModel.fetchDanhSachTruongThongTin()
        ]);
      } catch (error) {
        message.error('Không thể tải dữ liệu ban đầu');
        console.error(error);
      }
    };

    fetchInitialData();
  }, []);

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    vanBangModel.setVanBangSelected(null);
    vanBangModel.setModalType('add');
    vanBangModel.setVisibleModal(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (record: ThongTinVanBang) => {
    vanBangModel.setVanBangSelected(record);
    vanBangModel.setModalType('edit');
    vanBangModel.setVisibleModal(true);
  };

  // Xử lý submit form modal
  const handleSubmitModal = (values: any) => {
    if (vanBangModel.modalType === 'add') {
      vanBangModel.themVanBang(values);
    } else {
      vanBangModel.capNhatVanBang(values as ThongTinVanBang);
    }
    vanBangModel.setVisibleModal(false);
  };

  // Mở drawer xem chi tiết
  const handleViewDetail = (record: ThongTinVanBang) => {
    vanBangModel.setVanBangSelected(record);
    setVisibleDetail(true);
  };

  // Xử lý tìm kiếm nâng cao
  const handleAdvancedSearch = () => {
    setVisibleSearchForm(true);
  };

  // Xử lý submit form tìm kiếm nâng cao
  const handleSubmitSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      
      // Chuyển đổi ngày thành Date object
      const searchParams = {
        ...values,
        ngaySinh: values.ngaySinh ? values.ngaySinh.toDate() : undefined,
      };
      
      await vanBangModel.timKiemVanBang(searchParams);
      setVisibleSearchForm(false);
    } catch (error) {
      console.error('Lỗi khi xác thực form tìm kiếm:', error);
    }
  };

  // Reset form tìm kiếm nâng cao
  const handleResetSearch = () => {
    searchForm.resetFields();
    vanBangModel.fetchDanhSachVanBang();
  };

  // Xử lý tìm kiếm nhanh
  const handleSimpleSearch = (value: string) => {
    setSearchKeyword(value);
    
    if (!value.trim()) {
      vanBangModel.fetchDanhSachVanBang();
      return;
    }

    const keyword = value.toLowerCase().trim();
    const filteredData = vanBangModel.danhSachVanBang.filter(item => 
      item.soHieuVanBang.toLowerCase().includes(keyword) ||
      item.maSinhVien.toLowerCase().includes(keyword) ||
      item.hoTen.toLowerCase().includes(keyword) ||
      item.soVaoSo.toString().includes(keyword)
    );
    
    vanBangModel.setDanhSachVanBang(filteredData);
  };

  // Xử lý reset tìm kiếm nhanh
  const handleResetSimpleSearch = () => {
    setSearchKeyword('');
    vanBangModel.fetchDanhSachVanBang();
  };

  return (
    <PageContainer title="Quản lý thông tin văn bằng">
      <SearchToolbar
        searchKeyword={searchKeyword}
        onSearch={handleSimpleSearch}
        onResetSearch={handleResetSimpleSearch}
        onAdvancedSearch={handleAdvancedSearch}
        resultCount={vanBangModel.danhSachVanBang.length}
      />

      <VanBangList
        danhSachVanBang={vanBangModel.danhSachVanBang}
        loading={vanBangModel.loading}
        onView={handleViewDetail}
        onEdit={handleOpenEditModal}
        onDelete={vanBangModel.xoaVanBang}
        onAdd={handleOpenAddModal}
      />

      <VanBangModal
        open={vanBangModel.visibleModal}
        type={vanBangModel.modalType}
        vanBangSelected={vanBangModel.vanBangSelected}
        danhSachQuyetDinh={quyetDinhModel.danhSachQuyetDinh}
        danhSachTruongThongTin={truongThongTinModel.danhSachTruongThongTin}
        danhSachSoVanBang={soVanBangModel.danhSachSoVanBang}
        soVaoSoMoi={vanBangModel.soVaoSoMoi}
        onCancel={() => vanBangModel.setVisibleModal(false)}
        onSubmit={handleSubmitModal}
      />

      <VanBangDetail
        visible={visibleDetail}
        vanBang={vanBangModel.vanBangSelected}
        danhSachQuyetDinh={quyetDinhModel.danhSachQuyetDinh}
        onClose={() => setVisibleDetail(false)}
      />

      <AdvancedSearchDrawer
        visible={visibleSearchForm}
        form={searchForm}
        onSearch={handleSubmitSearch}
        onReset={handleResetSearch}
        onClose={() => setVisibleSearchForm(false)}
      />
    </PageContainer>
  );
};

export default ThongTinVanBangPage; 