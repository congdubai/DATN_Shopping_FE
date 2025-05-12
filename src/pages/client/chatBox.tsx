import React, { useState, useEffect, useRef } from "react";
import { Layout, Input, Typography, List, Avatar, Badge } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useAppSelector } from "@/redux/hooks";
import { IMessage } from "@/types/backend";
import { callFetchUpdateIsRead } from "@/config/api";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const ChatBoxPage = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<(IMessage & { isNew?: boolean })[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messageEndRef = useRef<HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const user = useAppSelector(state => state.account.user);
    const uniqueUsers = Array.from(new Set(messages.map(m => m.sender).filter(name => name !== "admin")));

    useEffect(() => {
        if (uniqueUsers.length > 0 && !currentUser) {
            setCurrentUser(uniqueUsers[0]);
        }
    }, [uniqueUsers, currentUser]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/data");

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            const receivedMessage: IMessage = JSON.parse(event.data);
            setMessages((prevMessages) => {
                const isViewing = currentUser === receivedMessage.sender;
                const updatedMessage = {
                    ...receivedMessage,
                    isRead: isViewing ? true : false,
                    isNew: isViewing ? false : true,
                };
                return [...prevMessages, updatedMessage];
            });
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            alert("Lỗi kết nối với WebSocket");
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        setSocket(ws);

        return () => {
            if (ws) {
                ws.close();
            }
        };
    }, []);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = () => {
        if (socket && newMessage.trim() && currentUser) {
            const newMessageObj: IMessage = {
                sender: "admin",
                receiver: currentUser,
                content: newMessage,
                timestamp: format(new Date(), "dd/MM/yyyy HH:mm"),
                isRead: false,
            };
            setMessages(prev => [...prev, { ...newMessageObj, isNew: false }]);
            socket.send(JSON.stringify(newMessageObj));
            setNewMessage("");
        }
    };

    const handleSelectUser = async (username: string) => {
        setCurrentUser(username);

        const userMessages = messages.filter(
            (msg) => (msg.sender === username && msg.receiver === "admin") || (msg.sender === "admin" && msg.receiver === username)
        );

        if (userMessages.length > 0) {
            const sortedMessages = userMessages
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

            if (sortedMessages.length > 0) {
                const latestMessageId = sortedMessages[0].id!;

                try {
                    const response = await callFetchUpdateIsRead(latestMessageId.toString());
                    if (response.statusCode === 200) {
                        // Cập nhật trạng thái isRead cho tất cả tin nhắn trong cuộc trò chuyện này
                        setMessages(prevMessages =>
                            prevMessages.map(msg =>
                                msg.sender === username && msg.receiver === "admin"
                                    ? { ...msg, isRead: true, isNew: false }
                                    : msg
                            )
                        );
                    }
                } catch (error) {
                    console.error("Error marking messages as read:", error);
                }
            }
        }
    };

    return (
        <Layout style={{ height: "95vh", marginTop: "-65px", zIndex: 1 }}>
            <Sider width={300} style={{ background: "#fff", borderRight: "1px solid #eee" }}>
                <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
                    <Text strong style={{ fontSize: 16 }}>
                        Khách hàng
                    </Text>
                </div>
                <List
                    dataSource={uniqueUsers}
                    renderItem={(username) => {
                        const userMessages = messages.filter(
                            (msg) =>
                                (msg.sender === username && msg.receiver === "admin") ||
                                (msg.sender === "admin" && msg.receiver === username)
                        );

                        const lastMessage = userMessages[userMessages.length - 1];
                        const isUnread = userMessages.some(
                            msg =>
                                msg.sender === username &&
                                msg.receiver === "admin" &&
                                !msg.isRead
                        );

                        return (
                            <List.Item onClick={() => handleSelectUser(username)} style={{ cursor: "pointer", borderBottom: 'none' }}>
                                <List.Item.Meta
                                    avatar={
                                        <Badge dot={isUnread} offset={[-5, 30]}>
                                            <Avatar style={{ marginTop: 10, marginLeft: 10 }}>{username.charAt(0).toUpperCase()}</Avatar>
                                        </Badge>
                                    }
                                    title={<Text strong={isUnread}>{username}</Text>}
                                    description={
                                        lastMessage ? (
                                            <Text type="secondary" strong={isUnread}>
                                                {lastMessage.content}
                                            </Text>
                                        ) : (
                                            <Text type="secondary">Chưa có tin nhắn</Text>
                                        )
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            </Sider>

            <Layout>
                <Header style={{ background: "#fff", paddingLeft: 15, borderBottom: "1px solid #eee" }}>
                    <Text strong>{currentUser || "Chọn khách hàng"}</Text>
                </Header>
                <Content style={{ padding: 24, background: "#f9f9f9", overflowY: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {messages
                            .filter(msg =>
                                currentUser &&
                                ((msg.sender === "admin" && msg.receiver === currentUser) ||
                                    (msg.sender === currentUser && msg.receiver === "admin"))
                            )
                            .map((msg, index) => (
                                <div key={index} style={{ alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start" }}>
                                    <div style={{ background: msg.sender === "admin" ? "#e6f4ff" : "#fff", padding: 12, borderRadius: 12 }}>
                                        <div><Text style={{ fontSize: 18 }}>{msg.content}</Text></div>
                                        <Text type="secondary" style={{ fontSize: 10 }}>{dayjs(msg.timestamp, "DD/MM/YYYY HH:mm").format("HH:mm")}</Text>
                                    </div>
                                </div>
                            ))}
                        <div ref={messageEndRef} />
                    </div>
                </Content>

                <div style={{ padding: 16, borderTop: "1px solid #eee", background: "#fff" }}>
                    <Input
                        placeholder="Type message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onPressEnter={handleSend}
                        suffix={<SendOutlined onClick={handleSend} style={{ cursor: "pointer" }} />}
                    />
                </div>
            </Layout>
        </Layout>
    );
};

export default ChatBoxPage;
