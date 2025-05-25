import { useEffect } from 'react';
import { Button, Col, Form, Input, Row, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useStylesContext } from '@/context';
import { useAppSelector } from '@/redux/hooks';

const { TextArea } = Input;

export const ContactForm = () => {
    const stylesContext = useStylesContext();
    const user = useAppSelector(state => state.account.user);
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const { name, recipientEmail, subject, message: userMessage } = values;

            const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                `Họ tên: ${name}\nEmail: ${user?.email || 'Không có email'}\n\n${userMessage}`
            )}`;

            window.open(gmailLink, '_blank');
            form.resetFields();

            setTimeout(() => {
                message.success('Gửi tin nhắn thành công!');
            }, 8000);

        });
    };


    return (
        <Form layout="vertical" form={form}>
            <Row {...stylesContext?.rowProps} gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="name"
                        label="Họ tên"
                        tooltip="Họ tên không được để trống"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="recipientEmail"
                        label="Email người nhận"
                        tooltip="Email người nhận không được để trống và phải đúng định dạng"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email người nhận' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="subject"
                label="Tiêu đề"
                tooltip="Tiêu đề không được để trống"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="message"
                label="Tin nhắn"
                rules={[{ required: true, message: 'Vui lòng nhập tin nhắn' }]}
            >
                <TextArea rows={5} />
            </Form.Item>

            <Form.Item>
                <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit}>
                    Gửi
                </Button>
            </Form.Item>
        </Form>
    );
};
