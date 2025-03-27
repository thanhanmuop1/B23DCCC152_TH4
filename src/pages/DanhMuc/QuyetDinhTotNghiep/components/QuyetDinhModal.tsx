import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Space, Button } from 'antd';
import { QuyetDinhTotNghiep, SoVanBang } from '../../../../models/Vanbang/quyetdinhtotnghiep';
import moment from 'moment';
import 'moment/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

moment.locale('vi');

const { TextArea } = Input;

interface QuyetDinhModalProps {
  visible: boolean;
  type: 'add' | 'edit';
  quyetDinhSelected: QuyetDinhTotNghiep | null;
  danhSachSoVanBang: SoVanBang[];
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const QuyetDinhModal: React.FC<QuyetDinhModalProps> = ({
  visible,
  type,
  quyetDinhSelected,
  danhSachSoVanBang,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && type === 'edit' && quyetDinhSelected) {
      form.setFieldsValue({
        ...quyetDinhSelected,
        ngayBanHanh: quyetDinhSelected.ngayBanHanh ? moment(quyetDinhSelected.ngayBanHanh) : null,
      });
    } else if (visible && type === 'add') {
      form.resetFields();
    }
  }, [visible, type, quyetDinhSelected, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const submitData = {
        ...values,
        ngayBanHanh: values.ngayBanHanh ? values.ngayBanHanh.toDate() : null,
      };
      
      if (type === 'edit' && quyetDinhSelected) {
        submitData.id = quyetDinhSelected.id;
      }
      
      onSubmit(submitData);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={type === 'add' ? 'Thêm quyết định tốt nghiệp' : 'Cập nhật quyết định tốt nghiệp'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {type === 'add' ? 'Thêm' : 'Cập nhật'}
        </Button>,
      ]}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="soQuyetDinh"
          label="Số quyết định"
          rules={[{ required: true, message: 'Vui lòng nhập số quyết định' }]}
        >
          <Input placeholder="Nhập số quyết định" />
        </Form.Item>

        <Form.Item
          name="ngayBanHanh"
          label="Ngày ban hành"
          rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành' }]}
        >
          <DatePicker 
            locale={locale}
            placeholder="Chọn ngày ban hành" 
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
          />
        </Form.Item>

        <Form.Item
          name="trichYeu"
          label="Trích yếu"
          rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}
        >
          <TextArea 
            placeholder="Nhập trích yếu quyết định" 
            autoSize={{ minRows: 3, maxRows: 6 }}
          />
        </Form.Item>

        <Form.Item
          name="soVanBangId"
          label="Sổ văn bằng"
          rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}
        >
          <Select placeholder="Chọn sổ văn bằng">
            {danhSachSoVanBang.map((soVanBang) => (
              <Select.Option key={soVanBang.id} value={soVanBang.id}>
                {soVanBang.ten}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuyetDinhModal; 