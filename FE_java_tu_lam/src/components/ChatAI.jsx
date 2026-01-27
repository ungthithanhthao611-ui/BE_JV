import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { addToCart } from "../api/cartApi";
import { toast } from "./ToastContainer";

const ChatAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", content: "Chào bạn! Tôi là Halu AI. Tôi có thể giúp gì cho bạn? Bạn có thể gửi ảnh sản phẩm để tôi tìm kiếm hoặc nhờ tôi thêm món vào giỏ hàng nhé!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);
    const scrollRef = useRef(null);

    const userId = sessionStorage.getItem("userId");

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() && !image) return;

        const userMsg = { role: "user", content: input, image: image };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/ai/chat`, {
                message: input,
                image: image // Base64
            });

            const data = response.data;
            setMessages(prev => [...prev, { role: "ai", content: data.reply }]);

            // Xử lý Action tự động (VD: Thêm vào giỏ hàng)
            if (data.action && data.action.type === "ADD_TO_CART") {
                if (!userId) {
                    toast.warning("Vui lòng đăng nhập để thêm món vào giỏ hàng!");
                } else {
                    try {
                        await addToCart({ userId, productId: data.action.productId, quantity: 1 });
                        toast.success("Halu AI đã thêm món vào giỏ hàng cho bạn!");
                    } catch (err) {
                        console.error("Thêm giỏ hàng lỗi:", err);
                    }
                }
            }

        } catch (error) {
            setMessages(prev => [...prev, { role: "ai", content: "Xin lỗi, tôi đang bận một chút. Bạn thử lại sau nhé!" }]);
        } finally {
            setLoading(false);
            setImage(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={styles.container}>
            {/* Nút bong bóng */}
            <div
                style={styles.bubble}
                onClick={() => setIsOpen(!isOpen)}
                title="Chat với Halu AI"
            >
                {isOpen ? "✖" : "🤖"}
            </div>

            {/* Cửa sổ chat */}
            {isOpen && (
                <div style={styles.chatWindow}>
                    <div style={styles.header}>
                        <span style={{ fontWeight: "bold" }}>Halu AI Assistant</span>
                    </div>

                    <div style={styles.messageList} ref={scrollRef}>
                        {messages.map((m, i) => (
                            <div key={i} style={m.role === "user" ? styles.msgUser : styles.msgAI}>
                                {m.image && <img src={m.image} alt="Upload" style={styles.msgImage} />}
                                <div>{m.content}</div>
                            </div>
                        ))}
                        {loading && <div style={styles.msgAI}>Đang suy nghĩ...</div>}
                    </div>

                    {image && (
                        <div style={styles.previewContainer}>
                            <img src={image} alt="Preview" style={styles.previewImage} />
                            <span onClick={() => setImage(null)} style={styles.removeImage}>×</span>
                        </div>
                    )}

                    <div style={styles.inputArea}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current.click()}
                            style={styles.btnFile}
                        >
                            📷
                        </button>
                        <input
                            style={styles.input}
                            placeholder="Hỏi Halu AI..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button style={styles.btnSend} onClick={handleSend}>
                            🚀
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { position: "fixed", bottom: 20, right: 20, zIndex: 1000 },
    bubble: {
        width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(45deg, #ff9966, #ff5e62)",
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 30,
        cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.2)", transition: "transform 0.2s"
    },
    chatWindow: {
        position: "absolute", bottom: 80, right: 0, width: 350, height: 500,
        background: "#fff", borderRadius: 15, boxShadow: "0 5px 25px rgba(0,0,0,0.15)",
        display: "flex", flexDirection: "column", overflow: "hidden"
    },
    header: { padding: "15px", background: "#ff5e62", color: "#fff", textAlign: "center" },
    messageList: { flex: 1, padding: 15, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 },
    msgAI: { alignSelf: "flex-start", background: "#f0f0f0", padding: "10px 15px", borderRadius: "15px 15px 15px 0", maxWidth: "80%", fontSize: 14 },
    msgUser: { alignSelf: "flex-end", background: "#ff5e62", color: "#fff", padding: "10px 15px", borderRadius: "15px 15px 0 15px", maxWidth: "80%", fontSize: 14 },
    msgImage: { width: "100%", borderRadius: 10, marginBottom: 5 },
    previewContainer: { padding: 10, borderTop: "1px solid #eee", position: "relative" },
    previewImage: { width: 50, height: 50, borderRadius: 5, objectFit: "cover" },
    removeImage: { position: "absolute", top: 0, left: 55, cursor: "pointer", color: "red", fontSize: 20 },
    inputArea: { padding: 10, display: "flex", gap: 5, background: "#fff", borderTop: "1px solid #eee" },
    input: { flex: 1, border: "1px solid #ddd", borderRadius: 20, padding: "8px 15px", outline: "none" },
    btnSend: { border: "none", background: "none", fontSize: 20, cursor: "pointer" },
    btnFile: { border: "none", background: "none", fontSize: 20, cursor: "pointer" }
};

export default ChatAI;
