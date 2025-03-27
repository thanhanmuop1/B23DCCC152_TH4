import React, { useState, useEffect } from 'react';
import { 
  PageContainer, 
  ProTable,
} from '@ant-design/pro-components';
import { Button, Input, Space, Popconfirm, message, Drawer } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useInitModel, SoVanBang } from './sovanbang';
import SoVanBangModal from './components/SoVanBangModal';
import SoVanBangDetail from './components/SoVanBangDetail';

const SoVanBangPage: React.FC = () => {
  const {
    danhSachSoVanBang,
    setDanhSachSoVanBang,
    loading,
    setLoading,
    soVanBangSelected,
    setSoVanBangSelected,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    themSoVanBang,
    capNhatSoVanBang,
    xoaSoVanBang,
    timKiemSoVanBang,
  } = useInitModel<SoVanBang>();

  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // Giả lập dữ liệu ban đầu
  useEffect(() => {
    // Tạo dữ liệu mẫu
    const mockData: SoVanBang[] = [
      {
        id: '1',
        nam: 2022,
        so_hien_tai: 145,
      },
      {
        id: '2',
        nam: 2023,
        so_hien_tai: 67,
      },
    ];
    
    setDanhSachSoVanBang(mockData);
  }, [setDanhSachSoVanBang]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim() === '') {
      // Giả lập reload lại dữ liệu ban đầu
      const mockData: SoVanBang[] = [
        {
          id: '1',
          nam: 2022,
          so_hien_tai: 145,
        },
        {
          id: '2',
          nam: 2023,
          so_hien_tai: 67,
        },
      ];
      setDanhSachSoVanBang(mockData);
    } else {
      const results = timKiemSoVanBang(value);
      setDanhSachSoVanBang(results as SoVanBang[]);
    }
  };

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setSoVanBangSelected(null);
    setModalType('add');
    setVisibleModal(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (record: SoVanBang) => {
    setSoVanBangSelected(record);
    setModalType('edit');
    setVisibleModal(true);
  };

  // Xử lý submit form modal
  const handleSubmitModal = (values: any) => {
    if (modalType === 'add') {
      themSoVanBang(values);
    } else {
      capNhatSoVanBang(values as SoVanBang);
    }
    setVisibleModal(false);
  };

  // Mở drawer xem chi tiết
  const handleViewDetail = (record: SoVanBang) => {
    setSoVanBangSelected(record);
    setVisibleDetail(true);
  };

  // Định nghĩa cột cho bảng
  const columns: TableColumnsType<SoVanBang> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Năm',
      dataIndex: 'nam',
      key: 'nam',
      width: 180,
    },
    {
      title: 'Số hiện tại',
      dataIndex: 'so_hien_tai',
      key: 'so_hien_tai',
      width: 120,
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
            title="Bạn có chắc chắn muốn xóa sổ văn bằng này?"
            onConfirm={() => xoaSoVanBang(record.id)}
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
    <PageContainer title="Quản lý sổ văn bằng">
      <ProTable<SoVanBang>
        columns={columns}
        dataSource={danhSachSoVanBang}
        rowKey="id"
        search={false}
        dateFormatter="string"
        headerTitle="Danh sách sổ văn bằng"
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
              placeholder="Tìm kiếm theo năm"
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
            Mở sổ mới
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          showTotal: (total: number) => `Tổng cộng ${total} sổ văn bằng`,
        }}
      />

      {/* Modal thêm/sửa sổ văn bằng */}
      <SoVanBangModal
        visible={visibleModal}
        type={modalType}
        soVanBangSelected={soVanBangSelected}
        onCancel={() => setVisibleModal(false)}
        onSubmit={handleSubmitModal}
      />

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết sổ văn bằng"
        width={600}
        placement="right"
        onClose={() => setVisibleDetail(false)}
        visible={visibleDetail}
      >
        {soVanBangSelected && (
          <SoVanBangDetail soVanBang={soVanBangSelected} />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default SoVanBangPage; 