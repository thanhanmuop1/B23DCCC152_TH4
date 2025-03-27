import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
import { ThongTinVanBang } from '@/models/Vanbang/thongtinvanbang';
import { TruongThongTin } from '@/models/Vanbang/truongthongtin';
import { SoVanBang } from '@/models/Vanbang/sovanbang';
import moment from 'moment';
import 'moment/locale/vi';
import { Moment } from 'moment';

moment.locale('vi');

// Interface cho formValues với hỗ trợ cho các trường động
interface FormValues {
  ngaySinh: Moment | null;
  id: number | string;
  soVaoSo: number;
  soHieuVanBang: string;
  maSinhVien: string;
  hoTen: string;
  quyetDinhId: number | string;
  soVanBangId: number | string;
  tenQuyetDinh?: string;
  [key: `truongThongTin_${string}`]: Moment | string | number | null;
}

interface QuyetDinhTotNghiep {
  id: number;
  soQuyetDinh: string;
  ngayBanHanh: Date;
}

interface VanBangModalProps {
  open: boolean;
  type: 'add' | 'edit';
  vanBangSelected: ThongTinVanBang | null;
  danhSachQuyetDinh: QuyetDinhTotNghiep[];
  danhSachTruongThongTin: TruongThongTin[];
  danhSachSoVanBang: SoVanBang[];
  soVaoSoMoi: number;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const VanBangModal: React.FC<VanBangModalProps> = ({
  open,
  type,
  vanBangSelected,
  danhSachQuyetDinh,
  danhSachTruongThongTin,
  danhSachSoVanBang,
  soVaoSoMoi,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      form.resetFields();
      
      // Nếu là edit thì điền dữ liệu vào form
      if (type === 'edit' && vanBangSelected) {
        const formValues: FormValues = {
          ...vanBangSelected,
          ngaySinh: vanBangSelected.ngaySinh ? moment(vanBangSelected.ngaySinh) : null,
        };
        
        // Chuyển đổi các trường thông tin phụ lục thành dạng form values
        if (vanBangSelected.truongThongTin && typeof vanBangSelected.truongThongTin === 'object') {
          Object.values(vanBangSelected.truongThongTin).forEach(tt => {
            // Đối với kiểu Date, cần chuyển về Moment object
            if (tt.kieuDuLieu === 'Date' && tt.giaTri) {
              formValues[`truongThongTin_${tt.truongThongTinId}`] = moment(tt.giaTri);
            } else {
              formValues[`truongThongTin_${tt.truongThongTinId}`] = tt.giaTri;
            }
          });
        }
        
        form.setFieldsValue(formValues);
      } else {
        // Nếu là thêm mới, chỉ cần reset form, không cần set số vào sổ nữa
        form.resetFields();
      }
    }
  }, [open, type, vanBangSelected, form, danhSachTruongThongTin]);

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Chuyển đổi ngày thành Date object
      const formattedValues = {
        ...values,
        ngaySinh: values.ngaySinh ? values.ngaySinh.toDate() : new Date(),
      };
      
      // Tạo object chứa trường thông tin phụ lục
      const truongThongTin: Record<string, any> = {};
      
      danhSachTruongThongTin.forEach(tt => {
        const fieldName = `truongThongTin_${tt.id}`;
        if (values[fieldName] !== undefined) {
          let giaTri = values[fieldName];
          
          // Nếu là kiểu Date, chuyển về Date object
          if (tt.kieu_du_lieu === 'Date' && giaTri) {
            giaTri = giaTri.toDate();
          }
          
          truongThongTin[tt.ten_truong] = {
            truongThongTinId: tt.id,
            tenTruong: tt.ten_truong,
            kieuDuLieu: tt.kieu_du_lieu,
            giaTri: giaTri,
          };
          
          // Xóa trường này khỏi values để không gửi lên server
          delete formattedValues[fieldName];
        }
      });
      
      // Thêm object trường thông tin vào values
      formattedValues.truongThongTin = truongThongTin;
      
      // Nếu là edit thì giữ lại id và soVaoSo
      if (type === 'edit' && vanBangSelected) {
        formattedValues.id = vanBangSelected.id;
        formattedValues.soVaoSo = vanBangSelected.soVaoSo;
      } else {
        // Nếu là add, không cần soVaoSo vì sẽ được tạo tự động bên server
        // soVaoSo sẽ được tính dựa trên soVanBangId
      }
      
      // Thêm tên quyết định để hiển thị trong bảng
      const quyetDinh = danhSachQuyetDinh.find(qd => qd.id === Number(formattedValues.quyetDinhId));
      if (quyetDinh) {
        formattedValues.tenQuyetDinh = quyetDinh.soQuyetDinh;
      }
      
      onSubmit(formattedValues);
    } catch (error) {
      console.error('Lỗi khi xác thực form:', error);
    }
  };

  const title = type === 'add' ? 'Thêm thông tin văn bằng mới' : 'Cập nhật thông tin văn bằng';

  // Render trường thông tin động dựa trên kiểu dữ liệu
  const renderTruongThongTin = () => {
    return danhSachTruongThongTin.map(truong => {
      // Tạo form item dựa trên kiểu dữ liệu
      let formItem;
      const fieldName = `truongThongTin_${truong.id}`;
      
      switch (truong.kieu_du_lieu) {
        case 'String':
          formItem = <Input placeholder={`Nhập ${truong.ten_truong}`} />;
          break;
        case 'Number':
          formItem = <InputNumber style={{ width: '100%' }} placeholder={`Nhập ${truong.ten_truong}`} />;
          break;
        case 'Date':
          formItem = (
            <DatePicker 
              format="DD/MM/YYYY" 
              style={{ width: '100%' }} 
              placeholder={`Chọn ${truong.ten_truong}`} 
            />
          );
          break;
        default:
          formItem = <Input placeholder={`Nhập ${truong.ten_truong}`} />;
      }
      
      return (
        <Form.Item
          key={truong.id}
          name={fieldName}
          label={truong.ten_truong}
          // Giả sử tất cả các trường không bắt buộc, có thể điều chỉnh theo yêu cầu
          rules={[]}
        >
          {formItem}
        </Form.Item>
      );
    });
  };

  return (
    <Modal
      title={title}
      visible={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={type === 'add' ? 'Thêm mới' : 'Cập nhật'}
      cancelText="Hủy"
      destroyOnClose
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ ngaySinh: moment().subtract(20, 'years') }}
      >
        {/* Bỏ phần hiển thị số vào sổ vì sẽ được tạo tự động */}
        {type === 'edit' && (
          <Form.Item
            name="soVaoSo"
            label="Số vào sổ"
          >
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item
          name="soHieuVanBang"
          label="Số hiệu văn bằng"
          rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng!' }]}
        >
          <Input placeholder="Nhập số hiệu văn bằng" />
        </Form.Item>

        <Form.Item
          name="maSinhVien"
          label="Mã sinh viên"
          rules={[{ required: true, message: 'Vui lòng nhập mã sinh viên!' }]}
        >
          <Input placeholder="Nhập mã sinh viên" />
        </Form.Item>

        <Form.Item
          name="hoTen"
          label="Họ tên"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input placeholder="Nhập họ tên sinh viên" />
        </Form.Item>

        <Form.Item
          name="ngaySinh"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker 
            format="DD/MM/YYYY" 
            style={{ width: '100%' }} 
            placeholder="Chọn ngày sinh"
          />
        </Form.Item>

        <Form.Item
          name="quyetDinhId"
          label="Quyết định tốt nghiệp"
          rules={[{ required: true, message: 'Vui lòng chọn quyết định tốt nghiệp!' }]}
        >
          <Select placeholder="Chọn quyết định tốt nghiệp">
            {danhSachQuyetDinh.map(qd => (
              <Select.Option key={qd.id} value={qd.id}>
                {qd.soQuyetDinh} - {moment(qd.ngayBanHanh).format('DD/MM/YYYY')}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="soVanBangId"
          label="Năm phát hành"
          rules={[{ required: true, message: 'Vui lòng chọn năm phát hành!' }]}
        >
          <Select placeholder="Chọn năm phát hành">
            {danhSachSoVanBang.map(so => (
              <Select.Option key={so.id} value={so.id}>
                {so.nam} - Sổ {so.id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ marginBottom: 16, fontWeight: 'bold' }}>Thông tin phụ lục:</div>
        
        {renderTruongThongTin()}
      </Form>
    </Modal>
  );
};

export default VanBangModal; 