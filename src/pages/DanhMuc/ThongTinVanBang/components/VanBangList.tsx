import React from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, Popconfirm } from 'antd';
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { ThongTinVanBang } from '@/models/Vanbang/thongtinvanbang';
import moment from 'moment';

interface VanBangListProps {
  danhSachVanBang: ThongTinVanBang[];
  loading: boolean;
  onView: (record: ThongTinVanBang) => void;
  onEdit: (record: ThongTinVanBang) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const VanBangList: React.FC<VanBangListProps> = ({
  danhSachVanBang,
  loading,
  onView,
  onEdit,
  onDelete,
  onAdd,
}) => {
  // Định nghĩa cột cho bảng
  const columns: TableColumnsType<ThongTinVanBang> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      width: 100,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 160,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 180,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      width: 120,
      render: (value) => (value ? moment(value).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Quyết định tốt nghiệp',
      dataIndex: 'soQuyetDinh',
      key: 'soQuyetDinh',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thông tin văn bằng này?"
            onConfirm={() => onDelete(record.id)}
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
    <ProTable<ThongTinVanBang>
      columns={columns}
      dataSource={danhSachVanBang}
      rowKey="id"
      search={false}
      dateFormatter="string"
      headerTitle="Danh sách thông tin văn bằng"
      loading={loading}
      options={{
        density: true,
        fullScreen: true,
        reload: false,
        setting: true,
      }}
      toolbar={{
        actions: [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={onAdd}
          >
            Thêm mới
          </Button>,
        ],
      }}
      pagination={{
        pageSize: 10,
        showTotal: (total: number) => `Tổng cộng ${total} văn bằng`,
      }}
      scroll={{ x: 1100 }}
    />
  );
};

export default VanBangList; 