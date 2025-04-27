import { Client, Message } from '@stomp/stompjs';  // Sử dụng Client và Message
import SockJS from 'sockjs-client';

// Khai báo kiểu cho stompClient (Client từ STOMP)
let stompClient: Client | null = null;

// Khai báo kiểu cho dữ liệu review
interface ReviewData {
    rating: number;
    comment: string;
}

// Hàm kết nối WebSocket
const connect = () => {
    const socket = new SockJS('/ws');  // Địa chỉ WebSocket của bạn
    stompClient = new Client({
        webSocketFactory: () => socket as WebSocket,
        onConnect: () => {
            console.log("Connected to WebSocket");
        },
        onStompError: (frame: any) => {
            console.error("STOMP error", frame);
        }
    });
    stompClient.activate();
}

// Hàm gửi đánh giá (review) qua WebSocket
const sendReview = (data: ReviewData) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: "/app/review",  // Địa chỉ đến server
            body: JSON.stringify(data),  // Dữ liệu gửi đi
        });  // Gửi dữ liệu qua WebSocket
    } else {
        console.error("WebSocket not connected");
    }
}

// Export các hàm để sử dụng ở nơi khác
export { connect, sendReview };
