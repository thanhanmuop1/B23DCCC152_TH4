import React from 'react';
import { Card, Row, Col, Input, Button, Space, Divider } from 'antd';
import { SearchOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons';

const { Search } = Input;

interface SearchToolbarProps {
  searchKeyword: string;
  onSearch: (value: string) => void;
  onResetSearch: () => void;
  onAdvancedSearch: () => void;
  resultCount: number;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  searchKeyword,
  onSearch,
  onResetSearch,
  onAdvancedSearch,
  resultCount,
}) => {
  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={16}>
        <Col span={16}>
          <Search
            placeholder="Tìm kiếm theo số hiệu văn bằng, mã sinh viên, họ tên, số vào sổ..."
            value={searchKeyword}
            onChange={(e) => onSearch(e.target.value)}
            onSearch={onSearch}
            enterButton={<SearchOutlined />}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={8}>
          <Space>
            <Button 
              icon={<ClearOutlined />} 
              onClick={onResetSearch}
              disabled={!searchKeyword}
            >
              Xóa tìm kiếm
            </Button>
            <Button 
              type="primary" 
              icon={<FilterOutlined />} 
              onClick={onAdvancedSearch}
            >
              Tìm kiếm nâng cao
            </Button>
          </Space>
        </Col>
      </Row>
      <Divider style={{ margin: '12px 0' }} />
      <div>
        <strong>Kết quả tìm kiếm:</strong> {resultCount} văn bằng
        {searchKeyword && <span> với từ khóa "<strong>{searchKeyword}</strong>"</span>}
      </div>
    </Card>
  );
};

export default SearchToolbar; 