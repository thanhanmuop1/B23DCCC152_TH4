import React, { useEffect } from 'react';
import { Modal, Form, InputNumber } from 'antd';
import { SoVanBang } from '../sovanbang';

interface SoVanBangModalProps {
  visible: boolean;
  type: 'add' | 'edit';
  soVanBangSelected: SoVanBang | null;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const SoVanBangModal: React.FC<SoVanBangModalProps> = ({
  visible,
  type,
  soVanBangSelected,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  // Reset form khi mở modal
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      // Nếu là edit thì điền dữ liệu vào form
      if (type === 'edit' && soVanBangSelected) {
        form.setFieldsValue({
          ...soVanBangSelected,
        });
      }
    }
  }, [visible, type, soVanBangSelected, form]);

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Nếu là edit thì giữ lại id và số hiện tại
      if (type === 'edit' && soVanBangSelected) {
        values.id = soVanBangSelected.id;
        values.so_hien_tai = soVanBangSelected.so_hien_tai;
      }
      
      onSubmit(values);
    } catch (error) {
      console.error('Lỗi khi xác thực form:', error);
    }
  };

  const title = type === 'add' ? 'Mở sổ văn bằng mới' : 'Cập nhật sổ văn bằng';
  const currentYear = new Date().getFullYear();

  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={type === 'add' ? 'Mở sổ mới' : 'Cập nhật'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ nam: currentYear }}
      >
        <Form.Item
          name="nam"
          label="Năm"
          rules={[
            { required: true, message: 'Vui lòng nhập năm!' },
            {
              type: 'number',
              min: 2000,
              max: 2100,
              message: 'Năm phải nằm trong khoảng 2000-2100!',
            }
          ]}
        >
          <InputNumber 
            placeholder="Ví dụ: 2023" 
            style={{ width: '100%' }}
            min={2000}
            max={2100}
          />
        </Form.Item>

        {type === 'edit' && (
          <Form.Item
            name="so_hien_tai"
            label="Số hiện tại"
          >
            <InputNumber disabled style={{ width: '100%' }} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default SoVanBangModal; 