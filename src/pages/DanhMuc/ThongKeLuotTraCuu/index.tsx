import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { useThongKeModel } from '@/models/ThongKe/thongkeluottracuu';
import { Row, Col, Card, Statistic, Button, Divider, Typography } from 'antd';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, LabelList
} from 'recharts';
import { 
  DatabaseOutlined, FileTextOutlined, FileSearchOutlined, 
  TeamOutlined, BookOutlined, ArrowUpOutlined, ArrowDownOutlined 
} from '@ant-design/icons';
import { history } from 'umi';

const { Title, Paragraph } = Typography;

const ThongKeLuotTraCuu: React.FC = () => {
  const { 
    tongQuan, 
    luotTraCuuTheoThang, 
    vanBangTheoQuyetDinh, 
    isLoading, 
    loadAllData 
  } = useThongKeModel();

  // Tải dữ liệu khi component được mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Hàm điều hướng
  const navigateTo = (path: string) => {
    history.push(path);
  };

  return (
    <PageContainer>
      <Title level={2}>Tổng quan</Title>
      <Paragraph>Xem thống kê và các số liệu về văn bằng</Paragraph>
      
      {/* Phần hiển thị thống kê tổng quan */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số văn bằng"
              value={tongQuan.tongSoVanBang}
              precision={0}
              valueStyle={{ color: '#3f8600' }}
              prefix={<FileTextOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#3f8600' }}>
                  +{tongQuan.phanTramThayDoiVanBang}% Tăng {tongQuan.phanTramThayDoiVanBang}% so với tháng trước
                </span>
              }
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số văn bằng"
              value={tongQuan.soSoVanBang}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BookOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#1890ff' }}>
                  {tongQuan.soSoMoi} số được thêm trong tháng này
                </span>
              }
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Quyết định"
              value={tongQuan.soQuyetDinh}
              precision={0}
              valueStyle={{ color: '#722ed1' }}
              prefix={<DatabaseOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: '#722ed1' }}>
                  {tongQuan.quyetDinhMoi} quyết định trong tháng này
                </span>
              }
              loading={isLoading}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lượt tra cứu"
              value={tongQuan.luotTraCuu}
              precision={0}
              valueStyle={{ color: tongQuan.phanTramThayDoiTraCuu >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={<FileSearchOutlined />}
              suffix={
                <span style={{ fontSize: '14px', color: tongQuan.phanTramThayDoiTraCuu >= 0 ? '#3f8600' : '#cf1322' }}>
                  {tongQuan.phanTramThayDoiTraCuu >= 0 ? (
                    <>
                      <ArrowUpOutlined /> +{tongQuan.phanTramThayDoiTraCuu}%
                    </>
                  ) : (
                    <>
                      <ArrowDownOutlined /> {tongQuan.phanTramThayDoiTraCuu}%
                    </>
                  )} 
                  {' '}so với tháng trước
                </span>
              }
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      {/* Phần biểu đồ thống kê */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Lượt tra cứu văn bằng" loading={isLoading}>
            <Paragraph>Thống kê lượt tra cứu trong 7 tháng gần đây</Paragraph>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={luotTraCuuTheoThang}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="thang" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="luotTraCuu"
                  stroke="#1890ff"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name="Lượt tra cứu"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Văn bằng theo quyết định" loading={isLoading}>
            <Paragraph>Phân bố văn bằng theo quyết định tốt nghiệp</Paragraph>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={vanBangTheoQuyetDinh}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quyetDinh" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="soLuong" fill="#1890ff" name="Số lượng văn bằng">
                  <LabelList dataKey="soLuong" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ThongKeLuotTraCuu; 