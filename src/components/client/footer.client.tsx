import { Layout, Row, Col, Typography, Space } from 'antd';
import { FacebookOutlined, TwitterOutlined, YoutubeOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Footer } from 'antd/lib/layout/layout';

const { Title, Text } = Typography;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AppFooter: React.FC = () => {
    return (
        <Row style={{ background: "#000", color: "#ccc", padding: "20px 0", maxWidth: "100%", overflow: "hidden" }}>
            {/* Phần đầu với logo và mạng xã hội */}
            <Col span={24} style={{ paddingBottom: 16, borderBottom: "1px solid rgba(226, 175, 24, 0.5)" }}>
                <Row justify="space-around" align="middle">
                    <Col xs={24} md={12} lg={10} style={{ textAlign: "left" }}>
                        <Title level={3} style={{ color: "#FFB41D", marginBottom: 5, fontSize: 32 }}>CTStore</Title>
                        <Text type="secondary">Clothes</Text>
                    </Col>
                    <Col xs={24} md={12} lg={10} style={{ textAlign: "right" }}>
                        <Space size="middle">
                            <a href="#"><TwitterOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                            <a href="#"><FacebookOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                            <a href="#"><YoutubeOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                            <a href="#"><LinkedinOutlined style={{ fontSize: 24, color: "#ccc" }} /></a>
                        </Space>
                    </Col>
                </Row>
            </Col>

            {/* Phần nội dung chính */}
            <Col span={24} style={{ paddingTop: 30 }}>
                <Row justify="center" gutter={[16, 16]}>
                    <Col xs={24} md={9} style={{ textAlign: "left", paddingLeft: 10 }}>
                        <Title level={4} style={{ color: "white" }}>Liên hệ</Title>
                        <Text style={{ color: "white" }}>Địa chỉ: 132 Cầu Diễn, Quận Bắc Từ Liêm, Hà Nội</Text><br />
                        <Text style={{ color: "white" }}>Email: qnc2755@gmail.com</Text><br />
                        <Text style={{ color: "white" }}>Số điện thoại: 0335393056</Text><br />
                        <Text style={{ color: "white" }}>Mã QR Donate</Text>
                    </Col>
                    <Col xs={24} md={14} style={{ textAlign: "center" }}>
                        <img src={`${backendUrl}/storage/slide/myLocation.png`} alt="Logo Steaven"
                            style={{ width: "350px", height: "150px", display: "block", margin: "0 auto", borderRadius: 5 }} />
                    </Col>
                </Row>
            </Col>

            {/* Phần cuối với bản quyền */}
            <Col span={24} style={{ textAlign: "center", marginTop: 30 }}>
                <Text style={{ color: "#fff" }}>© Clothes CTStore, Hân hạnh đồng hành cùng bạn.</Text><br />
                <Text style={{ color: "#fff" }}>
                    Designed By <a href="https://www.facebook.com/coong" style={{ color: "#1890ff" }}>Quách Thành Công</a>
                </Text>
            </Col>
        </Row>

    );
};

export default AppFooter;