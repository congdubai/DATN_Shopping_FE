import { fetchProductDetailById } from "@/redux/slice/productDetailSlide";
import { Modal, Button, Flex } from "antd";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IProductDetail } from "@/types/backend";
import { motion } from "framer-motion";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

interface IProps {
    isOpenModal: boolean;
    setIsOpenModal: (v: boolean) => void;
    productId?: string;
}

const HomeModal = ({ isOpenModal, setIsOpenModal, productId }: IProps) => {
    const dispatch = useAppDispatch();
    const { result: productDetails = [], isFetching } = useAppSelector(
        (state: any) => state.productDetail
    ) as { result: IProductDetail[]; isFetching: boolean };

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (productId) {
            dispatch(fetchProductDetailById({ productId })).then((res) =>
                console.log("Kết quả API trả về:", res));
        }
    }, [productId, dispatch]);

    // Kiểm tra nếu productDetails chưa load
    const colors = productDetails.length ? [...new Set(productDetails.map((p) => p.color?.name))] : [];
    const sizes = productDetails.length ? [...new Set(productDetails.map((p) => p.size?.name))] : [];

    // State chọn màu & kích thước
    const [selectedColor, setSelectedColor] = useState<string | undefined>(colors[0]);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(sizes[0]);
    const [quantity, setQuantity] = useState<number>(1);

    useEffect(() => {
        if (colors.length > 0) setSelectedColor(colors[0]);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
    }, [productDetails]);

    // Lấy sản phẩm với màu và kích thước đã chọn
    const selectedProduct = productDetails.find(
        (p) => p.color?.name === selectedColor && p.size?.name === selectedSize
    );

    // Lấy số lượng của sản phẩm đã chọn
    const selectedProductQuantity = selectedProduct?.quantity || 0;

    // Kiểm tra nếu có hàng
    const isInStock = selectedProductQuantity > 0;

    const selectedImage = selectedProduct?.imageDetail || "";

    return (
        <Modal open={isOpenModal} onCancel={() => setIsOpenModal(false)} footer={null} width={800}>
            <div style={{ display: "flex" }}>
                {selectedImage ? (
                    <div style={{ width: "50%", height: 420, borderRadius: 10, overflow: "hidden" }}>
                        <motion.img
                            key={selectedImage}
                            src={`${backendUrl}/storage/product/${selectedImage}`}
                            alt="Product Image"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: 10,
                            }}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                ) : (
                    <div
                        style={{
                            width: "50%",
                            height: 420,
                            backgroundColor: "#ffcccc",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "red",
                            fontSize: 20,
                            fontWeight: "bold",
                            borderRadius: 10,
                            border: "2px dashed red",
                        }}
                    >
                        Not Image
                    </div>
                )}

                {/* Thông tin sản phẩm */}
                <div style={{ marginLeft: 20 }}>
                    <h2>{productDetails[0]?.product?.name || "Sản phẩm"}</h2>
                    <p style={{ marginTop: 5 }}>
                        <strong>SKU: </strong> {selectedProduct?.id}{" "}
                        <span
                            style={{
                                color: "white",
                                background: isInStock ? "#38bf57" : "red",
                                fontSize: 12,
                                fontWeight: 520,
                                borderRadius: 3,
                                padding: "3px 6px",
                                marginLeft: 8
                            }}
                        >
                            {isInStock ? "Còn hàng" : "Hết hàng"}
                        </span>
                    </p>
                    <p style={{ fontSize: "20px", color: "red" }}>
                        <strong>{selectedProduct?.product?.price?.toLocaleString()}đ</strong>
                    </p>

                    <p>
                        <strong>Màu sắc:</strong>
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {colors.map((color) => {
                            const isSelected = selectedColor === color;
                            const colorCode = productDetails.find((p) => p.color?.name === color)?.color?.hexCode || "#000"; // Lấy mã màu từ API

                            return (
                                <div
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    style={{
                                        width: 31,
                                        height: 30,
                                        borderRadius: "50%",
                                        backgroundColor: colorCode,
                                        border: isSelected ? "2px solid black" : "1px solid #ccc",
                                        cursor: "pointer"
                                    }}
                                />
                            );
                        })}
                    </div>

                    <p style={{ marginTop: 8 }}>
                        <strong>Kích thước:</strong>
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {sizes.map((size) => (
                            <Button
                                key={size}
                                type="default"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                    backgroundColor: "white",
                                    width: 40,
                                    height: 30,
                                    color: "black",
                                    border: selectedSize === size ? "2px solid black" : "1px solid #ccc",
                                    fontWeight: selectedSize === size ? "bold" : "normal",
                                    padding: 0,
                                }}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                        <Flex
                            align="center"
                            justify="space-between"
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "5px",
                                padding: "5px 10px",
                                display: "inline-flex",
                                width: "120px",
                            }}
                        >
                            <Button
                                type="text"
                                icon={<MinusOutlined style={{ fontSize: 16 }} />}
                            />
                            <span style={{ fontSize: "16px", fontWeight: "bold" }}>1</span>
                            <Button
                                type="text"
                                icon={<PlusOutlined style={{ fontSize: 16 }} />}
                            />
                        </Flex>

                        <Button type="primary" style={{ backgroundColor: "black", color: "white", height: 40, width: 150 }}>
                            Thêm vào giỏ
                        </Button>
                    </div>

                    {/* Link "Xem chi tiết »" */}
                    <p style={{ marginTop: 20 }}>
                        <a
                            href={`/product/detail?id=${productId}`}
                            style={{
                                textDecoration: "underline",
                                textUnderlineOffset: "4px",
                                color: "black"
                            }}
                        >
                            Xem chi tiết »
                        </a>
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default HomeModal;
