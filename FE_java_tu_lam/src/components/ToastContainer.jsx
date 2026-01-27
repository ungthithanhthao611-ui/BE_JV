import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Global Toast Manager
 * Used to dispatch events to show toast notifications from anywhere
 */
export const toast = {
    success: (title, message = "") => {
        const t = message ? title : "Thành công";
        const m = message ? message : title;
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { type: 'success', title: t, message: m } }));
    },
    error: (title, message = "") => {
        const t = message ? title : "Lỗi";
        const m = message ? message : title;
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { type: 'error', title: t, message: m } }));
    },
    warning: (title, message = "") => {
        const t = message ? title : "Cảnh báo";
        const m = message ? message : title;
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { type: 'warning', title: t, message: m } }));
    }
};

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleShowToast = (e) => {
            const { type, title, message } = e.detail;
            const id = Date.now();
            setToasts(prev => [...prev, { id, type, title, message }]);

            // Auto remove after 5s
            setTimeout(() => {
                removeToast(id);
            }, 5000);
        };

        window.addEventListener('show-toast', handleShowToast);
        return () => window.removeEventListener('show-toast', handleShowToast);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="custom-toast-overlay">
            {toasts.map(t => (
                <div key={t.id} className={`custom-toast ${t.type}`}>
                    <button className="toast-close" onClick={() => removeToast(t.id)}>×</button>

                    <div className="custom-toast-content">
                        <span className="custom-toast-title">{t.title}</span>
                        <span className="custom-toast-message">{t.message}</span>
                        {t.type === 'success' && (
                            <Link to="/cart" className="toast-cart-link" onClick={() => removeToast(t.id)}>
                                [Tới giỏ hàng]
                            </Link>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
