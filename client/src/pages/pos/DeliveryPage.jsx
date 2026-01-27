import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. IMPORT ĐẦY ĐỦ CÁC THÀNH PHẦN ANT DESIGN (Thêm Row, Col)
import { 
  Tabs, Card, Typography, Tag, Button, Badge, Drawer, 
  List, Steps, Modal, Space, Divider, Avatar, Spin, Row, Col 
} from 'antd';
import { 
  CarFilled, EnvironmentFilled, PhoneFilled, CheckCircleFilled, 
  ArrowLeftOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DeliveryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'current'
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // State dữ liệu thật
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. LOAD API ---
  const fetchDeliveryOrders = async () => {
    setLoading(true);
    try {
        const res = await fetch('http://localhost:3000/api/orders/delivery');
        const data = await res.json();
        
        // Map dữ liệu từ Backend sang format của UI Antd
        const formatted = data.map(o => ({
            id: o.id,
            displayId: o.order_code,
            name: o.customer_name || 'Khách lẻ',
            addr: o.address || 'Tại quầy',
            dist: '---', 
            cod: Number(o.final_amount),
            status: o.status, // 'processing' | 'delivering'
            items: ['Xem chi tiết trong bill'] 
        }));
        setOrders(formatted);
    } catch (error) {
        console.error("Lỗi tải đơn giao hàng:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { fetchDeliveryOrders(); }, []);

  // Phân loại đơn
  const newOrders = orders.filter(o => o.status === 'processing'); // Đơn Bếp đang làm -> Chờ giao
  const deliveringOrders = orders.filter(o => o.status === 'delivering'); // Đơn đang đi

  // --- 2. HÀNH ĐỘNG ---
  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setOpenDrawer(true);
  };

  // Nhận đơn (Processing -> Delivering)
  const handleAccept = () => {
    Modal.confirm({
      title: 'Nhận giao đơn này?',
      content: 'Trạng thái sẽ chuyển sang Đang giao.',
      onOk: async () => {
        try {
            await fetch(`http://localhost:3000/api/orders/${selectedOrder.id}/status`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ status: 'delivering' })
            });
            setOpenDrawer(false);
            setActiveTab('current');
            fetchDeliveryOrders();
        } catch (e) { alert("Lỗi cập nhật"); }
      }
    });
  };

  // Hoàn thành (Delivering -> Completed)
  const handleComplete = () => {
    Modal.confirm({
      title: 'Xác nhận giao thành công?',
      content: `Đã thu đủ ${selectedOrder.cod.toLocaleString()}đ?`,
      onOk: async () => {
        try {
            await fetch(`http://localhost:3000/api/orders/${selectedOrder.id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'completed' })
            });
            setOpenDrawer(false);
            fetchDeliveryOrders();
        } catch (e) { alert("Lỗi cập nhật"); }
      }
    });
  };

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: '#1890ff', padding: '15px 20px', color: '#fff', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space onClick={() => navigate('/pos/dashboard')} style={{cursor: 'pointer'}}>
                <ArrowLeftOutlined style={{fontSize: 20}} />
                <Title level={4} style={{ color: '#fff', margin: 0 }}>Giao Hàng</Title>
            </Space>
            <Avatar src="https://ui-avatars.com/api/?name=Shipper" />
        </div>
        <div style={{ marginTop: 15 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '5px 15px', borderRadius: 20, display: 'inline-block' }}>
                COD cần thu: <b>{deliveringOrders.reduce((sum, o)=>sum+o.cod, 0).toLocaleString()}đ</b>
            </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 15 }}>
        {loading ? <div style={{textAlign:'center', marginTop: 50}}><Spin size="large"/></div> : (
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          type="card"
          items={[
            {
                key: 'new',
                label: <Badge count={newOrders.length} offset={[10,0]}>Đơn Mới</Badge>,
                children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {newOrders.length === 0 && <div style={{textAlign:'center', color:'#999', marginTop: 20}}>Không có đơn mới</div>}
                        {newOrders.map(item => (
                            <Card key={item.id} hoverable styles={{ body: { padding: 15 } }} onClick={() => handleOpenDetail(item)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                    <Tag color="orange">Chờ giao</Tag>
                                    <Text type="secondary">{item.displayId}</Text>
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
                        {deliveringOrders.length === 0 && <div style={{textAlign:'center', color:'#999', marginTop: 20}}>Chưa nhận đơn nào</div>}
                        {deliveringOrders.map(item => (
                            <Card key={item.id} hoverable style={{ border: '1px solid #1890ff' }} styles={{ body: { padding: 15 } }} onClick={() => handleOpenDetail(item)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Tag color="processing" icon={<CarFilled />}>Đang đi</Tag>
                                    <Text>{item.displayId}</Text>
                                </div>
                                <Title level={5} style={{ margin: '8px 0' }}>{item.addr}</Title>
                                <Steps size="small" current={1} items={[{title:'Lấy'}, {title:'Giao'}, {title:'Xong'}]} />
                            </Card>
                        ))}
                    </div>
                )
            }
          ]}
        />
        )}
      </div>

      {/* Drawer Detail */}
      <Drawer
        title="Chi Tiết Giao Hàng"
        placement="bottom"
        height="85vh" 
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
      >
        {selectedOrder && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <Title level={2} style={{ margin: 0 }}>{selectedOrder.cod.toLocaleString()}đ</Title>
                    <Text type="secondary">Tổng tiền thu hộ (COD)</Text>
                </div>

                <Card style={{ background: '#f9f9f9', marginBottom: 20 }} bordered={false}>
                    <Space align="start">
                        <EnvironmentFilled style={{ color: '#1890ff', fontSize: 20, marginTop: 5 }} />
                        <div>
                            <Text type="secondary">Địa chỉ:</Text>
                            <Title level={5} style={{ margin: 0 }}>{selectedOrder.addr}</Title>
                            <Text strong>{selectedOrder.name}</Text>
                        </div>
                    </Space>
                    <Divider style={{ margin: '12px 0' }} />
                    {/* Đây là đoạn bị lỗi trước đó vì thiếu Row/Col */}
                    <Row gutter={10}>
                        <Col span={12}><Button block icon={<PhoneFilled />} type="primary">Gọi điện</Button></Col>
                        <Col span={12}><Button block>Chỉ đường</Button></Col>
                    </Row>
                </Card>

                <div style={{ marginTop: 'auto' }}>
                    {selectedOrder.status === 'processing' ? (
                        <Button type="primary" block size="large" onClick={handleAccept} style={{ height: 50, fontSize: 18 }}>NHẬN GIAO ĐƠN</Button>
                    ) : (
                        <Button block size="large" onClick={handleComplete} style={{ height: 50, background: '#52c41a', color: '#fff', fontSize: 18, border: 'none' }}>XÁC NHẬN HOÀN THÀNH</Button>
                    )}
                </div>
            </div>
        )}
      </Drawer>
    </div>
  );
};

export default DeliveryPage;