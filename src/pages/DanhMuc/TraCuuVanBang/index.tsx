import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  DatePicker, 
  Table, 
  Divider, 
  Typography, 
  Row, 
  Col, 
  Space, 
  Empty, 
  Spin,
  Tooltip 
} from 'antd';
import { SearchOutlined, EyeOutlined, ClearOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useInitModel, TraCuuVanBang, TraCuuFormParams } from '@/models/Vanbang/tracuuvanbang';
import VanBangDetail from './components/VanBangDetail';
import styles from './index.less';

const { Title } = Typography;

const TraCuuVanBangPage: React.FC = () => {
  const {
    ketQuaTraCuu,
    vanBangSelected,
    setVanBangSelected,
    loading,
    visibleDetail,
    setVisibleDetail,
    hasSearched,
    traCuuVanBang,
    xemChiTietVanBang,
    resetTraCuu
  } = useInitModel();

  const [form] = Form.useForm();

  // Xử lý tra cứu
  const handleTraCuu = (values: TraCuuFormParams) => {
    // Xử lý date format nếu có
    if (values.ngaySinh) {
      values.ngaySinh = moment(values.ngaySinh).format('YYYY-MM-DD');
    }
    
    traCuuVanBang(values);
  };

  // Xử lý reset form
  const handleReset = () => {
    form.resetFields();
    resetTraCuu();
  };

  // Định nghĩa cột cho bảng kết quả tra cứu
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 70,
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 160,
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      width: 100,
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
      render: (value: Date) => (value ? moment(value).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Quyết định',
      dataIndex: 'soQuyetDinh',
      key: 'soQuyetDinh',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_: any, record: TraCuuVanBang) => (
        <Tooltip title="Xem chi tiết">
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            onClick={() => xemChiTietVanBang(record)} 
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Title level={4}>Tra cứu văn bằng</Title>
        <Divider />
        
        <Form 
          form={form}
          layout="vertical" 
          onFinish={handleTraCuu}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                label="Số hiệu văn bằng" 
                name="soHieuVanBang"
              >
                <Input placeholder="Nhập số hiệu văn bằng" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Số vào sổ" 
                name="soVaoSo"
              >
                <Input type="number" placeholder="Nhập số vào sổ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Mã sinh viên" 
                name="maSinhVien"
              >
                <Input placeholder="Nhập mã sinh viên" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item 
                label="Họ tên" 
                name="hoTen"
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item 
                label="Ngày sinh" 
                name="ngaySinh"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY" 
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />} 
                  loading={loading}
                >
                  Tra cứu
                </Button>
                <Button 
                  icon={<ClearOutlined />} 
                  onClick={handleReset}
                >
                  Làm mới
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
        
        <Divider />
        
        <Spin spinning={loading}>
          {hasSearched ? (
            <>
              <Title level={5}>Kết quả tra cứu ({ketQuaTraCuu.length} văn bằng)</Title>
              {ketQuaTraCuu.length > 0 ? (
                <Table 
                  columns={columns} 
                  dataSource={ketQuaTraCuu} 
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 1000 }}
                />
              ) : (
                <Empty description="Không tìm thấy văn bằng nào phù hợp" />
              )}
            </>
          ) : (
            <Empty description="Vui lòng nhập ít nhất 2 thông tin để tra cứu" />
          )}
        </Spin>
      </Card>

      {vanBangSelected && (
        <VanBangDetail 
          visible={visibleDetail} 
          vanBang={vanBangSelected} 
          onClose={() => setVisibleDetail(false)} 
        />
      )}
    </PageContainer>
  );
};

export default TraCuuVanBangPage; 