import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductDetailById } from "@/redux/slice/productDetailSlide";
import { IProduct, IProductDetail } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';
import { useEffect } from "react";

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    productId: string | null;
    setProductId: (v: any) => void;
}
const ViewTopProductDetail = (props: IProps) => {
    const { onClose, open, productId, setProductId } = props;
    const dispatch = useAppDispatch();
    const { result: productDetails = [], isFetching } = useAppSelector(
        (state: any) => state.productDetail
    ) as { result: IProductDetail[]; isFetching: boolean };

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductDetailById(productId))
        }
    }, [productId, dispatch, open]);

    return (
        <>
            <Drawer
                title="Thông Tin của sản phẩm"
                placement="right"
                onClose={() => { onClose(false); }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={1} layout="horizontal">
                    <Descriptions.Item label="Ảnh sản phẩm">
                        <img
                            alt="Product Image"
                            src={`${import.meta.env.VITE_BACKEND_URL}/storage/product/${productDetails[0]?.imageDetail}`}
                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                        />
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{productDetails[0]?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Sản phẩm">
                        <Badge status="processing" text={<>{productDetails[0]?.product?.name}</>} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Màu sắc">
                        <Badge status="processing" text={<>{productDetails[0]?.color?.name}</>} />
                    </Descriptions.Item>
                    <Descriptions.Item label="size">
                        <Badge status="processing" text={<>{productDetails[0]?.size?.name}</>} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                        {productDetails[0]?.createdAt ? dayjs(productDetails[0]?.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sửa">
                        {productDetails[0]?.updatedAt ? dayjs(productDetails[0]?.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tạo bởi">{productDetails[0]?.createdBy}</Descriptions.Item>
                    <Descriptions.Item label="Cập nhật bởi">{productDetails[0]?.updatedBy}</Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewTopProductDetail;