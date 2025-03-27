import React, { useState, useEffect } from 'react';
import { 
  PageContainer, 
  ProTable,
} from '@ant-design/pro-components';
import { Button, Input, Space, Popconfirm, message, Drawer } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useInitModel, QuyetDinhTotNghiep } from '../../../models/Vanbang/quyetdinhtotnghiep';
import QuyetDinhModal from './components/QuyetDinhModal';
import QuyetDinhDetail from './components/QuyetDinhDetail';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const QuyetDinhTotNghiepPage: React.FC = () => {
  const {
    danhSachQuyetDinh,
    setDanhSachQuyetDinh,
    loading,
    setLoading,
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
    fetchDanhSachQuyetDinh
  } = useInitModel<QuyetDinhTotNghiep>();

  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  // Sử dụng useEffect để gọi API khi component mount
  useEffect(() => {
    fetchDanhSachQuyetDinh();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    if (value.trim() === '') {
      // Nếu không có giá trị tìm kiếm, lấy lại toàn bộ danh sách
      fetchDanhSachQuyetDinh();
    } else {
      // Tìm kiếm từ dữ liệu đã có
      timKiemQuyetDinh(value);
    }
  };

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setQuyetDinhSelected(null);
    setModalType('add');
    setVisibleModal(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (record: QuyetDinhTotNghiep) => {
    setQuyetDinhSelected(record);
    setModalType('edit');
    setVisibleModal(true);
  };

  // Xử lý submit form modal
  const handleSubmitModal = async (values: any) => {
    if (modalType === 'add') {
      const success = await themQuyetDinh(values);
      if (success) {
        setVisibleModal(false);
      }
    } else {
      const success = await capNhatQuyetDinh({
        ...values,
        id: quyetDinhSelected?.id as number,
      });
      if (success) {
        setVisibleModal(false);
      }
    }
  };

  // Mở drawer xem chi tiết
  const handleViewDetail = (record: QuyetDinhTotNghiep) => {
    setQuyetDinhSelected(record);
    setVisibleDetail(true);
  };

  // Định nghĩa cột cho bảng
  const columns: TableColumnsType<QuyetDinhTotNghiep> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Số quyết định',
      dataIndex: 'soQuyetDinh',
      key: 'soQuyetDinh',
      width: 180,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      key: 'ngayBanHanh',
      width: 150,
      render: (value) => (value ? moment(value).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      key: 'trichYeu',
      ellipsis: true,
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
            title="Bạn có chắc chắn muốn xóa quyết định này?"
            onConfirm={async () => {
              const success = await xoaQuyetDinh(record.id);
              if (success) {
                message.success("Đã xóa quyết định thành công");
              }
            }}
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
    <PageContainer title="Quản lý quyết định tốt nghiệp">
      <ProTable<QuyetDinhTotNghiep>
        columns={columns}
        dataSource={danhSachQuyetDinh}
        rowKey="id"
        search={false}
        dateFormatter="string"
        headerTitle="Danh sách quyết định tốt nghiệp"
        loading={loading}
        options={{
          density: true,
          fullScreen: true,
          reload: () => fetchDanhSachQuyetDinh(),
          setting: true,
        }}
        toolbar={{
          search: (
            <Input
              placeholder="Tìm kiếm theo số quyết định"
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
            Thêm mới
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          showTotal: (total: number) => `Tổng cộng ${total} quyết định`,
        }}
      />

      {/* Modal thêm/sửa quyết định */}
      <QuyetDinhModal
        visible={visibleModal}
        type={modalType}
        quyetDinhSelected={quyetDinhSelected}
        danhSachSoVanBang={danhSachSoVanBang}
        onCancel={() => setVisibleModal(false)}
        onSubmit={handleSubmitModal}
      />

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết quyết định tốt nghiệp"
        width={600}
        placement="right"
        onClose={() => setVisibleDetail(false)}
        visible={visibleDetail}
      >
        {quyetDinhSelected && (
          <QuyetDinhDetail 
            quyetDinh={quyetDinhSelected} 
            danhSachSoVanBang={danhSachSoVanBang} 
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default QuyetDinhTotNghiepPage; 