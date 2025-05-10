import { useEffect, useState } from "react";

const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(url);

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };

        setSocket(ws);

        return () => {
            if (ws) ws.close();
        };
    }, [url]);

    return socket;
};

export default useWebSocket;
