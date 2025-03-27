import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface DashboardCardProps {
  title: string;
  value: number;
  prefix: React.ReactNode;
  suffix?: string;
  changeValue?: number;
  changeText?: string;
  precision?: number;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  changeValue = 0,
  changeText,
  precision = 0,
  loading = false,
}) => {
  const color = changeValue >= 0 ? '#3f8600' : '#cf1322';

  return (
    <Card>
      <Statistic
        title={title}
        value={value}
        precision={precision}
        valueStyle={{ color }}
        prefix={prefix}
        suffix={
          suffix || changeValue ? (
            <span style={{ fontSize: '14px', color }}>
              {changeValue !== undefined && (
                <>
                  {changeValue >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {' '}{Math.abs(changeValue)}%
                </>
              )}
              {' '}{changeText || ''}
            </span>
          ) : undefined
        }
        loading={loading}
      />
    </Card>
  );
};

export default DashboardCard; 