import React from 'react';
import { Descriptions } from 'antd';
import { SoVanBang } from '../../../../models/Vanbang/sovanbang';

interface SoVanBangDetailProps {
  soVanBang: SoVanBang;
}

const SoVanBangDetail: React.FC<SoVanBangDetailProps> = ({ soVanBang }) => {
  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="ID">{soVanBang.id}</Descriptions.Item>
      <Descriptions.Item label="Năm">{soVanBang.nam}</Descriptions.Item>
      <Descriptions.Item label="Số hiện tại">{soVanBang.soHienTai}</Descriptions.Item>
    </Descriptions>
  );
};

export default SoVanBangDetail; 