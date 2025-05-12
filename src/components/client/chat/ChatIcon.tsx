import React, { useState, useEffect, useRef } from "react";
import { MessageOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Input, Typography, Badge } from "antd";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useAppSelector } from "@/redux/hooks";
import useWebSocket from "@/redux/slice/useWebSocket";
import useMessages from "@/redux/slice/useMessages ";

const { Text } = Typography;

const ChatWidget = () => {
    const [visible, setVisible] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const messageEndRef = useRef<HTMLDivElement>(null);
    const user = useAppSelector(state => state.account.user);
    const userName = user.name;

    const socket = useWebSocket("ws://localhost:8080/data");
    const { messages, sendMessage, isNewMessage, resetNewMessageFlag } = useMessages(socket, userName);

    // Cuộn đến tin nhắn mới nhất khi cửa sổ chat mở
    useEffect(() => {
        if (visible && messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, visible]); // Cuộn khi tin nhắn thay đổi và khi cửa sổ chat mở

    const handleSend = () => {
        if (newMessage.trim() && socket) {
            const msg = {
                sender: userName,
                receiver: "admin",
                content: newMessage,
                timestamp: format(new Date(), "dd/MM/yyyy HH:mm"),
                isRead: false,
            };
            sendMessage(msg);  // Gửi tin nhắn
            setNewMessage("");  // Reset trường nhập
        }
    };

    // Hàm để mở cửa sổ chat và reset dấu hiệu tin nhắn mới
    const handleOpenChat = () => {
        setVisible(!visible);
        if (isNewMessage) {
            resetNewMessageFlag(); // Đánh dấu đã xem tin nhắn mới
        }
    };

    return (
        <>
            {/* Biểu tượng chat với badge đỏ nếu có tin nhắn mới */}
            <div className="chat-icon" onClick={handleOpenChat}>
                <Badge dot={isNewMessage} showZero={false}>
                    <MessageOutlined style={{ fontSize: 22, color: "white" }} />
                </Badge>

            </div>

            {visible && (
                <div className="chat-box">
                    <div className="chat-header">
                        <b>Hỗ trợ trực tuyến</b>
                        <span onClick={() => setVisible(false)} style={{ cursor: "pointer" }}>
                            ✕
                        </span>
                    </div>
                    <div className="chat-body">
                        {/* Lọc tin nhắn giữa người dùng và admin */}
                        {messages
                            .filter(
                                (msg) =>
                                    (msg.sender === userName && msg.receiver === "admin") ||
                                    (msg.sender === "admin" && msg.receiver === userName)
                            )
                            .map((msg, index) => (
                                <div
                                    key={index}
                                    style={{
                                        alignSelf: msg.sender === userName ? "flex-end" : "flex-start",
                                        background: msg.sender === userName ? "#d0f0fd" : "#f1f1f1",
                                        padding: 10,
                                        borderRadius: 10,
                                        maxWidth: "80%",
                                        marginBottom: 8,
                                    }}
                                >
                                    <Text>{msg.content}</Text>
                                    <div>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {dayjs(msg.timestamp, "DD/MM/YYYY HH:mm").format("HH:mm")}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        <div ref={messageEndRef} />
                    </div>
                    <div className="chat-input">
                        <Input
                            placeholder="Nhập tin nhắn..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onPressEnter={handleSend}
                        />
                        <Button type="dashed" onClick={handleSend}>
                            <SendOutlined />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;
