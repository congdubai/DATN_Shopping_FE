import { callCreateProduct, callCreateProductDetail, callFetchCategory, callFetchColor, callFetchProduct, callFetchProductDetailByColor, callFetchSize, callUpdateProduct, callUpdateProductDetail, callUploadSingleFile } from "@/config/api";
import { useAppDispatch } from "@/redux/hooks";
import { IProduct, IProductDetail } from "@/types/backend";
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
    dataInit?: IProductDetail | null;
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

const ModalProductDetail = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();
    const [dataImage, setDataImage] = useState<IProductImage[]>([]);
    const [colors, setColors] = useState<IProductSelect[]>([]);
    const [sizes, setSizes] = useState<IProductSelect[]>([]);
    const [products, setProducts] = useState<IProductSelect[]>([]);
    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [value, setValue] = useState<string>("");
    const [isColorExists, setIsColorExists] = useState(false);


    useEffect(() => {
        if (dataInit?.id) {
            if (dataInit.color) {
                setColors([
                    {
                        label: dataInit.color?.name,
                        value: dataInit.color?.id,
                        key: dataInit.color?.id,
                    }
                ])
            }
            if (dataInit.size) {
                setSizes([
                    {
                        label: dataInit.size?.name,
                        value: dataInit.size?.id,
                        key: dataInit.size?.id,
                    }
                ])
            }
            if (dataInit.product) {
                setProducts([
                    {
                        label: dataInit.product?.name,
                        value: dataInit.product?.id,
                        key: dataInit.product?.id,
                    }
                ])
            }
            form.setFieldsValue({
                ...dataInit,
                color: { label: dataInit.color?.name, value: dataInit.color?.id },
                product: { label: dataInit.product?.name, value: dataInit.product?.id },
                size: { label: dataInit.size?.name, value: dataInit.size?.id },
            })
            setDataImage([{
                name: dataInit.imageDetail,
                uid: uuidv4(),
            }])
        }
        if (isColorExists) {
            console.log("check data ", dataImage[0].name)
        }
    }, [dataInit, isColorExists]);

    async function fetchProductList(name: string): Promise<IProductSelect[]> {
        const res = await callFetchProduct(`page=1&size=100&name=/${name}`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    key: item.id,
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchSizeList(name: string): Promise<IProductSelect[]> {
        const res = await callFetchSize(`page=1&size=100&name=/${name}`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    key: item.id,
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchColorList(name: string): Promise<IProductSelect[]> {
        const res = await callFetchColor(`page=1&size=100&name=/${name}`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    key: item.id,
                    label: item.name as string,
                    value: item.id as string
                }
            })
            return temp;
        } else return [];
    }

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

    const handleColorChange = async (colorValue: any) => {
        setIsColorExists(false);
        const product = form.getFieldValue("product");

        try {
            const image = await callFetchProductDetailByColor(String(product.value), String(colorValue));
            console.log("check image ", image);
            const imageObj = {
                name: image,
                uid: uuidv4(),
            };

            // Cập nhật ảnh và form
            setDataImage([imageObj]);

            form.setFieldsValue({
                color: { label: "", value: colorValue },
                imageDetail: imageObj.name
            });

            setIsColorExists(true);
        } catch (error) {
            console.error("Error fetching product details:", error);
            message.error('Đã xảy ra lỗi khi tải dữ liệu.');
        }
    };



    const handleRemoveFile = (file: any) => {
        setDataImage([])
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
        setProducts([]);
        setSizes([]);
        setColors([]);
        setValue("");
        setDataImage([]);
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
        try {
            setLoadingUpload(true);
            const res = await callUploadSingleFile(file, "product");
            if (res && res.data) {
                setDataImage([{
                    name: res.data.fileName,
                    uid: uuidv4()
                }]);
                setLoadingUpload(false);
                onSuccess?.('ok');
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            setLoadingUpload(false);
            setDataImage([]);
            onError?.({ event: err });
        }
    };

    const submitProduct = async (valuesForm: any) => {
        const { quantity, imageDetail, product, color, size } = valuesForm;
        const imageName = dataImage.length > 0 ? dataImage[0].name : "";
        if (dataInit?.id) {
            //update
            const productDetail = {
                id: dataInit.id,
                quantity,
                imageDetail,
                product: { id: product.value, name: "", image: "" },
                size: { id: size.value, name: "", description: "" },
                color: { id: color.value, name: "", description: "" }
            }
            const res = await callUpdateProductDetail(productDetail.id, imageName, productDetail.quantity, productDetail.product, productDetail.color, productDetail.size);
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
            const productDetail = {
                quantity,
                imageDetail,
                product: { id: product.value, name: "", image: "" },
                size: { id: size.value, name: "", description: "" },
                color: { id: color.value, name: "", description: "" }
            }
            const res = await callCreateProductDetail(imageName, productDetail.quantity, productDetail.product, productDetail.color, productDetail.size);
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
                    width: isMobile ? "100%" : 600,
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
                    color: { label: dataInit.color?.name, value: dataInit.color?.id },
                    product: { label: dataInit.product?.name, value: dataInit.product?.id },
                    size: { label: dataInit.size?.name, value: dataInit.size?.id },
                } : {}}

            >
                <Row gutter={16}>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProForm.Item
                            name="product"
                            label="Sản phẩm"
                            rules={[{ required: true, message: 'Vui lòng chọn sản phẩm!' }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={products}
                                value={products}
                                placeholder="Chọn sản phẩm"
                                fetchOptions={fetchProductList}
                                onChange={(newValue: any) => {
                                    if (newValue && newValue.value) {
                                        setProducts(newValue as IProductSelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="color"
                            label="Màu sắc"
                            rules={[{ required: true, message: 'Vui lòng chọn màu sắc!' }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={colors}
                                value={colors}
                                placeholder="Chọn màu sắc"
                                fetchOptions={fetchColorList}
                                onChange={async (newValue: any) => {
                                    if (newValue && newValue.value) {
                                        setColors(newValue as IProductSelect[]);
                                        await handleColorChange(newValue.value);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="size"
                            label="Size"
                            rules={[{ required: true, message: 'Vui lòng chọn Size!' }]}
                        >
                            <DebounceSelect
                                allowClear
                                showSearch
                                defaultValue={sizes}
                                value={sizes}
                                placeholder="Chọn Size"
                                fetchOptions={fetchSizeList}
                                onChange={(newValue: any) => {
                                    if (newValue && newValue.value) {
                                        setSizes(newValue as IProductSelect[]);
                                    }
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                    <Col lg={24} md={24} sm={24} xs={24}>
                        <ProFormDigit
                            label="Số lượng"
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập số lượng"
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Ảnh sản phẩm"
                            name="imageDetail"
                            rules={[{
                                required: true, message: 'Vui lòng không bỏ trống',
                                validator: () => {
                                    if (dataImage.length > 0) return Promise.resolve();
                                    else return Promise.reject(false);
                                }
                            }]}
                        >
                            <ConfigProvider locale={enUS}>
                                <Upload
                                    name="imageDetail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={handleUploadFileImage}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    onRemove={(file) => handleRemoveFile(file)}
                                    onPreview={handlePreview}
                                    fileList={
                                        dataInit?.id ? [
                                            {
                                                uid: uuidv4(),
                                                name: dataInit?.imageDetail ?? "",
                                                status: 'done',
                                                url: `${import.meta.env.VITE_BACKEND_URL}/storage/product/${dataInit?.imageDetail ?? ""}`,
                                            }
                                        ] : dataImage.length > 0 ? [
                                            {
                                                uid: dataImage[0].uid,
                                                name: dataImage[0]?.name ?? "",
                                                status: "done",
                                                url: `${import.meta.env.VITE_BACKEND_URL}/storage/product/${dataImage[0]?.name ?? ""}`,
                                            },
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

        </>
    )
}
export default ModalProductDetail;