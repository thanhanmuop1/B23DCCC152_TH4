import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Checkbox } from 'antd';
import type { TruongThongTin } from '@/models/Vanbang/truongthongtin';

interface TruongThongTinModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  loading: boolean;
  modalType: 'add' | 'edit';
  initialValues?: TruongThongTin;
}

const TruongThongTinModal: React.FC<TruongThongTinModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  modalType,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Reset form khi mở modal
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      // Nếu là edit thì điền dữ liệu vào form
      if (modalType === 'edit' && initialValues) {
        form.setFieldsValue({
          ten_truong: initialValues.ten_truong,
          kieu_du_lieu: initialValues.kieu_du_lieu
        });
      }
    }
  }, [visible, modalType, initialValues, form]);

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      // Nếu là edit thì giữ lại id
      if (modalType === 'edit' && initialValues) {
        values.id = initialValues.id;
      }
      
      onSubmit(values);
    } catch (error) {
      console.error('Lỗi khi xác thực form:', error);
    }
  };

  const title = modalType === 'add' ? 'Thêm trường thông tin' : 'Cập nhật trường thông tin';

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues ? {
          ten_truong: initialValues.ten_truong,
          kieu_du_lieu: initialValues.kieu_du_lieu
        } : undefined}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="ten_truong"
          label="Tên trường"
          rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="kieu_du_lieu"
          label="Kiểu dữ liệu"
          rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}
        >
          <Select>
            <Select.Option value="String">Chuỗi</Select.Option>
            <Select.Option value="Number">Số</Select.Option>
            <Select.Option value="Date">Ngày tháng</Select.Option>
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