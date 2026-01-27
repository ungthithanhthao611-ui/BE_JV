import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("processing"); // processing, success, failure

    const orderId = searchParams.get("orderId");
    const resultCode = searchParams.get("resultCode");
    const message = searchParams.get("message");
    const transId = searchParams.get("transId");

    useEffect(() => {
        // Xác định status dựa trên resultCode
        if (resultCode === "0") {
            setStatus("success");
        } else {
            setStatus("failure");
        }

        // ✅ GỌI API BACKEND để đảm bảo order được update
        // (Phòng trường hợp MoMo IPN fail do ngrok/network)
        if (orderId && resultCode) {
            console.log(">>> 📦 Payment return:", { orderId, resultCode, transId });

            fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/momo-return?orderId=${orderId}&resultCode=${resultCode}&transId=${transId || ''}&message=${message || ''}`)
                .then(res => res.json())
                .then(data => {
                    console.log(">>> Payment return processed:", data);

                    // Nếu thanh toán  thành công, tìm order và update status
                    if (resultCode === "0") {
                        console.log(">>> ✅ Payment SUCCESS! Finding order...");

                        // ✅ TÌM ORDER QUA MOMO_ORDER_ID
                        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/find-by-momo?momoOrderId=${orderId}`)
                            .then(res => {
                                if (!res.ok) {
                                    throw new Error(`Cannot find order: ${res.status}`);
                                }
                                return res.json();
                            })
                            .then(order => {
                                console.log(">>> Found order:", order);
                                const dbOrderId = order.orderId;

                                console.log(`>>> Updating order #${dbOrderId} to CONFIRMED...`);

                                // Gọi API update status
                                return fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${dbOrderId}/status?status=CONFIRMED`, {
                                    method: 'PUT'
                                });
                            })
                            .then(response => {
                                if (response && response.ok) {
                                    console.log(">>> ✅ Order status updated to CONFIRMED!");
                                } else if (response) {
                                    return response.text().then(text => {
                                        console.error(">>> ❌ API Error:", response.status, text);
                                    });
                                }
                            })
                            .catch(err => console.error(">>> ❌ Failed:", err));
                    }
                })
                .catch(err => console.error(">>> Error processing payment return:", err));
        }
    }, [resultCode, orderId, transId, message]);

    return (
        <div className="page-wrapper">
            <Header />
            <div className="container" style={{ padding: "50px 0", textAlign: "center" }}>
                {status === "success" ? (
                    <div className="result-box success">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                            alt="Success"
                            style={{ width: "80px", marginBottom: "20px" }}
                        />
                        <h2 style={{ color: "#28a745", marginBottom: "15px" }}>Thanh toán thành công!</h2>
                        <p className="result-msg">Cảm ơn bạn đã mua hàng. Đơn hàng <b>{orderId}</b> đã được thanh toán.</p>
                        <p>Mã giao dịch MoMo: {transId}</p>
                    </div>
                ) : (
                    <div className="result-box failure">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/753/753345.png"
                            alt="Failure"
                            style={{ width: "80px", marginBottom: "20px" }}
                        />
                        <h2 style={{ color: "#dc3545", marginBottom: "15px" }}>Thanh toán thất bại</h2>
                        <p className="result-msg">{message}</p>
                        <p>Mã đơn hàng: {orderId}</p>
                    </div>
                )}

                <div className="action-buttons" style={{ marginTop: "30px" }}>
                    <Link to="/profile" className="btn btn-primary" style={{ marginRight: "10px", padding: "10px 20px", background: "#333", color: "#fff", textDecoration: "none", borderRadius: "4px" }}>
                        Xem đơn hàng
                    </Link>
                    <Link to="/" className="btn btn-secondary" style={{ padding: "10px 20px", border: "1px solid #333", color: "#333", textDecoration: "none", borderRadius: "4px" }}>
                        Về trang chủ
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentResultPage;
