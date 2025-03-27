import React from 'react';
import { Descriptions, Typography, Divider } from 'antd';
import { ThongTinVanBang, QuyetDinhTotNghiep } from '../../../../models/Vanbang/thongtinvanbang';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');
const { Title } = Typography;

interface VanBangDetailProps {
  vanBang: ThongTinVanBang;
  danhSachQuyetDinh: QuyetDinhTotNghiep[];
}

const VanBangDetail: React.FC<VanBangDetailProps> = ({ vanBang, danhSachQuyetDinh }) => {
  // Tìm thông tin quyết định tốt nghiệp
  const quyetDinh = danhSachQuyetDinh.find(qd => qd.id === vanBang.quyetDinhId);

  // Nhóm các trường thông tin phụ lục theo kiểu dữ liệu để hiển thị
  const renderGiaTri = (kieuDuLieu: string, giaTri: any) => {
    if (giaTri === null || giaTri === undefined) return 'Không có';
    
    switch (kieuDuLieu) {
      case 'String':
        return giaTri;
      case 'Number':
        return giaTri.toString();
      case 'Date':
        return moment(giaTri).format('DD/MM/YYYY');
      default:
        return giaTri.toString();
    }
  };

  return (
    <div>
      <Title level={4}>Thông tin văn bằng</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{vanBang.id}</Descriptions.Item>
        <Descriptions.Item label="Số vào sổ">{vanBang.soVaoSo}</Descriptions.Item>
        <Descriptions.Item label="Số hiệu văn bằng">{vanBang.soHieuVanBang}</Descriptions.Item>
        <Descriptions.Item label="Mã sinh viên">{vanBang.maSinhVien}</Descriptions.Item>
        <Descriptions.Item label="Họ tên">{vanBang.hoTen}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {vanBang.ngaySinh ? moment(vanBang.ngaySinh).format('DD/MM/YYYY') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Quyết định tốt nghiệp">
          {quyetDinh ? (
            <div>
              <div>{quyetDinh.soQuyetDinh}</div>
              <div>Ngày ban hành: {moment(quyetDinh.ngayBanHanh).format('DD/MM/YYYY')}</div>
              <div>Trích yếu: {quyetDinh.trichYeu}</div>
            </div>
          ) : vanBang.tenQuyetDinh || 'Không tìm thấy thông tin'}
        </Descriptions.Item>
      </Descriptions>

      {vanBang.truongThongTin && vanBang.truongThongTin.length > 0 && (
        <>
          <Divider />
          <Title level={4}>Thông tin phụ lục</Title>
          <Descriptions bordered column={1}>
            {vanBang.truongThongTin.map((tt, index) => (
              <Descriptions.Item key={index} label={tt.tenTruong}>
                {renderGiaTri(tt.kieuDuLieu, tt.giaTri)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </>
      )}
    </div>
  );
};

export default VanBangDetail; 