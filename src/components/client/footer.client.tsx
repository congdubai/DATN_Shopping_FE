import { Layout, Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, TwitterOutlined, YoutubeOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Footer } from 'antd/lib/layout/layout';

const { Title, Text } = Typography;

const AppFooter: React.FC = () => {
    return (
        <Row style={{ background: "#000", color: "#ccc", padding: "40px 0", maxWidth: "100%", overflow: "hidden" }}>
            <Col span={24} style={{ paddingBottom: 16, borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}>
                <Row gutter={[16, 16]} justify="space-between">
                    <Col xs={24} md={12} lg={6}>
                        <Title level={3} style={{ color: "#1890ff", marginBottom: 0 }}>Shopping</Title>
                        <Text type="secondary">Clothes</Text>
                    </Col>
                    <Col xs={24} md={12} lg={6} style={{ textAlign: "right" }}>
                        <Space size="middle">
                            <a href="#"><TwitterOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                            <a href="#"><FacebookOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                            <a href="#"><YoutubeOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                            <a href="#"><LinkedinOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                        </Space>
                    </Col>
                </Row>
            </Col>

            <Col span={24} style={{ paddingTop: 20 }}>
                <Row justify="center" gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Title level={4} style={{ color: "white" }}>Liên hệ</Title>
                        <Text>Địa chỉ: 132 Cầu Diễn, Quận Bắc Từ Liêm, Hà Nội</Text><br />
                        <Text>Email: doanhvipnvn@gmail.com</Text><br />
                        <Text>Số điện thoại: 0988035928</Text><br />
                        <Text>Mã QR Donate</Text>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "center" }}>
                        <img src="/images/products/steaven_logo.webp" alt="Logo Steaven"
                            style={{ maxWidth: "100%", height: "auto", display: "block" }} />
                    </Col>
                </Row>
            </Col>

            <Col span={24} style={{ textAlign: "center", marginTop: 20 }}>
                <Text style={{ color: "#fff" }}>© Clothes Steaven, Hân hạnh đồng hành cùng bạn.</Text><br />
                <Text style={{ color: "#fff" }}>
                    Designed By <a href="https://www.facebook.com/doanhdubaiks" style={{ color: "#1890ff" }}>Vũ Đức Doanh</a> - Nhóm 7
                </Text>
            </Col>
        </Row>
    );
};

export default AppFooter;