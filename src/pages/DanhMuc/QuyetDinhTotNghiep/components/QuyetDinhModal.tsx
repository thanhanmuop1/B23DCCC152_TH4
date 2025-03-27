import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Row, Col } from 'antd';
import { QuyetDinhTotNghiep } from '@/models/Vanbang/quyetdinhtotnghiep';
import { SoVanBang } from '@/models/Vanbang/sovanbang';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';

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

  const title = type === 'add' ? 'Thêm quyết định tốt nghiệp mới' : 'Cập nhật quyết định tốt nghiệp';

  return (
    <Modal
      title={title}
      visible={visible}
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
        initialValues={{ ngayBanHanh: moment() }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="soQuyetDinh"
              label="Số quyết định"
              rules={[{ required: true, message: 'Vui lòng nhập số quyết định!' }]}
            >
              <Input placeholder="Nhập số quyết định" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="ngayBanHanh"
              label="Ngày ban hành"
              rules={[{ required: true, message: 'Vui lòng chọn ngày ban hành!' }]}
            >
              <DatePicker 
                format="DD/MM/YYYY" 
                style={{ width: '100%' }} 
                placeholder="Chọn ngày ban hành"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="soVanBangId"
          label="Sổ văn bằng"
          rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng!' }]}
        >
          <Select placeholder="Chọn sổ văn bằng">
            {danhSachSoVanBang.map(so => (
              <Select.Option key={so.id} value={so.id}>
                Sổ văn bằng năm {so.nam} ({so.id})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="trichYeu"
          label="Trích yếu"
          rules={[{ required: true, message: 'Vui lòng nhập trích yếu!' }]}
        >
          <TextArea
            placeholder="Nhập trích yếu nội dung quyết định"
            rows={4}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuyetDinhModal; 