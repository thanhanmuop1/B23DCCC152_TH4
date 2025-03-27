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
    timKiemTruongThongTin,
  } = useInitModel<TruongThongTin>();

  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // Giả lập dữ liệu ban đầu
  useEffect(() => {
    // Tạo dữ liệu mẫu
    const mockData: TruongThongTin[] = [
      {
        id: '1',
        tenTruong: 'Họ và tên',
        kieuDuLieu: 'String',
        batBuoc: true,
      },
      {
        id: '2',
        tenTruong: 'Ngày sinh',
        kieuDuLieu: 'Date',
        batBuoc: true,
      },
      {
        id: '3',
        tenTruong: 'Điểm trung bình',
        kieuDuLieu: 'Number',
        batBuoc: false,
      },
      {
        id: '4',
        tenTruong: 'Nơi sinh',
        kieuDuLieu: 'String',
        batBuoc: false,
      },
    ];
    
    setDanhSachTruongThongTin(mockData);
  }, [setDanhSachTruongThongTin]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() === '') {
      // Giả lập reload lại dữ liệu ban đầu
      const mockData: TruongThongTin[] = [
        {
          id: '1',
          tenTruong: 'Họ và tên',
          kieuDuLieu: 'String',
          batBuoc: true,
        },
        {
          id: '2',
          tenTruong: 'Ngày sinh',
          kieuDuLieu: 'Date',
          batBuoc: true,
        },
        {
          id: '3',
          tenTruong: 'Điểm trung bình',
          kieuDuLieu: 'Number',
          batBuoc: false,
        },
        {
          id: '4',
          tenTruong: 'Nơi sinh',
          kieuDuLieu: 'String',
          batBuoc: false,
        },
      ];
      setDanhSachTruongThongTin(mockData);
    } else {
      const results = timKiemTruongThongTin(value);
      setDanhSachTruongThongTin(results as TruongThongTin[]);
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
  const handleSubmitModal = (values: any) => {
    if (modalType === 'add') {
      themTruongThongTin(values);
    } else {
      capNhatTruongThongTin(values as TruongThongTin);
    }
    setVisibleModal(false);
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
      dataIndex: 'tenTruong',
      key: 'tenTruong',
      width: 250,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieuDuLieu',
      key: 'kieuDuLieu',
      width: 180,
      render: (value) => renderKieuDuLieu(value),
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'batBuoc',
      key: 'batBuoc',
      width: 120,
      render: (value) => value ? (
        <Badge status="success" text="Có" />
      ) : (
        <Badge status="default" text="Không" />
      ),
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
            onConfirm={() => xoaTruongThongTin(record.id)}
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
          reload: false,
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
        open={visibleModal}
        type={modalType}
        truongThongTinSelected={truongThongTinSelected}
        onCancel={() => setVisibleModal(false)}
        onSubmit={handleSubmitModal}
      />

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết trường thông tin"
        width={600}
        placement="right"
        onClose={() => setVisibleDetail(false)}
        visible={visibleDetail}
      >
        {truongThongTinSelected && (
          <TruongThongTinDetail truongThongTin={truongThongTinSelected} />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TruongThongTinPage; 