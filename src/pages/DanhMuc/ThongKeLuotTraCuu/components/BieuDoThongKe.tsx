import React from 'react';
import { Card, Empty, Row, Col, Typography } from 'antd';
const { Title, Paragraph } = Typography;
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  Legend, ResponsiveContainer, BarChart, Bar, LabelList
} from 'recharts';
import { ThongKeTheoThang, ThongKeVanBang } from '@/models/ThongKe/thongkeluottracuu';

interface BieuDoThongKeProps {
  luotTraCuuTheoThang: ThongKeTheoThang[];
  vanBangTheoQuyetDinh: ThongKeVanBang[];
}

const BieuDoThongKe: React.FC<BieuDoThongKeProps> = ({
  luotTraCuuTheoThang,
  vanBangTheoQuyetDinh,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="Lượt tra cứu theo tháng">
          <Title level={4}>Thống kê lượt tra cứu trong 7 tháng gần đây</Title>
          {luotTraCuuTheoThang.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={luotTraCuuTheoThang}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="thang" />
                <YAxis />
                <RechartsTooltip />
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
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Card>
      </Col>

      <Col xs={24} md={12}>
        <Card title="Lượt tra cứu theo quyết định">
          <Paragraph>Phân bố lượt tra cứu theo quyết định tốt nghiệp</Paragraph>
          {vanBangTheoQuyetDinh.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={vanBangTheoQuyetDinh}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quyetDinh" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="soLuong" fill="#1890ff" name="Số lượt tra cứu">
                  <LabelList dataKey="soLuong" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default BieuDoThongKe; 