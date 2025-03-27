import React from 'react';
import { Drawer, Descriptions, Button, Space, Typography, Divider, Row, Col, Tag } from 'antd';
import { PrinterOutlined, FileImageOutlined, DownloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import { TraCuuVanBang } from '@/models/Vanbang/tracuuvanbang';
import styles from './VanBangDetail.less';

const { Title, Text } = Typography;

interface VanBangDetailProps {
  visible: boolean;
  vanBang: TraCuuVanBang;
  onClose: () => void;
}

const VanBangDetail: React.FC<VanBangDetailProps> = ({ 
  visible, 
  vanBang, 
  onClose 
}) => {
  // Xử lý in văn bằng
  const handlePrint = () => {
    window.print();
  };

  // Render giá trị các trường động
  const renderTruongDongValues = () => {
    if (!vanBang.truongDong || Object.keys(vanBang.truongDong).length === 0) {
      return <Text italic>Không có thông tin bổ sung</Text>;
    }

    return (
      <div>
        {Object.entries(vanBang.truongDong).map(([key, value]) => {
          // Xử lý trường hợp value là object
          if (typeof value === 'object' && value !== null) {
            return Object.entries(value).map(([childKey, childValue]) => {
              if (typeof childValue === 'object' && childValue !== null) {
                return (
                  <Row key={`${key}_${childKey}`} style={{ marginBottom: 8 }}>
                    <Col span={8}><Text strong>{childValue.truong_id}:</Text></Col>
                    <Col span={16}>{childValue.gia_tri}</Col>
                  </Row>
                );
              }
              return (
                <Row key={`${key}_${childKey}`} style={{ marginBottom: 8 }}>
                  <Col span={8}><Text strong>{childKey}:</Text></Col>
                  <Col span={16}>{childValue}</Col>
                </Row>
              );
            });
          }
          
          return (
            <Row key={key} style={{ marginBottom: 8 }}>
              <Col span={8}><Text strong>{key}:</Text></Col>
              <Col span={16}>{value}</Col>
            </Row>
          );
        })}
      </div>
    );
  };

  return (
    <Drawer 
      title={<Title level={4}>Chi tiết văn bằng</Title>}
      width={720}
      placement="right"
      onClose={onClose}
      visible={visible}
      extra={
        <Space>
          <Button icon={<PrinterOutlined />} onClick={handlePrint}>In văn bằng</Button>
          <Button icon={<DownloadOutlined />} type="primary">Tải xuống</Button>
        </Space>
      }
    >
      <div className={styles.vanBangDetail}>
        <Descriptions 
          title="Thông tin cơ bản" 
          bordered 
          column={1}
          labelStyle={{ fontWeight: 'bold', width: '30%' }}
        >
          <Descriptions.Item label="Số hiệu văn bằng">{vanBang.soHieuVanBang}</Descriptions.Item>
          <Descriptions.Item label="Số vào sổ">{vanBang.soVaoSo}</Descriptions.Item>
          <Descriptions.Item label="Họ tên">{vanBang.hoTen}</Descriptions.Item>
          <Descriptions.Item label="Mã sinh viên">{vanBang.maSinhVien}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {moment(vanBang.ngaySinh).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Quyết định tốt nghiệp">
            {vanBang.soQuyetDinh}
          </Descriptions.Item>
          <Descriptions.Item label="Năm sổ văn bằng">
            {vanBang.namSo}
          </Descriptions.Item>
        </Descriptions>

        <Divider orientation="left">Thông tin bổ sung</Divider>
        
        <div className={styles.truongDongSection}>
          {renderTruongDongValues()}
        </div>
        
        <Divider />
        
        <div className={styles.bannerSection}>
          <Space>
            <FileImageOutlined style={{ fontSize: 24 }} />
            <Text>Mã QR truy xuất thông tin văn bằng được tạo tự động khi in.</Text>
          </Space>
        </div>
      </div>
    </Drawer>
  );
};

export default VanBangDetail; 