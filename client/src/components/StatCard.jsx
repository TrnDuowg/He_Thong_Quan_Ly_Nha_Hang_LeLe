import React from 'react';
import { Card, Typography } from 'antd';
const { Title, Text } = Typography;

const StatCard = ({ title, value, icon, color, suffix, trend }) => (
  <Card bordered={false} style={{ borderRadius: 12, height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}20`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        {icon}
      </div>
      {trend && <span style={{ color: trend > 0 ? '#52c41a' : '#f5222d', fontWeight: 'bold' }}>{trend > 0 ? '+' : ''}{trend}%</span>}
    </div>
    <Text type="secondary">{title}</Text>
    <Title level={3} style={{ margin: '4px 0' }}>{value} <span style={{ fontSize: 14, color: '#999', fontWeight: 'normal' }}>{suffix}</span></Title>
  </Card>
);
export default StatCard;