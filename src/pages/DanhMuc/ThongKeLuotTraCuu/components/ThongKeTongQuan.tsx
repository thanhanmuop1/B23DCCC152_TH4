import React from 'react';
import { Row, Col } from 'antd';
import { 
  FileTextOutlined, BookOutlined, DatabaseOutlined, FileSearchOutlined,
  ArrowUpOutlined, ArrowDownOutlined 
} from '@ant-design/icons';
import { TongQuanThongKe } from '@/models/ThongKe/thongkeluottracuu';
import DashboardCard from './DashboardCard';

interface ThongKeTongQuanProps {
  tongQuan: TongQuanThongKe;
}

const ThongKeTongQuan: React.FC<ThongKeTongQuanProps> = ({ tongQuan }) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <DashboardCard
          title="Tổng số văn bằng"
          value={tongQuan.tongSoVanBang}
          prefix={<FileTextOutlined />}
          changeValue={tongQuan.phanTramThayDoiVanBang}
          changeText="so với tháng trước"
        />
      </Col>

      <Col xs={24} sm={12} md={6}>
        <DashboardCard
          title="Số văn bằng"
          value={tongQuan.soSoVanBang}
          prefix={<BookOutlined />}
          changeText={`${tongQuan.soSoMoi} số mới`}
        />
      </Col>

      <Col xs={24} sm={12} md={6}>
        <DashboardCard
          title="Quyết định"
          value={tongQuan.soQuyetDinh}
          prefix={<DatabaseOutlined />}
          changeText={`${tongQuan.quyetDinhMoi} quyết định mới`}
        />
      </Col>

      <Col xs={24} sm={12} md={6}>
        <DashboardCard
          title="Lượt tra cứu"
          value={tongQuan.luotTraCuu}
          prefix={<FileSearchOutlined />}
          changeValue={tongQuan.phanTramThayDoiTraCuu}
          changeText="so với tháng trước"
        />
      </Col>
    </Row>
  );
};

export default ThongKeTongQuan; 