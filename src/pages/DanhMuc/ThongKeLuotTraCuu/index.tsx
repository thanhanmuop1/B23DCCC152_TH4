import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useThongKeModel } from '@/models/ThongKe/thongkeluottracuu';
import { Card, Button, Divider, Typography, Space, Tabs, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import BieuDoThongKe from './components/BieuDoThongKe';
import ChiTietLuotTraCuu from './components/ChiTietLuotTraCuu';
import ThongKeTongQuan from './components/ThongKeTongQuan';
import styles from './index.less';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ThongKeLuotTraCuu: React.FC = () => {
  const { 
    tongQuan, 
    luotTraCuuTheoThang, 
    vanBangTheoQuyetDinh, 
    isLoading, 
    loadAllData 
  } = useThongKeModel();
  
  // Sử dụng useRef để lưu trữ hàm reload của component con
  const chiTietLuotTraCuuRef = useRef<() => void>(null);

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    loadAllData();
  }, []);

  const handleReload = () => {
    loadAllData();
    // Gọi hàm reload của component con nếu có
    if (chiTietLuotTraCuuRef.current) {
      chiTietLuotTraCuuRef.current();
    }
  };

  return (
    <PageContainer>
      <Card className={styles.refreshCard}>
        <Space className={styles.refreshSection}>
          <Text>Cập nhật thống kê:</Text>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={handleReload}
          >
            Tải lại dữ liệu
          </Button>
        </Space>
      </Card>

      <Spin spinning={isLoading}>
        <Title level={2}>Tổng quan</Title>
        <Paragraph>Xem thống kê và các số liệu về lượt tra cứu văn bằng</Paragraph>
        
        {/* Phần hiển thị thống kê tổng quan */}
        <ThongKeTongQuan tongQuan={tongQuan} />

        <Divider />

        {/* Tabs cho hiển thị biểu đồ và chi tiết */}
        <Tabs defaultActiveKey="1">
          <TabPane tab="Biểu đồ thống kê" key="1">
            <BieuDoThongKe 
              luotTraCuuTheoThang={luotTraCuuTheoThang}
              vanBangTheoQuyetDinh={vanBangTheoQuyetDinh}
            />
          </TabPane>
          
          <TabPane tab="Chi tiết lượt tra cứu" key="2">
            <ChiTietLuotTraCuu onReload={chiTietLuotTraCuuRef} />
          </TabPane>
        </Tabs>
      </Spin>
    </PageContainer>
  );
};

export default ThongKeLuotTraCuu; 