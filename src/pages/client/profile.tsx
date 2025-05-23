
import { Button, Col, ConfigProvider, Descriptions, Form, Image, Input, message, notification, Radio, Row, Select, Typography, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { StylesContext } from '@/context';
import { Outlet, useNavigate } from 'react-router-dom';
import { Card } from '@/components/admin/dashboard/Card/Card';
import { DescriptionsProps } from 'antd/lib';
import { useContext, useEffect, useState } from 'react';
import { callChangePassword, callFetchUserByEmail, callUpdateUser, callUploadSingleFile } from '@/config/api';
const { Link } = Typography;
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import { constants } from 'perf_hooks';
import { IUser } from '@/types/backend';
import { useAppSelector } from '@/redux/hooks';
import { ProForm, ProFormSelect } from '@ant-design/pro-components';
import AddressSelector from '@/components/admin/user/location.user';

interface IProductImage {
    name: string;
    uid: string;
}
const ProfilePage = () => {
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [dataImage, setDataImage] = useState<IProductImage[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [dataInit, setDataInit] = useState<IUser | null>(null);
    const [form] = Form.useForm();
    const userData = useAppSelector(state => state.account.user);
    const navigate = useNavigate();

    const fetchUserByEmail = async () => {
        const res = await callFetchUserByEmail(userData.email);
        setDataInit(res.data!);
        form.setFieldsValue(res.data!);
        setDataImage([{
            name: res.data!.avatar,
            uid: uuidv4(),
        }])
    };
    useEffect(() => {
        if (userData?.email) {
            fetchUserByEmail();
        }
    }, [userData?.email]);

    const DESCRIPTION_ITEMS: DescriptionsProps['items'] = [
        {
            key: 'name',
            label: 'Họ tên',
            children: <span>{dataInit?.name}</span>,
        },
        {
            key: 'age',
            label: 'Tuổi',
            children: <span>{dataInit?.age}</span>,
        },
        {
            key: 'email',
            label: 'Email',
            children: (
                <Link>
                    {dataInit?.email}
                </Link>
            ),
        },
        {
            key: 'phone',
            label: 'Số điện thoại',
            children: <Link>{dataInit?.phone}</Link>,
        },
        {
            key: 'gender',
            label: 'Giới tính',
            children: <span>{dataInit?.gender}</span>,
        },
        {
            key: 'createAt',
            label: 'Ngày tham gia',
            children: <span>{dataInit?.createdAt}</span>,
        },
        {
            key: 'address',
            label: 'Địa chỉ',
            children: (
                <span>{dataInit?.address}</span>
            ),
        },
    ];


    const submitUser = async (valuesForm: any) => {
        if (showPasswordFields) {
            // Gọi API đổi mật khẩu
            const { oldPassword, newPassword, confirmPassword } = valuesForm;

            if (newPassword !== confirmPassword) {
                message.error("Mật khẩu xác nhận không khớp!");
                return;
            }

            const res = await callChangePassword(oldPassword, newPassword)
            if (res.statusCode == 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Sửa mật khẩu thành công!',
                    placement: 'topRight',
                });
                navigate("/login");
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                });
            }
        } else {
            const { name, email, password, address, age, gender, role } = valuesForm;
            const formattedAddress = Array.isArray(address)
                ? address.join(", ")
                : (typeof address === "object" && address !== null
                    ? `${address.city}, ${address.district}, ${address.ward}`
                    : String(address)
                );

            if (dataInit?.id) {
                // update
                const userForm = {
                    id: dataInit?.id,
                    name,
                    email,
                    password,
                    age,
                    gender,
                    address: formattedAddress,
                    role: { id: dataInit?.role?.id, name: "", description: "" },
                };
                const res = await callUpdateUser(
                    userForm.id,
                    userForm.name,
                    dataImage[0]?.name || "",
                    userForm?.age!,
                    userForm?.gender!,
                    userForm.address,
                    role);
                if (res.data) {
                    notification.success({
                        message: 'Thành công',
                        description: 'Sửa thông tin thành công!',
                        placement: 'topRight',
                    });
                    fetchUserByEmail();
                } else {
                    notification.error({
                        message: "Có lỗi xảy ra",
                        description: res.message,
                    });
                }
            }
        }
    };

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleRemoveFile = (file: any) => {
        setDataImage([]);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.");
        }
    };

    const handleUploadFileImage = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "avatar");
        if (res && res.data) {
            setDataImage([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok');
        } else {
            if (onError) {
                setDataImage([]);
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };
    const stylesContext = useContext(StylesContext);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Row justify="center" style={{
                backgroundColor: "#f5f5f5", minHeight: "100vh"
            }}>
                <Col span={19} style={{ marginBottom: 20 }}>
                    <Card style={{ marginTop: 160 }}>
                        <Row {...stylesContext?.rowProps}>
                            <Col xs={24} sm={8} lg={4}>
                                <Image
                                    src={
                                        dataInit?.avatar
                                            ? `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${dataInit?.avatar}`
                                            : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                                    }
                                    alt="user profile image"
                                    height="100%"
                                    width="100%"
                                    style={{ borderRadius: '12px' }}
                                />
                            </Col>
                            <Col xs={24} sm={16} lg={19} style={{ marginLeft: 20 }}>
                                <Descriptions
                                    title="Thông tin nguời dùng"
                                    items={DESCRIPTION_ITEMS}
                                    column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
                                />
                            </Col>
                        </Row>
                    </Card>
                    <div style={{ marginTop: '1.5rem' }}>
                        <Outlet />
                    </div>
                    <Card >
                        <Form
                            name="user-profile-details-form"
                            layout="vertical"
                            form={form}
                            onFinish={submitUser}
                            onFinishFailed={onFinishFailed}
                            autoComplete="on"
                            requiredMark={false}
                        >
                            <Row gutter={[10, 0]} >
                                {!showPasswordFields ? (
                                    <>
                                        <Col sm={24} lg={6}>
                                            <Form.Item<IUser>
                                                label="Họ tên"
                                                name="name"
                                                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col lg={6} md={6} sm={24} xs={24}>
                                            <ProFormSelect
                                                name="gender"
                                                label="Giới Tính"
                                                valueEnum={{
                                                    Nam: 'Nam',
                                                    Nữ: 'Nữ',
                                                    Khác: 'Khác',
                                                }}
                                                placeholder="Chọn giới tính"
                                                rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                            />
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                labelCol={{ span: 24 }}
                                                label="Ảnh đại diện"
                                                name="avatar"
                                                rules={[
                                                    {
                                                        validator: () => Promise.resolve()
                                                    }
                                                ]}
                                            >
                                                <ConfigProvider locale={enUS}>
                                                    {dataInit && (<Upload
                                                        name="avatar"
                                                        listType="picture-card"
                                                        className="avatar-uploader"
                                                        maxCount={1}
                                                        multiple={false}
                                                        customRequest={handleUploadFileImage}
                                                        beforeUpload={beforeUpload}
                                                        onChange={handleChange}
                                                        onRemove={(file) => handleRemoveFile(file)}
                                                        onPreview={handlePreview}
                                                        defaultFileList={
                                                            dataInit?.avatar
                                                                ? [{
                                                                    uid: uuidv4(),
                                                                    name: dataInit.avatar,
                                                                    status: 'done',
                                                                    url: `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${dataInit.avatar}`,
                                                                }]
                                                                : []
                                                        }

                                                    >
                                                        <div>
                                                            {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                            <div style={{ marginTop: 8 }}>Upload</div>
                                                        </div>
                                                    </Upload>)}
                                                </ConfigProvider>
                                            </Form.Item>
                                        </Col>

                                        <Col sm={24} lg={6} style={{ marginTop: -20 }}>
                                            <Form.Item<IUser>
                                                label="Số điện thoại"
                                                name="phone"
                                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col sm={24} lg={6} style={{ marginTop: -20 }}>
                                            <Form.Item<IUser>
                                                label="Tuổi"
                                                name="age"
                                                rules={[{ required: true, message: 'Vui lòng nhập số tuổi!' }]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col sm={24} lg={12} style={{ marginTop: -20 }}>
                                            <ProForm.Item label="Địa chỉ" name="address">
                                                <AddressSelector onChange={(value: string[]) => form.setFieldsValue({ address: value })} />
                                            </ProForm.Item>
                                        </Col>
                                    </>
                                ) : (
                                    <>
                                        <Col sm={24} lg={12}>
                                            <Form.Item
                                                label="Mật khẩu cũ"
                                                name="oldPassword"
                                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
                                            >
                                                <Input.Password />
                                            </Form.Item>
                                        </Col>
                                        <Col sm={24} lg={12}>
                                            <Form.Item
                                                label="Mật khẩu mới"
                                                name="newPassword"
                                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                                            >
                                                <Input.Password />
                                            </Form.Item>
                                        </Col>
                                        <Col sm={24} lg={12}>
                                            <Form.Item
                                                label="Xác nhận mật khẩu"
                                                name="confirmPassword"
                                                rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                                            >
                                                <Input.Password />
                                            </Form.Item>
                                        </Col>
                                    </>
                                )}
                            </Row>

                            <Form.Item style={{
                                marginTop: 20
                            }}>
                                {!showPasswordFields && (
                                    <Button
                                        style={{ marginRight: 10 }}
                                        onClick={() => setShowPasswordFields(true)}
                                    >
                                        Đổi mật khẩu
                                    </Button>
                                )}
                                {showPasswordFields && (
                                    <Button
                                        style={{ marginRight: 10 }}
                                        onClick={() => setShowPasswordFields(false)}
                                    >
                                        Huỷ
                                    </Button>
                                )}
                                <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                                    Lưu thay đổi
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row >
        </>
    );
};


export default ProfilePage;
