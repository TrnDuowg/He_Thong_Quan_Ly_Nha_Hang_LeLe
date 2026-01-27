import React from 'react';
import { Layout, Menu, Avatar, Typography, Button, Space, theme, Modal } from 'antd'; // Thêm Modal
import { 
  AppstoreOutlined, 
  ShopOutlined, 
  DatabaseOutlined, 
  BarChartOutlined, 
  TeamOutlined, 
  FileSyncOutlined, 
  SettingOutlined, 
  QuestionCircleOutlined,
  LogoutOutlined,
  GiftOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Sider, Content } = Layout;
const { Text, Title } = Typography;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Lấy thông tin user từ LocalStorage (Để hiển thị tên thật)
  const user = JSON.parse(localStorage.getItem('user')) || { full_name: 'Admin', role: 'Quản trị' };

  // 2. Hàm xử lý Đăng Xuất
  const handleLogout = () => {
    Modal.confirm({
      title: 'Xác nhận đăng xuất',
      content: 'Bạn có chắc chắn muốn thoát khỏi hệ thống?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: () => {
        // Xóa dữ liệu đăng nhập
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('current_shift_id');
        
        // Chuyển về trang đăng nhập
        navigate('/pos/login');
      }
    });
  };

  const menuItems = [
    { type: 'group', label: 'MENU CHÍNH', children: [
        { key: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard Tổng Quan' },
        { key: '/admin/products', icon: <ShopOutlined />, label: 'Quản Lý Sản Phẩm' },
        { key: '/admin/combo', icon: <DatabaseOutlined />, label: 'Quản Lý Combo' },
        { key: '/admin/promotions', icon: <GiftOutlined />, label: 'Quản Lý Khuyến Mãi' }, 
        { key: '/admin/revenue', icon: <BarChartOutlined />, label: 'Báo Cáo Doanh Thu' },
        { key: '/admin/staff', icon: <TeamOutlined />, label: 'QL Nhân Viên & Phân Quyền' },
        { key: '/admin/schedule', icon: <CalendarOutlined />, label: 'Lịch Làm Việc' },
        { key: '/admin/shift', icon: <FileSyncOutlined />, label: 'Đối Soát Ca Làm Việc' },
    ]},
    { type: 'group', label: 'HỆ THỐNG', children: [
        // Thêm '/admin' vào trước đường dẫn
        { key: '/admin/settings', icon: <SettingOutlined />, label: 'Cài đặt' }, 
        { key: '/admin/help', icon: <QuestionCircleOutlined />, label: 'Trợ giúp' },
    ]}
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={260} theme="light" style={{ borderRight: '1px solid #f0f0f0', position: 'fixed', height: '100vh', left: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#1890ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="logo" width={20} />
          </div>
          <div>
            <Title level={5} style={{ margin: 0, color: '#1f1f1f' }}>FastFood Lele</Title>
            <Text type="secondary" style={{ fontSize: 11 }}>Portal Quản lý</Text>
          </div>
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/admin/dashboard']}
          onClick={(item) => navigate(item.key)}
          style={{ borderRight: 0, height: 'calc(100vh - 160px)', overflowY: 'auto' }} // Fix chiều cao để scroll menu nếu dài
          items={menuItems}
        />

        {/* Bottom Profile */}
        <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '20px 24px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>
            <Space>
                {/* Avatar tự động theo tên */}
                <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
                    {user.full_name?.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ marginLeft: 8 }}>
                    <Text strong style={{ display: 'block', maxWidth: '120px' }} ellipsis>
                        {user.full_name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {user.role === 'admin' ? 'Quản trị viên' : user.role}
                    </Text>
                </div>
                
                {/* Nút Đăng Xuất đã gắn sự kiện */}
                <Button 
                    type="text" 
                    icon={<LogoutOutlined />} 
                    style={{ marginLeft: 5, color: 'gray' }} 
                    danger
                    onClick={handleLogout} 
                    title="Đăng xuất"
                />
            </Space>
        </div>
      </Sider>

      <Layout style={{ marginLeft: 260, background: '#f5f7fa' }}>
        <Content style={{ margin: '24px', overflow: 'initial' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;