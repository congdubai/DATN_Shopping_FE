import { callCreateProduct, callFetchCategory, callUpdateProduct, callUploadSingleFile } from "@/config/api";
import { useAppDispatch } from "@/redux/hooks";
import { IProduct } from "@/types/backend";
import { ModalForm, ProCard, ProForm, ProFormDigit, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, message, Modal, notification, Row, Upload } from "antd";
import { isMobile } from "react-device-detect";
import { DebounceSelect } from "../user/debouce.select";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: () => void;
    dataInit?: IProduct | null;
    setDataInit: (v: any) => void;
}
export interface IProductSelect {
    label: string;
    value: string;
    key?: string;
}
interface IProductImage {
    name: string;
    uid: string;
}

const ModalProduct = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [dataImage, setDataImage] = useState<IProductImage[]>([]);
    const [categories, setCategories] = useState<IProductSelect[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [value, setValue] = useState<string>("");



    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit.category) {
                setCategories([
                    {
                        label: dataInit.category?.name,
                        value: dataInit.category?.id,
                        key: dataInit.category?.id,
                    }
                ])
            }
            form.setFieldsValue({
                ...dataInit,
                category: { label: dataInit.category?.name, value: dataInit.category?.id },
            })
            setDataImage([{
                name: dataInit.image,
                uid: uuidv4(),
            }])
            setValue(dataInit.detailDesc || "");
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
        setDataImage([])
    }

    async function fetchCategoryList(name: string): Promise<IProductSelect[]> {
        const res = await callFetchCategory(`page=1&size=100&name=/${name}`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
        setCategories([]);
        setValue("");
    }

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
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };
    const handleUploadFileImage = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "product");
        if (res && res.data) {
            setDataImage([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setDataImage([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    const submitProduct = async (valuesForm: any) => {
        const { name, price, image, detailDesc, shortDesc, category } = valuesForm;
        if (dataInit?.id) {
            //update
            const product = {
                id: dataInit.id,
                name,
                image,
                price,
                shortDesc,
                category: { id: category.value, name: "", description: "", image: "" }
            }
            const res = await callUpdateProduct(product.id, product.name, product.price, dataImage[0].name, value, product.shortDesc, product.category);
            if (res.data) {
                message.success("Cập nhật sản phẩm thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const product = {
                name,
                image,
                price,
                shortDesc,
                category: { id: category.value, name: "", description: "", image: "" }
            }
            const res = await callCreateProduct(product.name, product.price, dataImage[0].name, value, product.shortDesc, product.category);
            if (res.data) {
                message.success("Thêm mới sản phẩm thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }
    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật  sản phẩm" : "Tạo mới sản phẩm"}</>}
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
                onFinish={submitProduct}
                initialValues={dataInit?.id ? {
                    ...dataInit,
                    category: { label: dataInit.category?.name, value: dataInit.category?.id },
                } : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên sản phẩm"
                            name="name"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProFormDigit
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập nhập giá"
                        />
                    </Col>
                    <Col lg={6} md={6} sm={24} xs={24}>
                        <ProForm.Item
                            name="category"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={categories}
                                value={categories}
                                placeholder="Chọn danh mục"
                                fetchOptions={fetchCategoryList}
                                onChange={(newValue: any) => {
                                    if (newValue && newValue.value) {
                                        setCategories(newValue as IProductSelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormTextArea
                            label="Mô tả ngắn"
                            name="shortDesc"
                            placeholder="Nhập mô tả ngắn"
                        />
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Ảnh sản phẩm"
                            name="image"
                            rules={[{
                                required: true,
                                validator: () => {
                                    if (dataImage.length > 0) return Promise.resolve();
                                    else return Promise.reject(false);
                                }
                            }]}
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
                                                    name: dataInit?.image ?? "",
                                                    status: 'done',
                                                    url: `${import.meta.env.VITE_BACKEND_URL}/storage/product/${dataInit?.image}`,
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
                    <ProCard
                        title="Miêu tả"
                        headStyle={{ color: "#d81921" }}
                        style={{ marginBottom: 20, marginTop: -10 }}
                        headerBordered
                        size="small"
                        bordered
                    >
                        <Col span={24}>
                            <ReactQuill
                                theme="snow"
                                value={value}
                                onChange={setValue}
                                className="custom-editor"
                                modules={{
                                    toolbar: true,
                                }}
                            />
                            <style>
                                {`
                        .custom-editor .ql-editor {
                            min-height: 80px;
                        }
                    `}
                            </style>
                        </Col>
                    </ProCard>
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
    )
}
export default ModalProduct;