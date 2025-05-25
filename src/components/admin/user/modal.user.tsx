import { callCreateUser, callFetchRole, callUpdateUser, callUploadSingleFile } from "@/config/api";
import { IUser } from "@/types/backend";
import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, message, Modal, notification, Row, Upload } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { DebounceSelect } from "./debouce.select";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import AddressSelector from "./location.user";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

interface IProductImage {
    name: string;
    uid: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, dataInit, setDataInit, reloadTable } = props;
    const [roles, setRoles] = useState<ICompanySelect[]>([]);
    const [form] = Form.useForm();
    const [dataImage, setDataImage] = useState<IProductImage[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit.role) {
                setRoles([{
                    label: dataInit.role?.name,
                    value: dataInit.role?.id,
                    key: dataInit.role?.id,
                }])
            }
            form.setFieldsValue({
                ...dataInit,
                role: { label: dataInit.role?.name, value: dataInit.role?.id },
                address: Array.isArray(dataInit.address)
                    ? dataInit.address
                    : dataInit.address?.split(", ") || []
            })

            setDataImage([{
                name: dataInit.avatar,
                uid: uuidv4(),
            }])
        }
    }, [dataInit]);

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

    const submitUser = async (valuesForm: any) => {
        const { name, email, password, address, age, gender, role } = valuesForm;
        const formattedAddress = Array.isArray(address)
            ? address.join(", ")
            : (typeof address === "object" && address !== null
                ? `${address.city}, ${address.district}, ${address.ward}`
                : String(address)
            );

        if (dataInit?.id) {
            // update
            const user = {
                id: dataInit.id,
                name,
                email,
                password,
                age,
                gender,
                address: formattedAddress, // Đảm bảo địa chỉ đúng format
                role: { id: role.value, name: "", description: "" },
            };
            const res = await callUpdateUser(
                user.id,
                user.name,
                dataImage[0]?.name || "",
                user.age,
                user.gender,
                user.address,
                user.role
            );
            if (res.data) {
                message.success("Cập nhật user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                });
            }
        } else {
            const user = {
                name,
                email,
                password,
                age,
                gender,
                address: formattedAddress,
                role: { id: role.value, name: "", description: "" },
            };
            const res = await callCreateUser(
                user.email,
                user.name,
                user.password,
                dataImage[0]?.name || "",
                user.age,
                user.gender,
                user.address,
                user.role
            );
            if (res.data) {
                message.success("Thêm mới user thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: res.message,
                });
            }
        }
    };

    async function fetchRoleList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchRole(`page=1&size=100&name=/${name}`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item.id as string
                };
            });
            return temp;
        } else return [];
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setRoles([]);
        setOpenModal(false);
    };

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật User" : "Tạo mới User"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={dataInit?.id ? {
                    ...dataInit,
                    role: { label: dataInit.role?.name, value: dataInit.role?.id },
                    address: Array.isArray(dataInit.address)
                        ? dataInit.address
                        : dataInit.address?.split(", ") || []

                } : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            disabled={dataInit?.id ? true : false}
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ' }
                            ]}
                            placeholder="Nhập email"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={!!dataInit?.id}
                            label="Password"
                            name="password"
                            rules={dataInit?.id ? [] : [{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập password"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Tuổi"
                            name="age"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập nhập tuổi"
                        />
                    </Col>

                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormText
                            label="Số điện thoại"
                            name="phone"
                            placeholder="Nhập số điện thoại"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item label="Địa chỉ" name="address">
                            <AddressSelector onChange={(value: string[]) => form.setFieldsValue({ address: value })} />
                        </ProForm.Item>
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
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Chọn vai trò"
                                fetchOptions={fetchRoleList}
                                onChange={(newValue: any) => {
                                    if (newValue?.length === 0 || newValue?.length === 1) {
                                        setRoles(newValue as ICompanySelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>

                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Avatar"
                            name="avatar"
                            rules={[
                                {
                                    validator: () => Promise.resolve()
                                }
                            ]}
                        >
                            <ConfigProvider locale={enUS}>
                                <Upload
                                    name="image"
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
                                        dataInit?.id ?
                                            [
                                                {
                                                    uid: uuidv4(),
                                                    name: dataInit?.avatar ?? "",
                                                    status: 'done',
                                                    url: `${import.meta.env.VITE_BACKEND_URL}/storage/avatar/${dataInit?.avatar}`,
                                                }
                                            ] : []
                                    }

                                >
                                    <div>
                                        {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </ConfigProvider>
                        </Form.Item>

                    </Col>
                </Row>
            </ModalForm >
            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                style={{ zIndex: 1500 }}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default ModalUser;
