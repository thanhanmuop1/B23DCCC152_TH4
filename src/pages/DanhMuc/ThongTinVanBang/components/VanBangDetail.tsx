import React from 'react';
import { Drawer, Descriptions, Tag, Typography, Divider } from 'antd';
import { ThongTinVanBang } from '@/models/Vanbang/thongtinvanbang';
import { QuyetDinhTotNghiep } from '@/models/Vanbang/quyetdinhtotnghiep';
import moment from 'moment';

const { Title } = Typography;

interface VanBangDetailProps {
  visible: boolean;
  vanBang: ThongTinVanBang | null;
  danhSachQuyetDinh: QuyetDinhTotNghiep[];
  onClose: () => void;
}

const VanBangDetail: React.FC<VanBangDetailProps> = ({
  visible,
  vanBang,
  danhSachQuyetDinh,
  onClose,
}) => {
  if (!vanBang) return null;

  const quyetDinh = danhSachQuyetDinh.find(q => q.id === vanBang.quyetDinhId);

  // Format giá trị theo kiểu dữ liệu
  const formatGiaTri = (giaTri: any, kieuDuLieu: string) => {
    if (giaTri === null || giaTri === undefined) return '-';
    
    switch (kieuDuLieu) {
      case 'Number':
        return Number(giaTri).toLocaleString('vi-VN');
      case 'Date':
        return moment(giaTri).format('DD/MM/YYYY');
      default:
        return giaTri.toString();
    }
  };

  return (
    <Drawer
      title="Chi tiết thông tin văn bằng"
      width={700}
      placement="right"
      onClose={onClose}
      open={visible}
    >
      <Title level={5}>Thông tin chính</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Số vào sổ" span={1}>
          {vanBang.soVaoSo}
        </Descriptions.Item>
        <Descriptions.Item label="Số hiệu văn bằng" span={1}>
          {vanBang.soHieuVanBang}
        </Descriptions.Item>
        <Descriptions.Item label="Mã sinh viên" span={1}>
          {vanBang.maSinhVien}
        </Descriptions.Item>
        <Descriptions.Item label="Họ tên" span={1}>
          {vanBang.hoTen}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh" span={1}>
          {moment(vanBang.ngaySinh).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Quyết định tốt nghiệp" span={1}>
          {quyetDinh ? (
            <>
              {quyetDinh.soQuyetDinh} - {moment(quyetDinh.ngayBanHanh).format('DD/MM/YYYY')}
            </>
          ) : (
            '-'
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider />
      <Title level={5}>Thông tin phụ lục</Title>
      
      {Object.values(vanBang.truongThongTin).length > 0 ? (
        <Descriptions bordered column={2}>
          {Object.values(vanBang.truongThongTin).map(item => (
            <Descriptions.Item key={item.truongThongTinId} label={item.tenTruong} span={1}>
              {formatGiaTri(item.giaTri, item.kieuDuLieu)}
            </Descriptions.Item>
          ))}
        </Descriptions>
      ) : (
        <p>Không có thông tin phụ lục</p>
      )}
    </Drawer>
  );
};

export default VanBangDetail; 
