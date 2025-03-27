import React, { useState, useEffect } from 'react';
import { 
  PageContainer, 
  ProTable,
} from '@ant-design/pro-components';
import { Button, Input, Space, Popconfirm, message, Drawer, Badge } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useInitModel, TruongThongTin } from '../../../models/Vanbang/truongthongtin';
import TruongThongTinModal from './components/TruongThongTinModal';
import TruongThongTinDetail from './components/TruongThongTinDetail';
import TruongThongTinService from '@/services/TruongThongTin';

const TruongThongTinPage: React.FC = () => {
  const {
    danhSachTruongThongTin,
    setDanhSachTruongThongTin,
    loading,
    setLoading,
    truongThongTinSelected,
    setTruongThongTinSelected,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    themTruongThongTin,
    capNhatTruongThongTin,
    xoaTruongThongTin,
    fetchDanhSachTruongThongTin,
  } = useInitModel<TruongThongTin>();

  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // Lấy dữ liệu từ API khi component mount
  useEffect(() => {
    fetchDanhSachTruongThongTin();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = async (value: string) => {
    setSearchValue(value);
    setLoading(true);
    
    try {
      if (value.trim() === '') {
        // Nếu không có giá trị tìm kiếm, lấy lại toàn bộ danh sách
        await fetchDanhSachTruongThongTin();
      } else {
        // Gọi API tìm kiếm
        const response = await TruongThongTinService.getList();
        console.log(response);
        if (response.data.success) {
          // Lọc dữ liệu trả về theo tên trường
          const filteredData = response.data.data.filter((item: any) => 
            item.ten_truong.toLowerCase().includes(value.toLowerCase())
          );
          
          // Chuẩn hóa dữ liệu để phù hợp với interface TruongThongTin
          const formattedData = filteredData.map((item: any) => ({
            id: item.id,
            ten_truong: item.ten_truong,
            kieu_du_lieu: item.kieu_du_lieu,
            batBuoc: false // Giả định, có thể cập nhật nếu API trả về trường này
          }));
          
          setDanhSachTruongThongTin(formattedData);
        }
      }
    } catch (error) {
      message.error('Lỗi khi tìm kiếm dữ liệu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setTruongThongTinSelected(null);
    setModalType('add');
    setVisibleModal(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (record: TruongThongTin) => {
    setTruongThongTinSelected(record);
    setModalType('edit');
    setVisibleModal(true);
  };

  // Xử lý submit form modal
  const handleSubmitModal = async (values: any) => {
    try {
      if (modalType === 'add') {
        // Chuyển đổi dữ liệu để phù hợp với API
        const dataToSubmit = {
          ten_truong: values.ten_truong,
          kieu_du_lieu: values.kieu_du_lieu
        };
        await themTruongThongTin(dataToSubmit);
      } else if (truongThongTinSelected) {
        // Chuyển đổi dữ liệu để phù hợp với API
        const dataToUpdate = {
          id: parseInt(truongThongTinSelected.id),
          ten_truong: values.ten_truong,
          kieu_du_lieu: values.kieu_du_lieu
        };
        await capNhatTruongThongTin(dataToUpdate);
      }
      setVisibleModal(false);
      await fetchDanhSachTruongThongTin(); // Refresh lại dữ liệu
    } catch (error) {
      message.error('Có lỗi xảy ra khi xử lý dữ liệu');
      console.error(error);
    }
  };

  // Mở drawer xem chi tiết
  const handleViewDetail = (record: TruongThongTin) => {
    setTruongThongTinSelected(record);
    setVisibleDetail(true);
  };

  // Hàm hiển thị kiểu dữ liệu dễ đọc
  const renderKieuDuLieu = (kieu: string) => {
    switch (kieu) {
      case 'String':
        return 'Chuỗi (String)';
      case 'Number':
        return 'Số (Number)';
      case 'Date':
        return 'Ngày tháng (Date)';
      default:
        return kieu;
    }
  };

  // Định nghĩa cột cho bảng
  const columns: TableColumnsType<TruongThongTin> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Tên trường',
      dataIndex: 'ten_truong',
      key: 'ten_truong',
      width: 250,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieu_du_lieu',
      key: 'kieu_du_lieu',
      width: 180,
      render: (value) => renderKieuDuLieu(value),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trường thông tin này?"
            onConfirm={() => xoaTruongThongTin(parseInt(record.id))}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Cấu hình biểu mẫu phụ lục văn bằng">
      <ProTable<TruongThongTin>
        columns={columns}
        dataSource={danhSachTruongThongTin}
        rowKey="id"
        search={false}
        dateFormatter="string"
        headerTitle="Danh sách trường thông tin"
        loading={loading}
        options={{
          density: true,
          fullScreen: true,
          reload: () => fetchDanhSachTruongThongTin(),
          setting: true,
        }}
        toolbar={{
          search: (
            <Input
              placeholder="Tìm kiếm theo tên trường"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
              prefix={<SearchOutlined />}
              allowClear
            />
          ),
        }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={handleOpenAddModal}
          >
            Thêm trường mới
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          showTotal: (total: number) => `Tổng cộng ${total} trường thông tin`,
        }}
      />

      {/* Modal thêm/sửa trường thông tin */}
      <TruongThongTinModal
        visible={visibleModal}
        modalType={modalType}
        initialValues={truongThongTinSelected}
        onCancel={() => setVisibleModal(false)}
        onSubmit={handleSubmitModal}
      />

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết trường thông tin"
        width={600}
        placement="right"
        onClose={() => setVisibleDetail(false)}
        open={visibleDetail}
      >
        {truongThongTinSelected && (
          <TruongThongTinDetail truongThongTin={truongThongTinSelected} />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TruongThongTinPage; 