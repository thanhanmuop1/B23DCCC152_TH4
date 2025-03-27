import React from 'react';
import { Descriptions, Typography, Divider, Badge, Card } from 'antd';
import { TraCuuVanBang, QuyetDinhTotNghiep } from '../../../../models/Vanbang/tracuuvanbang';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');
const { Title } = Typography;

interface ChiTietVanBangProps {
  vanBang: TraCuuVanBang;
  danhSachQuyetDinh: QuyetDinhTotNghiep[];
}

const ChiTietVanBang: React.FC<ChiTietVanBangProps> = ({ vanBang, danhSachQuyetDinh }) => {
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
    <Card>
      <Badge.Ribbon text={`Lượt tra cứu: ${vanBang.luotTraCuu}`} color="blue">
        <Title level={4}>Thông tin chi tiết văn bằng</Title>
      </Badge.Ribbon>
      
      <Descriptions bordered column={1} style={{ marginTop: 16 }}>
        <Descriptions.Item label="Số vào sổ">{vanBang.soVaoSo}</Descriptions.Item>
        <Descriptions.Item label="Số hiệu văn bằng">{vanBang.soHieuVanBang}</Descriptions.Item>
        <Descriptions.Item label="Mã sinh viên">{vanBang.maSinhVien}</Descriptions.Item>
        <Descriptions.Item label="Họ tên">{vanBang.hoTen}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {vanBang.ngaySinh ? moment(vanBang.ngaySinh).format('DD/MM/YYYY') : ''}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Quyết định tốt nghiệp</Divider>
      
      <Descriptions bordered column={1}>
        {quyetDinh ? (
          <>
            <Descriptions.Item label="Số quyết định">{quyetDinh.soQuyetDinh}</Descriptions.Item>
            <Descriptions.Item label="Ngày ban hành">
              {moment(quyetDinh.ngayBanHanh).format('DD/MM/YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Trích yếu">{quyetDinh.trichYeu}</Descriptions.Item>
          </>
        ) : (
          <Descriptions.Item label="Quyết định">
            {vanBang.tenQuyetDinh || 'Không tìm thấy thông tin'}
          </Descriptions.Item>
        )}
      </Descriptions>

      {vanBang.truongThongTin && vanBang.truongThongTin.length > 0 && (
        <>
          <Divider orientation="left">Thông tin phụ lục</Divider>
          <Descriptions bordered column={1}>
            {vanBang.truongThongTin.map((tt, index) => (
              <Descriptions.Item key={index} label={tt.tenTruong}>
                {renderGiaTri(tt.kieuDuLieu, tt.giaTri)}
              </Descriptions.Item>
            ))}
          </Descriptions>
        </>
      )}
    </Card>
  );
};

export default ChiTietVanBang; 