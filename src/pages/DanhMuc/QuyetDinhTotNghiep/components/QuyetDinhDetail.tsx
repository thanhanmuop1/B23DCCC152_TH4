import React from 'react';
import { Descriptions, Card } from 'antd';
import { QuyetDinhTotNghiep, SoVanBang } from '../../../../models/Vanbang/quyetdinhtotnghiep';
import moment from 'moment';

interface QuyetDinhDetailProps {
  quyetDinh: QuyetDinhTotNghiep;
  danhSachSoVanBang: SoVanBang[];
}

const QuyetDinhDetail: React.FC<QuyetDinhDetailProps> = ({ quyetDinh, danhSachSoVanBang }) => {
  // Tìm tên sổ văn bằng tương ứng
  const soVanBang = danhSachSoVanBang.find(item => item.id === quyetDinh.soVanBangId);

  return (
    <Card title="Chi tiết quyết định tốt nghiệp" bordered={false}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Số quyết định">
          {quyetDinh.soQuyetDinh}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày ban hành">
          {quyetDinh.ngayBanHanh ? moment(quyetDinh.ngayBanHanh).format('DD/MM/YYYY') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Trích yếu">
          {quyetDinh.trichYeu}
        </Descriptions.Item>
        <Descriptions.Item label="Sổ văn bằng">
          {soVanBang ? soVanBang.ten : ''}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default QuyetDinhDetail; 