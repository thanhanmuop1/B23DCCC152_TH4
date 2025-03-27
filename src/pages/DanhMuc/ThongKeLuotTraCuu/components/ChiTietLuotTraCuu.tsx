import React, { useEffect, useState } from 'react';
import { Card, Table, Empty, Spin, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import LuotTraCuuService from '@/services/LuotTraCuu';

interface LuotTraCuuRecord {
  id: number;
  thoi_gian: string;
  so_hieu_van_bang: string;
  ho_ten: string;
  so_quyet_dinh: string;
}

interface ChiTietLuotTraCuuProps {
  onReload?: () => void;
}

const ChiTietLuotTraCuu: React.FC<ChiTietLuotTraCuuProps> = ({ onReload }) => {
  const [danhSachLuotTraCuu, setDanhSachLuotTraCuu] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm tải danh sách lượt tra cứu gần đây
  const loadDanhSachLuotTraCuu = async () => {
    setLoading(true);
    try {
      const response = await LuotTraCuuService.getLuotTraCuuGanDay(20);
      if (response.data.success) {
        const formattedData = response.data.data.map((item: LuotTraCuuRecord) => ({
          key: item.id,
          thoiGian: moment(item.thoi_gian).format('DD/MM/YYYY HH:mm:ss'),
          soHieuVanBang: item.so_hieu_van_bang,
          hoTen: item.ho_ten,
          soQuyetDinh: item.so_quyet_dinh
        }));
        setDanhSachLuotTraCuu(formattedData);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách lượt tra cứu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDanhSachLuotTraCuu();
  }, []);

  // Phương thức này được gọi khi nút reload của component cha được click
  useEffect(() => {
    if (onReload) {
      const handleReload = () => {
        loadDanhSachLuotTraCuu();
      };
      
      // Gán hàm reload vào prop onReload
      onReload.current = handleReload;
    }
  }, [onReload]);

  // Cột cho bảng lượt tra cứu gần đây
  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      width: 180,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 180,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 200,
    },
    {
      title: 'Quyết định',
      dataIndex: 'soQuyetDinh',
      key: 'soQuyetDinh',
      width: 150,
    },
  ];

  return (
    <Card 
      title="Danh sách lượt tra cứu gần đây"
      extra={
        <Button icon={<ReloadOutlined />} onClick={loadDanhSachLuotTraCuu}>
          Làm mới
        </Button>
      }
    >
      <Spin spinning={loading}>
        {danhSachLuotTraCuu.length > 0 ? (
          <Table 
            columns={columns} 
            dataSource={danhSachLuotTraCuu} 
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty description="Không có dữ liệu lượt tra cứu gần đây" />
        )}
      </Spin>
    </Card>
  );
};

export default ChiTietLuotTraCuu; 