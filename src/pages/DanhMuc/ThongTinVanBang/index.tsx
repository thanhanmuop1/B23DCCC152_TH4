import React, { useState, useEffect } from 'react';
import { 
  PageContainer, 
  ProTable,
} from '@ant-design/pro-components';
import { Button, Input, Space, Popconfirm, message, Drawer, Form, DatePicker, Row, Col, InputNumber, Card, Divider } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import { useInitModel, ThongTinVanBang, QuyetDinhTotNghiep } from '../../../models/Vanbang/thongtinvanbang';
import { TruongThongTin } from '../../../models/Vanbang/truongthongtin';
import VanBangModal from './components/VanBangModal';
import VanBangDetail from './components/VanBangDetail';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');
const { Search } = Input;

const ThongTinVanBangPage: React.FC = () => {
  const {
    danhSachVanBang,
    setDanhSachVanBang,
    loading,
    setLoading,
    vanBangSelected,
    setVanBangSelected,
    visibleModal,
    setVisibleModal,
    modalType,
    setModalType,
    danhSachQuyetDinh,
    setDanhSachQuyetDinh,
    soVaoSoMoi,
    setSoVaoSoMoi,
    themVanBang,
    capNhatVanBang,
    xoaVanBang,
    timKiemVanBang,
  } = useInitModel<ThongTinVanBang>();

  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [visibleSearchForm, setVisibleSearchForm] = useState<boolean>(false);
  const [danhSachTruongThongTin, setDanhSachTruongThongTin] = useState<TruongThongTin[]>([]);
  const [searchForm] = Form.useForm();
  const [simpleSearchForm] = Form.useForm();
  const [danhSachVanBangGoc, setDanhSachVanBangGoc] = useState<ThongTinVanBang[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Giả lập dữ liệu ban đầu
  useEffect(() => {
    // Giả lập dữ liệu quyết định tốt nghiệp
    const mockQuyetDinh: QuyetDinhTotNghiep[] = [
      {
        id: '1',
        soQuyetDinh: 'QĐ-12345/2023',
        ngayBanHanh: new Date('2023-06-15'),
        trichYeu: 'Quyết định công nhận tốt nghiệp cho sinh viên khóa 2020',
      },
      {
        id: '2',
        soQuyetDinh: 'QĐ-67890/2023',
        ngayBanHanh: new Date('2023-07-20'),
        trichYeu: 'Quyết định công nhận tốt nghiệp cho sinh viên khóa 2021 đợt 1',
      },
    ];
    setDanhSachQuyetDinh(mockQuyetDinh);

    // Giả lập dữ liệu trường thông tin
    const mockTruongThongTin: TruongThongTin[] = [
      {
        id: '1',
        tenTruong: 'Điểm trung bình',
        kieuDuLieu: 'Number',
        batBuoc: true,
      },
      {
        id: '2',
        tenTruong: 'Xếp loại',
        kieuDuLieu: 'String',
        batBuoc: true,
      },
      {
        id: '3',
        tenTruong: 'Nơi sinh',
        kieuDuLieu: 'String',
        batBuoc: false,
      },
      {
        id: '4',
        tenTruong: 'Ngày cấp',
        kieuDuLieu: 'Date',
        batBuoc: true,
      },
    ];
    setDanhSachTruongThongTin(mockTruongThongTin);

    // Giả lập dữ liệu văn bằng
    const mockData: ThongTinVanBang[] = [
      {
        id: '1',
        soVaoSo: 1,
        soHieuVanBang: 'VB-12345/2023',
        maSinhVien: 'SV001',
        hoTen: 'Nguyễn Văn A',
        ngaySinh: new Date('2000-05-15'),
        quyetDinhId: '1',
        tenQuyetDinh: 'QĐ-12345/2023',
        truongThongTin: [
          {
            truongThongTinId: '1',
            tenTruong: 'Điểm trung bình',
            kieuDuLieu: 'Number',
            giaTri: 8.5,
          },
          {
            truongThongTinId: '2',
            tenTruong: 'Xếp loại',
            kieuDuLieu: 'String',
            giaTri: 'Giỏi',
          },
          {
            truongThongTinId: '3',
            tenTruong: 'Nơi sinh',
            kieuDuLieu: 'String',
            giaTri: 'Hà Nội',
          },
          {
            truongThongTinId: '4',
            tenTruong: 'Ngày cấp',
            kieuDuLieu: 'Date',
            giaTri: new Date('2023-06-30'),
          },
        ],
      },
      {
        id: '2',
        soVaoSo: 2,
        soHieuVanBang: 'VB-12346/2023',
        maSinhVien: 'SV002',
        hoTen: 'Trần Thị B',
        ngaySinh: new Date('2001-03-20'),
        quyetDinhId: '1',
        tenQuyetDinh: 'QĐ-12345/2023',
        truongThongTin: [
          {
            truongThongTinId: '1',
            tenTruong: 'Điểm trung bình',
            kieuDuLieu: 'Number',
            giaTri: 7.8,
          },
          {
            truongThongTinId: '2',
            tenTruong: 'Xếp loại',
            kieuDuLieu: 'String',
            giaTri: 'Khá',
          },
          {
            truongThongTinId: '3',
            tenTruong: 'Nơi sinh',
            kieuDuLieu: 'String',
            giaTri: 'TP.HCM',
          },
          {
            truongThongTinId: '4',
            tenTruong: 'Ngày cấp',
            kieuDuLieu: 'Date',
            giaTri: new Date('2023-06-30'),
          },
        ],
      },
      {
        id: '3',
        soVaoSo: 3,
        soHieuVanBang: 'VB-12347/2023',
        maSinhVien: 'SV003',
        hoTen: 'Lê Văn C',
        ngaySinh: new Date('1999-11-10'),
        quyetDinhId: '2',
        tenQuyetDinh: 'QĐ-67890/2023',
        truongThongTin: [
          {
            truongThongTinId: '1',
            tenTruong: 'Điểm trung bình',
            kieuDuLieu: 'Number',
            giaTri: 9.2,
          },
          {
            truongThongTinId: '2',
            tenTruong: 'Xếp loại',
            kieuDuLieu: 'String',
            giaTri: 'Xuất sắc',
          },
          {
            truongThongTinId: '3',
            tenTruong: 'Nơi sinh',
            kieuDuLieu: 'String',
            giaTri: 'Đà Nẵng',
          },
          {
            truongThongTinId: '4',
            tenTruong: 'Ngày cấp',
            kieuDuLieu: 'Date',
            giaTri: new Date('2023-08-15'),
          },
        ],
      },
    ];
    
    setDanhSachVanBang(mockData);
    setDanhSachVanBangGoc(mockData);
    
    // Set số vào sổ mới nhất
    setSoVaoSoMoi(mockData.length + 1);
  }, [setDanhSachVanBang, setDanhSachQuyetDinh, setSoVaoSoMoi]);

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setVanBangSelected(null);
    setModalType('add');
    setVisibleModal(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (record: ThongTinVanBang) => {
    setVanBangSelected(record);
    setModalType('edit');
    setVisibleModal(true);
  };

  // Xử lý submit form modal
  const handleSubmitModal = (values: any) => {
    if (modalType === 'add') {
      themVanBang(values);
    } else {
      capNhatVanBang(values as ThongTinVanBang);
    }
    setVisibleModal(false);
  };

  // Mở drawer xem chi tiết
  const handleViewDetail = (record: ThongTinVanBang) => {
    setVanBangSelected(record);
    setVisibleDetail(true);
  };

  // Xử lý tìm kiếm nâng cao
  const handleAdvancedSearch = () => {
    setVisibleSearchForm(true);
  };

  // Xử lý submit form tìm kiếm
  const handleSubmitSearch = async () => {
    try {
      const values = await searchForm.validateFields();
      
      // Chuyển đổi ngày thành Date object
      const searchParams = {
        ...values,
        ngaySinh: values.ngaySinh ? values.ngaySinh.toDate() : undefined,
      };
      
      const results = timKiemVanBang(searchParams);
      if (results && Array.isArray(results)) {
        setDanhSachVanBang(results as ThongTinVanBang[]);
      }
      
      setVisibleSearchForm(false);
    } catch (error) {
      console.error('Lỗi khi xác thực form tìm kiếm:', error);
    }
  };

  // Reset form tìm kiếm
  const handleResetSearch = () => {
    searchForm.resetFields();
    setDanhSachVanBang(danhSachVanBangGoc);
  };

  // Xử lý tìm kiếm nhanh
  const handleSimpleSearch = (value: string) => {
    setSearchKeyword(value);
    
    if (!value.trim()) {
      setDanhSachVanBang(danhSachVanBangGoc);
      return;
    }

    const keyword = value.toLowerCase().trim();
    const filteredData = danhSachVanBangGoc.filter(item => 
      item.soHieuVanBang.toLowerCase().includes(keyword) ||
      item.maSinhVien.toLowerCase().includes(keyword) ||
      item.hoTen.toLowerCase().includes(keyword) ||
      item.soVaoSo.toString().includes(keyword)
    );
    
    setDanhSachVanBang(filteredData);
  };

  // Xử lý reset tìm kiếm nhanh
  const handleResetSimpleSearch = () => {
    setSearchKeyword('');
    setDanhSachVanBang(danhSachVanBangGoc);
  };

  // Định nghĩa cột cho bảng
  const columns: TableColumnsType<ThongTinVanBang> = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_text, _record, index) => index + 1,
    },
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      key: 'soVaoSo',
      width: 100,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'soHieuVanBang',
      key: 'soHieuVanBang',
      width: 160,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      key: 'maSinhVien',
      width: 120,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      width: 180,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      key: 'ngaySinh',
      width: 120,
      render: (value) => (value ? moment(value).format('DD/MM/YYYY') : ''),
    },
    {
      title: 'Quyết định tốt nghiệp',
      dataIndex: 'tenQuyetDinh',
      key: 'tenQuyetDinh',
      width: 150,
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEditModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa thông tin văn bằng này?"
            onConfirm={() => xoaVanBang(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý thông tin văn bằng">
      {/* Phần tìm kiếm nhanh */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={16}>
            <Search
              placeholder="Tìm kiếm theo số hiệu văn bằng, mã sinh viên, họ tên, số vào sổ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSimpleSearch}
              enterButton={<SearchOutlined />}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <Space>
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleResetSimpleSearch}
                disabled={!searchKeyword}
              >
                Xóa tìm kiếm
              </Button>
              <Button 
                type="primary" 
                icon={<FilterOutlined />} 
                onClick={handleAdvancedSearch}
              >
                Tìm kiếm nâng cao
              </Button>
            </Space>
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <div>
          <strong>Kết quả tìm kiếm:</strong> {danhSachVanBang.length} văn bằng
          {searchKeyword && <span> với từ khóa "<strong>{searchKeyword}</strong>"</span>}
        </div>
      </Card>

      <ProTable<ThongTinVanBang>
        columns={columns}
        dataSource={danhSachVanBang}
        rowKey="id"
        search={false}
        dateFormatter="string"
        headerTitle="Danh sách thông tin văn bằng"
        loading={loading}
        options={{
          density: true,
          fullScreen: true,
          reload: false,
          setting: true,
        }}
        toolbar={{
          actions: [
            <Button
              key="button"
              icon={<PlusOutlined />}
              type="primary"
              onClick={handleOpenAddModal}
            >
              Thêm mới
            </Button>,
          ],
        }}
        pagination={{
          pageSize: 10,
          showTotal: (total: number) => `Tổng cộng ${total} văn bằng`,
        }}
        scroll={{ x: 1100 }}
      />

      {/* Modal thêm/sửa thông tin văn bằng */}
      <VanBangModal
        open={visibleModal}
        type={modalType}
        vanBangSelected={vanBangSelected}
        danhSachQuyetDinh={danhSachQuyetDinh}
        danhSachTruongThongTin={danhSachTruongThongTin}
        soVaoSoMoi={soVaoSoMoi}
        onCancel={() => setVisibleModal(false)}
        onSubmit={handleSubmitModal}
      />

      {/* Drawer xem chi tiết */}
      <Drawer
        title="Chi tiết thông tin văn bằng"
        width={700}
        placement="right"
        onClose={() => setVisibleDetail(false)}
        visible={visibleDetail}
      >
        {vanBangSelected && (
          <VanBangDetail 
            vanBang={vanBangSelected} 
            danhSachQuyetDinh={danhSachQuyetDinh} 
          />
        )}
      </Drawer>

      {/* Drawer tìm kiếm nâng cao */}
      <Drawer
        title="Tìm kiếm thông tin văn bằng"
        width={500}
        placement="right"
        onClose={() => setVisibleSearchForm(false)}
        visible={visibleSearchForm}
        extra={
          <Space>
            <Button onClick={handleResetSearch}>Đặt lại</Button>
            <Button type="primary" onClick={handleSubmitSearch}>
              Tìm kiếm
            </Button>
          </Space>
        }
      >
        <Form
          form={searchForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="soHieuVanBang"
                label="Số hiệu văn bằng"
              >
                <Input placeholder="Nhập số hiệu văn bằng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="soVaoSo"
                label="Số vào sổ"
              >
                <InputNumber style={{ width: '100%' }} placeholder="Nhập số vào sổ" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maSinhVien"
                label="Mã sinh viên"
              >
                <Input placeholder="Nhập mã sinh viên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hoTen"
                label="Họ tên"
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="ngaySinh"
                label="Ngày sinh"
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ marginTop: 16, color: 'red' }}>
            * Lưu ý: Cần nhập ít nhất 2 tiêu chí để tìm kiếm.
          </div>
        </Form>
      </Drawer>
    </PageContainer>
  );
};

export default ThongTinVanBangPage; 