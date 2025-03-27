import React from 'react';
import { Drawer, Form, Row, Col, Input, InputNumber, DatePicker, Button, Space, FormInstance } from 'antd';

interface AdvancedSearchDrawerProps {
  visible: boolean;
  form: FormInstance;
  onSearch: () => void;
  onReset: () => void;
  onClose: () => void;
}

const AdvancedSearchDrawer: React.FC<AdvancedSearchDrawerProps> = ({
  visible,
  form,
  onSearch,
  onReset,
  onClose,
}) => {
  return (
    <Drawer
      title="Tìm kiếm thông tin văn bằng"
      width={500}
      placement="right"
      onClose={onClose}
      open={visible}
      extra={
        <Space>
          <Button onClick={onReset}>Đặt lại</Button>
          <Button type="primary" onClick={onSearch}>
            Tìm kiếm
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="soHieuVanBang"
              label="Số hiệu văn bằng"
            >
              <Input placeholder="Nhập số hiệu văn bằng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="soVaoSo"
              label="Số vào sổ"
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập số vào sổ" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maSinhVien"
              label="Mã sinh viên"
            >
              <Input placeholder="Nhập mã sinh viên" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="hoTen"
              label="Họ tên"
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ngaySinh"
              label="Ngày sinh"
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ marginTop: 16, color: 'red' }}>
          * Lưu ý: Cần nhập ít nhất 2 tiêu chí để tìm kiếm.
        </div>
      </Form>
    </Drawer>
  );
};

export default AdvancedSearchDrawer; 