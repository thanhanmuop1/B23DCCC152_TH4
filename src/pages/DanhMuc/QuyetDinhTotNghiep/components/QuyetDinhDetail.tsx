import React from 'react';
import { Descriptions, Typography } from 'antd';
import { QuyetDinhTotNghiep } from '@/models/Vanbang/quyetdinhtotnghiep';
import { SoVanBang } from '@/models/Vanbang/sovanbang';
import moment from 'moment';

const { Title } = Typography;

interface QuyetDinhDetailProps {
  quyetDinh: QuyetDinhTotNghiep;
  danhSachSoVanBang: SoVanBang[];
}

const QuyetDinhDetail: React.FC<QuyetDinhDetailProps> = ({
  quyetDinh,
  danhSachSoVanBang,
}) => {
  // Tìm sổ văn bằng tương ứng
  const soVanBang = danhSachSoVanBang.find(so => so.id === quyetDinh.soVanBangId);

  return (
    <div>
      <Title level={5}>Thông tin chính</Title>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Số quyết định">
          {quyetDinh.soQuyetDinh}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày ban hành">
          {moment(quyetDinh.ngayBanHanh).format('DD/MM/YYYY')}
        </Descriptions.Item>
        <Descriptions.Item label="Sổ văn bằng">
          {soVanBang ? `Sổ văn bằng năm ${soVanBang.nam} (${soVanBang.id})` : `-`}
        </Descriptions.Item>
        <Descriptions.Item label="Trích yếu">
          {quyetDinh.trichYeu}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default QuyetDinhDetail; 