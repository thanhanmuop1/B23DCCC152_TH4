import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Row, Col, Table, Button, Space, Card, Typography, Drawer, Empty } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useInitModel, TraCuuVanBang, TraCuuParams } from '../../../models/Vanbang/tracuuvanbang';
import TraCuuForm from './components/TraCuuForm';
import ChiTietVanBang from './components/ChiTietVanBang';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');
const { Title } = Typography;

const TraCuuVanBangPage: React.FC = () => {
  const {
    ketQuaTraCuu,
    setKetQuaTraCuu,
    vanBangSelected,
    setVanBangSelected,
    loading,
    setLoading,
    danhSachQuyetDinh,
    visibleDetail,
    setVisibleDetail,
    thongKeTraCuu,
    traCuuVanBang,
    xemChiTietVanBang,
    loadQuyetDinhTotNghiep,
  } = useInitModel<TraCuuVanBang>();

  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Tải dữ liệu quyết định khi component được tạo
  useEffect(() => {
    loadQuyetDinhTotNghiep();
  }, []);

  // Xử lý tra cứu
  const handleTraCuu = (params: TraCuuParams) => {
    setHasSearched(true);
    traCuuVanBang(params);
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
      dataIndex: 'tenQuyetDinh',
      key: 'tenQuyetDinh',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_text: any, record: TraCuuVanBang) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => xemChiTietVanBang(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <PageContainer title="Tra cứu văn bằng">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          {/* Form tra cứu */}
          <TraCuuForm onTraCuu={handleTraCuu} loading={loading} />
        </Col>
        
        <Col xs={24} md={12} lg={16}>
          {/* Kết quả tra cứu */}
          <Card>
            <Title level={4}>Kết quả tra cứu</Title>
            
            {hasSearched ? (
              <Table
                columns={columns}
                dataSource={ketQuaTraCuu}
                rowKey="id"
                bordered
                loading={loading}
                pagination={{ 
                  pageSize: 5, 
                  showTotal: (total) => `Tổng cộng ${total} văn bằng`
                }}
                locale={{
                  emptyText: <Empty description="Không tìm thấy kết quả phù hợp" />
                }}
              />
            ) : (
              <Empty description="Vui lòng nhập thông tin để tra cứu văn bằng" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết văn bằng"
        width={700}
        placement="right"
        onClose={() => setVisibleDetail(false)}
        visible={visibleDetail}
      >
        {vanBangSelected && (
          <ChiTietVanBang 
            vanBang={vanBangSelected} 
            danhSachQuyetDinh={danhSachQuyetDinh} 
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TraCuuVanBangPage; 