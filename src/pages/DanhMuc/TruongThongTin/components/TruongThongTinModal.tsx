import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';
import { TruongThongTin } from '../../../../models/Vanbang/truongthongtin';

interface TruongThongTinModalProps {
  open: boolean;
  type: 'add' | 'edit';
  truongThongTinSelected: TruongThongTin | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const TruongThongTinModal: React.FC<TruongThongTinModalProps> = ({
  open,
  type,
  truongThongTinSelected,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      form.resetFields();
      
      // Nếu là edit thì điền dữ liệu vào form
      if (type === 'edit' && truongThongTinSelected) {
        form.setFieldsValue({
          ...truongThongTinSelected,
        });
      }
    }
  }, [open, type, truongThongTinSelected, form]);

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Nếu là edit thì giữ lại id
      if (type === 'edit' && truongThongTinSelected) {
        values.id = truongThongTinSelected.id;
      }
      
      onSubmit(values);
    } catch (error) {
      console.error('Lỗi khi xác thực form:', error);
    }
  };

  const title = type === 'add' ? 'Thêm trường thông tin mới' : 'Cập nhật trường thông tin';

  return (
    <Modal
      title={title}
      visible={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={type === 'add' ? 'Thêm mới' : 'Cập nhật'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ kieuDuLieu: 'String', batBuoc: false }}
      >
        <Form.Item
          name="tenTruong"
          label="Tên trường"
          rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
        >
          <Input placeholder="Nhập tên trường thông tin" />
        </Form.Item>

        <Form.Item
          name="kieuDuLieu"
          label="Kiểu dữ liệu"
          rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu!' }]}
        >
          <Select>
            <Select.Option value="String">String (Chuỗi)</Select.Option>
            <Select.Option value="Number">Number (Số)</Select.Option>
            <Select.Option value="Date">Date (Ngày tháng)</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="batBuoc"
          valuePropName="checked"
        >
          <Checkbox>Bắt buộc</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TruongThongTinModal;