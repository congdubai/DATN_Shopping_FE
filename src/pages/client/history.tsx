import { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Divider, Pagination, Row } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchHistory } from "@/redux/slice/historySlide";
import ModalRate from "@/components/client/history/history.modal";
import { IHistory } from "@/types/backend";
import ViewHistoryDetail from "@/components/client/history/historyDetail";

const HistoryPage = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.account.user);
    const histories = useAppSelector(state => state.history.result);
    const meta = useAppSelector(state => state.history.meta);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataInit, setDataInit] = useState<IHistory | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const pageSize = 10;

    useEffect(() => {
        dispatch(fetchHistory({ query: `page=${currentPage}&size=${pageSize}` }));
    }, [dispatch, currentPage, pageSize, openModal]);

    const reloadHistory = () => {
        dispatch(fetchHistory({ query: `page=${currentPage}&size=${pageSize}` }));
    };

    return (
        <>
            <div style={{ padding: "20px", paddingTop: 160, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                <Row justify="center">
                    <Col span={19}>
                        <Col style={{ paddingTop: 5, paddingBottom: 20 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
                                <Breadcrumb.Item>Lịch sử mua hàng</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={24}>
                                <Card bordered={false} style={{ borderRadius: 3 }}>
                                    <Row align="middle">
                                        <Col
                                            xs={24}
                                            md={24}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                marginTop: -15
                                            }}
                                        >
                                            <h2 style={{ margin: 0 }}>Lịch sử đơn hàng:</h2>
                                            <p>
                                                <a
                                                    href="#"
                                                    style={{
                                                        textDecoration: "underline",
                                                        textUnderlineOffset: "4px",
                                                        color: "black"
                                                    }}
                                                >
                                                    {histories.length} Sản phẩm
                                                </a>
                                            </p>
                                        </Col>
                                        <Divider style={{ margin: "10px 0" }} />

                                        {histories.length === 0 ? (
                                            <div style={{ padding: "20px 5px", fontSize: 16, fontFamily: "'Geologica', sans-serif" }}>
                                                Bạn chưa mua đơn nào.
                                            </div>
                                        ) : (
                                            histories.map((item, index) => {
                                                const isDisabled =
                                                    item.status !== "Đã hoàn thành" ||
                                                    item.rating === true ||
                                                    item.userId !== user.id;
                                                return (
                                                    <Row key={item.id} style={{ marginTop: 25, alignItems: "start", width: "100%" }}>
                                                        <Col span={6} xs={24} md={3}>
                                                            <img
                                                                src={`${backendUrl}/storage/product/${item.image}`}
                                                                alt="Sản phẩm"
                                                                style={{ width: "100%", borderRadius: "2px", height: "120px" }}
                                                            />
                                                        </Col>

                                                        {/* Thông tin sản phẩm */}
                                                        <Col xs={24} md={14} flex="1" style={{ marginLeft: 10, display: "flex", flexDirection: "column" }}>
                                                            <h3 style={{ margin: 0 }}>{item.name}</h3>
                                                            <p style={{ margin: "5px 0" }}>
                                                                Size: {item.size} - Màu: {item.color}
                                                            </p>

                                                            <Col
                                                                style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    width: "100%",
                                                                    marginTop: 8
                                                                }}
                                                            >
                                                                <h3 style={{ margin: 0 }}>x{item.quantity}</h3>
                                                            </Col>
                                                        </Col>

                                                        <Col xs={24} md={7} style={{ textAlign: "right", marginTop: "-5px" }}>
                                                            <span style={{ color: "red", fontWeight: 600, fontSize: 18 }}>{item.status}</span>

                                                            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <h4 style={{ marginLeft: 215, textDecoration: 'line-through', color: "gray" }}>{item.price.toLocaleString()}</h4>
                                                                <h4 style={{ margin: 0 }}>{item.price.toLocaleString()}</h4>
                                                            </div>

                                                            <div style={{ marginTop: 9, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <h4 style={{ marginLeft: 165, fontWeight: 500 }}>Tổng số tiền:</h4>
                                                                <h3 style={{ margin: 0 }}>
                                                                    {(item.price * item.quantity).toLocaleString()}đ
                                                                </h3>
                                                            </div>

                                                            <div style={{ margin: "20px 0" }}>
                                                                <Button
                                                                    style={{ margin: "0 5px", fontFamily: "'Geologica', sans-serif" }}
                                                                    onClick={() => {
                                                                        setOpenViewDetail(true);
                                                                        setDataInit(item);
                                                                    }}
                                                                >
                                                                    Xem chi tiết đơn hàng
                                                                </Button>
                                                                <Button
                                                                    style={{
                                                                        backgroundColor: !isDisabled ? "black" : "#d9d9d9",
                                                                        fontFamily: "'Geologica', sans-serif",
                                                                        color: !isDisabled ? "white" : "#888",
                                                                        borderColor: !isDisabled ? "black" : "#d9d9d9",
                                                                        cursor: !isDisabled ? "pointer" : "not-allowed",
                                                                    }}
                                                                    disabled={isDisabled}
                                                                    onClick={() => {
                                                                        setOpenModal(true);
                                                                        setDataInit(item);
                                                                    }}
                                                                >
                                                                    {item.rating === true ? "Đã đánh giá" : "Đánh giá"}
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                        <Divider style={{ margin: "5px 0" }} />
                                                    </Row>
                                                );
                                            })
                                        )}
                                        {histories.length > 0 && (
                                            <div style={{ width: "100%", textAlign: "right", marginTop: 10 }}>
                                                <Pagination
                                                    current={meta.page}
                                                    pageSize={meta.pageSize}
                                                    showSizeChanger
                                                    total={meta.total}
                                                    showTotal={(total, range) => `${range[0]}-${range[1]} trên ${total} rows`}
                                                    onChange={(page, pageSize) => setCurrentPage(page)}
                                                />
                                            </div>
                                        )}
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            <ModalRate
                openModal={openModal}
                setOpenModal={setOpenModal}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
            <ViewHistoryDetail
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadHistory={reloadHistory}
            />

        </>
    );
};

export default HistoryPage;
