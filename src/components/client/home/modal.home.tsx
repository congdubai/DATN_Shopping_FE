import { Modal, Button } from "antd";
import { useState } from "react";
interface IProps {
    isOpenModal: boolean;
    setIsOpenModal: (v: boolean) => void;
}
const HomeModal = (props: IProps) => {
    const { isOpenModal, setIsOpenModal } = props;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [selectedSize, setSelectedSize] = useState("S");


    return (
        <Modal open={isOpenModal} onCancel={() => setIsOpenModal(false)} footer={null} width={800}>
            <div style={{ display: "flex" }}>
                {/* Ảnh sản phẩm */}
                <img src={`${backendUrl}/storage/slide/slide-2.jpg`} alt="Product" style={{ width: "50%", height: 400, borderRadius: 10 }} />

                {/* Thông tin sản phẩm */}
                <div style={{ marginLeft: 20 }}>
                    <h2>Áo Thun Nam ICONDENIM Luminous</h2>
                    <p style={{ marginTop: 5 }}><strong>SKU:</strong> ATID0561-01 <span style={{ color: "white", background: "#38bf57", fontSize: 12, fontWeight: 520, borderRadius: 3, padding: 3 }}>Còn hàng</span></p>
                    <p style={{ fontSize: "20px", color: "red" }}><strong>299,000đ</strong></p>

                    <p><strong>Màu sắc:</strong> Đen-0561</p>

                    <p style={{ marginTop: 8 }}><strong>Kích thước:</strong></p>
                    <div style={{ display: "flex", gap: 10 }}>
                        {["S", "M", "L", "XL"].map((size) => (
                            <Button
                                key={size}
                                type={selectedSize === size ? "primary" : "default"}
                                style={{ backgroundColor: selectedSize === size ? "black" : "white", color: selectedSize === size ? "white" : "black" }}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Button danger>-</Button>
                            <span >1</span>
                            <Button danger>+</Button>
                        </div>
                        <Button type="primary" style={{ backgroundColor: "black", color: "white" }}>
                            Thêm vào giỏ
                        </Button>
                    </div>
                    {/* Link "Xem chi tiết »" */}
                    <p style={{ marginTop: 20 }}>
                        <a
                            href={`/product/detail?id=2`}
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
