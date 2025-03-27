import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, Row, Col, InputNumber, Card, Typography, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { TraCuuParams } from '../../../../models/Vanbang/tracuuvanbang';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');
const { Title } = Typography;

interface TraCuuFormProps {
  onTraCuu: (params: TraCuuParams) => void;
  loading: boolean;
}

const TraCuuForm: React.FC<TraCuuFormProps> = ({ onTraCuu, loading }) => {
  const [form] = Form.useForm();
  const [paramCount, setParamCount] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  // Đếm số tham số đã nhập
  const countParams = (values: any) => {
    const count = Object.values(values).filter(value => 
      value !== undefined && value !== '' && value !== null
    ).length;
    
    setParamCount(count);
    setHasError(count < 2);
    
    return count;
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Đếm số tham số đã nhập
      const count = countParams(values);
      
      if (count < 2) {
        setHasError(true);
        return;
      }
      
      // Chuyển đổi ngày thành Date object
      const searchParams: TraCuuParams = {
        ...values,
        ngaySinh: values.ngaySinh ? values.ngaySinh.toDate() : undefined,
      };
      
      onTraCuu(searchParams);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Xử lý khi giá trị form thay đổi
  const handleValuesChange = () => {
    const values = form.getFieldsValue();
    countParams(values);
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    setParamCount(0);
    setHasError(false);
  };

  return (
    <Card>
      <Title level={4}>Tra cứu văn bằng</Title>
      
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
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
        
        {hasError && (
          <Alert
            message="Vui lòng nhập ít nhất 2 tham số để tra cứu"
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            icon={<ReloadOutlined />} 
            style={{ marginRight: 8 }}
            onClick={handleReset}
          >
            Đặt lại
          </Button>
          <Button 
            type="primary" 
            icon={<SearchOutlined />} 
            loading={loading}
            onClick={handleSubmit}
            disabled={paramCount < 2}
          >
            Tra cứu
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default TraCuuForm; 