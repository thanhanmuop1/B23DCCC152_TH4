import React from 'react';
import { Descriptions, Badge } from 'antd';
import { TruongThongTin } from '../../../../models/Vanbang/truongthongtin';

interface TruongThongTinDetailProps {
  truongThongTin: TruongThongTin;
}

const TruongThongTinDetail: React.FC<TruongThongTinDetailProps> = ({ truongThongTin }) => {
  // Hiển thị kiểu dữ liệu dễ đọc
  const renderKieuDuLieu = (kieu: string) => {
    switch (kieu) {
      case 'String':
        return 'Chuỗi (String)';
      case 'Number':
        return 'Số (Number)';
      case 'Date':
        return 'Ngày tháng (Date)';
      default:
        return kieu;
    }
  };

  return (
    <Descriptions bordered column={1}>
      <Descriptions.Item label="ID">{truongThongTin.id}</Descriptions.Item>
      <Descriptions.Item label="Tên trường">{truongThongTin.tenTruong}</Descriptions.Item>
      <Descriptions.Item label="Kiểu dữ liệu">{renderKieuDuLieu(truongThongTin.kieuDuLieu)}</Descriptions.Item>
      <Descriptions.Item label="Bắt buộc">
        {truongThongTin.batBuoc ? (
          <Badge status="success" text="Có" />
        ) : (
          <Badge status="default" text="Không" />
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default TruongThongTinDetail; 