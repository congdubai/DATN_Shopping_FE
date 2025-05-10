import { IMessage } from "@/types/backend";
import { Message } from "@stomp/stompjs";
import { useState, useEffect } from "react";

const useMessages = (socket: WebSocket | null, userName: string) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isNewMessage, setIsNewMessage] = useState<boolean>(false);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const receivedMessage: IMessage = JSON.parse(event.data);
            setMessages((prevMessages) => {
                const newMessages = [...prevMessages, receivedMessage];
                setIsNewMessage(true); // Đánh dấu có tin nhắn mới
                return newMessages;
            });
        };
    }, [socket]);

    const sendMessage = (message: IMessage) => {
        if (socket) {
            socket.send(JSON.stringify(message));
            // Thêm tin nhắn vào danh sách ngay lập tức
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    // Reset dấu hiệu có tin nhắn mới khi người dùng mở cửa sổ chat
    const resetNewMessageFlag = () => {
        setIsNewMessage(false);
    };

    return { messages, sendMessage, isNewMessage, resetNewMessageFlag };
};

export default useMessages;