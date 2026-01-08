// src/pages/pos/DeliveryPage.jsx
import React, { useState } from 'react';
import { 
  Tabs, Card, Typography, Tag, Button, Badge, Drawer, 
  List, Steps, Modal, Space, Divider, Avatar 
} from 'antd';
import { 
  CarFilled, EnvironmentFilled, PhoneFilled, CheckCircleFilled, 
  WalletFilled, ClockCircleOutlined, ArrowLeftOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ ---
const NEW_ORDERS = [
  { id: '#1021', name: 'Chị Lan', addr: '123 Nguyễn Trãi, Q1', dist: '2.5km', cod: 125000, items: ['2x Burger Bò', '1x Coca'], status: 'ready' },
  { id: '#1022', name: 'Anh Nam', addr: 'Times City, T11', dist: '4.1km', cod: 340000, items: ['1x Combo Gà', '2x Pepsi'], status: 'ready' },
];

const MY_ORDERS = [
  { id: '#1019', name: 'Nguyễn Văn A', phone: '0909123456', addr: '88 Láng Hạ', dist: '1.2km', cod: 0, items: ['1x Pizza'], step: 1 },
];

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mở chi tiết đơn
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDrawer(true);
  };

  // Hành động nhận đơn
  const handleAccept = () => {
    Modal.confirm({
      title: 'Nhận đơn hàng này?',
      content: 'Bạn chịu trách nhiệm giao đơn này trong 30 phút.',
      onOk: () => {
        setOpenDrawer(false);
        setActiveTab('current');
      }
    });
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: 60 }}>
      {/* HEADER MOBILE */}
      <div style={{ background: '#1890ff', padding: '15px 20px', color: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space onClick={() => navigate('/pos/dashboard')} style={{cursor: 'pointer'}}>
                <ArrowLeftOutlined style={{fontSize: 20}} />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>Giao Hàng</Title>
            </Space>
            <Avatar src="https://i.pravatar.cc/150?img=12" />
        </div>
        {/* Thống kê nhanh */}
        <div style={{ display: 'flex', gap: 15, marginTop: 15, overflowX: 'auto' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                COD: <b>850k</b>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                Đã giao: <b>12</b>
            </div>
        </div>
      </div>

      {/* TABS NỘI DUNG */}
      <div style={{ padding: 15 }}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          items={[
            {
                key: 'new',
                label: <Badge count={NEW_ORDERS.length} offset={[10,0]}>Đơn Mới</Badge>,
                children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {NEW_ORDERS.map(item => (
                            <Card key={item.id} bordered={false} bodyStyle={{ padding: 15 }} onClick={() => handleOpenDetail(item)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <Tag color="green">Sẵn sàng</Tag>
                                    <Text type="secondary">{item.dist}</Text>
                                </div>
                                <Title level={5} style={{ margin: '5px 0' }}>{item.addr}</Title>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>{item.name}</Text>
                                    <Text strong style={{ color: '#1890ff' }}>Thu: {item.cod.toLocaleString()}đ</Text>
                                </div>
                            </Card>
                        ))}
                    </div>
                )
            },
            {
                key: 'current',
                label: 'Đang Giao',
                children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {MY_ORDERS.map(item => (
                            <Card key={item.id} bordered={false} style={{ border: '1px solid #1890ff' }} bodyStyle={{ padding: 15 }} onClick={() => handleOpenDetail(item)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Tag color="processing" icon={<CarFilled />}>Đang đi</Tag>
                                    <Text>{item.dist}</Text>
                                </div>
                                <Title level={5} style={{ margin: '8px 0' }}>{item.addr}</Title>
                                <Steps size="small" current={item.step} items={[{title:'Lấy'}, {title:'Giao'}, {title:'Xong'}]} />
                            </Card>
                        ))}
                    </div>
                )
            },
            { key: 'history', label: 'Lịch Sử', children: <div style={{textAlign:'center', marginTop: 30, color:'#999'}}>Chưa có lịch sử</div> }
          ]}
        />
      </div>

      {/* MODAL CHI TIẾT (DRAWER) */}
      <Drawer
        title="Chi Tiết Đơn Hàng"
        placement="bottom"
        height="85vh"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        {selectedOrder && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={2} style={{ margin: 0 }}>{selectedOrder.cod.toLocaleString()}đ</Title>
                    <Text type="secondary">{selectedOrder.cod > 0 ? 'Cần thu tiền mặt' : 'Đã thanh toán online'}</Text>
                </div>

                <Card style={{ background: '#f9f9f9', marginBottom: 20 }} bordered={false}>
                    <Space align="start">
                        <EnvironmentFilled style={{ color: '#1890ff', fontSize: 20, marginTop: 5 }} />
                        <div>
                            <Text type="secondary">Giao đến:</Text>
                            <Title level={5} style={{ margin: 0 }}>{selectedOrder.addr}</Title>
                            <Text strong>{selectedOrder.name}</Text>
                        </div>
                    </Space>
                    <Divider style={{ margin: '12px 0' }} />
                    <Row gutter={10}>
                        <Col span={12}><Button block icon={<PhoneFilled />} type="primary">Gọi điện</Button></Col>
                        <Col span={12}><Button block>Chỉ đường</Button></Col>
                    </Row>
                </Card>

                <Title level={5}>Món ăn ({selectedOrder.items.length})</Title>
                <List
                    size="small"
                    dataSource={selectedOrder.items}
                    renderItem={it => <List.Item><CheckCircleFilled style={{color:'#52c41a', marginRight: 8}}/> {it}</List.Item>}
                />

                <div style={{ marginTop: 'auto', paddingTop: 20 }}>
                    {activeTab === 'new' ? (
                        <Button type="primary" block size="large" onClick={handleAccept} style={{ height: 50, fontSize: 18 }}>NHẬN ĐƠN NÀY</Button>
                    ) : (
                        <Button block size="large" style={{ height: 50, background: '#52c41a', color: '#fff', fontSize: 18 }}>XÁC NHẬN GIAO XONG</Button>
                    )}
                </div>
            </div>
        )}
      </Drawer>
    </div>
  );
};
import { Row, Col } from 'antd';
export default DeliveryPage;