import { Col, Row, RowProps, Space, Typography, message } from 'antd';
import { MailFilled, PhoneFilled } from '@ant-design/icons';
import { Card } from '@/components/admin/dashboard/Card/Card';
import { ContactForm } from '@/components/client/contax/contactForm';

const { Link, Text, Paragraph } = Typography;

const ROW_PROPS: RowProps = {
    gutter: [
        { xs: 8, sm: 16, md: 24, lg: 32 },
        { xs: 8, sm: 16, md: 24, lg: 32 },
    ],
};

const textStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
};

const cardStyles: React.CSSProperties = {
    height: '100%',
};

export const CorporateContactPage = () => {
    const handleCopyEmail = (email: string) => {
        navigator.clipboard.writeText(email)
            .then(() => {
                message.success(`Đã sao chép: ${email}`);
            })
            .catch(() => {
                message.error('Không thể sao chép địa chỉ email');
            });
    };

    return (
        <div style={{ padding: "20px", paddingTop: 170, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Row {...ROW_PROPS} justify="center">
                <Col span={19}>
                    <Row {...ROW_PROPS}>
                        <Col xs={24} lg={12}>
                            <Card title="Điện thoại" extra={<PhoneFilled />} style={cardStyles}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text style={textStyles}>
                                        Thành Công: <Link strong>(+84) 335394567</Link>
                                    </Text>
                                    <Text style={textStyles}>
                                        Quách Bằng: <Link strong>(+84) 345394567</Link>
                                    </Text>
                                    <Text style={textStyles}>
                                        Văn Thanh: <Link strong>(+84) 335394566</Link>
                                    </Text>
                                </Space>
                                <Paragraph style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    Chúng tôi làm việc vào các ngày trong tuần và giờ hành chính (8 giờ sáng - 5 giờ chiều), hãy thoải mái gọi điện cho chúng tôi..
                                </Paragraph>
                            </Card>
                        </Col>

                        <Col xs={24} lg={12}>
                            <Card title="Email" extra={<MailFilled />} style={cardStyles}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Text style={textStyles}>
                                        Bán hàng:
                                        <Link strong onClick={() => handleCopyEmail('qnc2755@gmail.com')}>qnc2755@gmail.com</Link>
                                    </Text>
                                    <Text style={textStyles}>
                                        Hỗ trợ:
                                        <Link strong onClick={() => handleCopyEmail('help@gmail.com')}>help@gmail.com</Link>
                                    </Text>
                                </Space>
                                <Paragraph style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    Chúng tôi làm việc tất cả các ngày trong tuần, hãy thoải mái viết thư cho chúng tôi.
                                </Paragraph>
                            </Card>
                        </Col>

                        <Col span={24}>
                            <Card title="Liên hệ" style={{ padding: 16 }}>
                                <ContactForm />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
