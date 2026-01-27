import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartByUser } from "../api/cartApi";

const Header = () => {
  const navigate = useNavigate();

  // user dropdown
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);

  // auth
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const name = sessionStorage.getItem("userName");
    return name ? { fullName: name } : null;
  });

  // cart
  const [cartCount, setCartCount] = useState(0);

  // search modal
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef(null);

  // Sync login/logout (multi-tab + same tab)
  useEffect(() => {
    const syncAuth = () => {
      setToken(sessionStorage.getItem("token"));
      const name = sessionStorage.getItem("userName");
      setUser(name ? { fullName: name } : null);
      fetchCartCount(); // Re-fetch cart on auth change
    };

    const fetchCartCount = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        setCartCount(0);
        return;
      }
      try {
        const res = await getCartByUser(userId);
        // Count distinct products
        const total = (res.data.items || []).length;
        setCartCount(total);
      } catch (err) {
        console.error("Failed to load cart count", err);
      }
    };

    // Initial fetch
    fetchCartCount();

    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth_changed", syncAuth);
    window.addEventListener("cart_updated", fetchCartCount); // Listen to cart updates

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth_changed", syncAuth);
      window.removeEventListener("cart_updated", fetchCartCount);
    };
  }, []);

  // Close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when open modal + ESC to close
  useEffect(() => {
    if (!searchOpen) return;

    const t = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    const onKeyDown = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [searchOpen]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear all session data
    setToken(null);
    setUser(null);
    setOpen(false);
    navigate("/login");
  };

  const handleUserIconClick = () => {
    if (!token) setOpen((v) => !v);
    else navigate("/profile");
  };

  const handleCaretClick = () => setOpen((v) => !v);

  const openSearchModal = () => {
    setSearchOpen(true);
    // nếu đang ở /search?q=... thì có thể lấy lại q, nhưng không bắt buộc
  };

  const submitSearch = () => {
    const q = searchText.trim();
    if (!q) return;

    setSearchOpen(false);

    // navigate dạng string có query param
    navigate(`/search?q=${encodeURIComponent(q)}`); // :contentReference[oaicite:2]{index=2}
  };

  const closeSearch = () => setSearchOpen(false);

  return (
    <>
      <header style={styles.header}>
        <div style={styles.container}>
          {/* LOGO */}
          <div style={styles.logo} onClick={() => navigate("/")}>
            ☕ Coffee
          </div>

          {/* MENU */}
          <nav style={styles.menu}>
            <Link style={styles.menuLink} to="/">
              Trang chủ
            </Link>
            <Link style={styles.menuLink} to="/san-pham">
              Sản phẩm
            </Link>
            <Link style={styles.menuLink} to="/tin-tuc">
              Tin tức
            </Link>
            <Link style={styles.menuLink} to="/contact">
              Liên hệ
            </Link>
          </nav>

          {/* ICONS */}
          <div style={styles.icons}>
            {/* 🔍 SEARCH -> OPEN MODAL */}
            <button
              type="button"
              style={styles.iconBtn}
              title="Tìm kiếm"
              onClick={openSearchModal}
            >
              🔍
            </button>

            {/* USER */}
            <div style={styles.userWrap} ref={dropdownRef}>
              <div style={styles.userBox}>
                <button
                  type="button"
                  style={styles.userBtn}
                  title={token ? "Trang cá nhân" : "Tài khoản"}
                  onClick={handleUserIconClick}
                >
                  👤
                  {user?.fullName ? (
                    <div style={styles.username}>{user.fullName}</div>
                  ) : (
                    <div style={styles.usernameMuted}>
                      {token ? "Tài khoản" : "Đăng nhập"}
                    </div>
                  )}
                </button>

                {token && (
                  <button
                    type="button"
                    style={styles.caretBtn}
                    onClick={handleCaretClick}
                    title="Mở menu"
                  >
                    ▾
                  </button>
                )}
              </div>

              {open && (
                <div style={styles.dropdown}>
                  {!token ? (
                    <>
                      <div
                        style={styles.dropdownItem}
                        onClick={() => {
                          setOpen(false);
                          navigate("/login");
                        }}
                      >
                        👤 Đăng nhập
                      </div>
                      <div
                        style={styles.dropdownItem}
                        onClick={() => {
                          setOpen(false);
                          navigate("/register");
                        }}
                      >
                        ✍️ Đăng ký
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={styles.dropdownItem}
                        onClick={() => {
                          setOpen(false);
                          navigate("/profile");
                        }}
                      >
                        👤 Trang cá nhân
                      </div>
                      <div style={styles.dropdownItem} onClick={handleLogout}>
                        🚪 Đăng xuất
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* CART */}
            <Link to="/cart" style={styles.cart} title="Giỏ hàng">
              🛒<span style={styles.badge}>{cartCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ======= SEARCH MODAL ======= */}
      {searchOpen && (
        <div
          style={styles.modalOverlay}
          onMouseDown={closeSearch} // click nền -> đóng (click outside) :contentReference[oaicite:3]{index=3}
        >
          <div
            style={styles.modal}
            onMouseDown={(e) => e.stopPropagation()} // click trong modal không đóng
          >
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>🔎 Tìm kiếm</div>
              <button style={styles.modalCloseBtn} onClick={closeSearch} title="Đóng">
                ✕
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.modalInputWrap}>
                <span style={styles.modalSearchIcon}>🔍</span>
                <input
                  ref={searchInputRef}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") submitSearch();
                  }}
                  placeholder="Nhập tên sản phẩm... (vd: trà đào, latte, bánh)"
                  style={styles.modalInput}
                  aria-label="Nhập từ khóa tìm kiếm"
                />
              </div>

              <div style={styles.modalActions}>
                <button style={styles.modalBtnGhost} onClick={closeSearch}>
                  Hủy
                </button>
                <button
                  style={{
                    ...styles.modalBtnPrimary,
                    opacity: searchText.trim() ? 1 : 0.6,
                    cursor: searchText.trim() ? "pointer" : "not-allowed",
                  }}
                  onClick={submitSearch}
                  disabled={!searchText.trim()}
                >
                  Tìm
                </button>
              </div>

              <div style={styles.modalHint}>
                Mẹo: nhấn <b>Enter</b> để tìm nhanh • nhấn <b>ESC</b> để đóng
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

/* ======================
   INLINE STYLE
====================== */
const styles = {
  header: {
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    padding: "10px 0",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  container: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  menu: {
    display: "flex",
    gap: 20,
    alignItems: "center",
    flexWrap: "wrap",
  },
  menuLink: {
    textDecoration: "none",
    color: "#111",
    fontWeight: 600,
  },
  icons: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
    padding: 6,
    borderRadius: 8,
  },

  userWrap: { position: "relative" },
  userBox: { display: "flex", alignItems: "center", gap: 6 },

  userBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    padding: 6,
    borderRadius: 8,
    textAlign: "center",
    minWidth: 52,
  },
  caretBtn: {
    background: "#ffe4ec",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 8,
    fontWeight: 800,
    lineHeight: 1,
  },

  username: {
    fontSize: 12,
    marginTop: 2,
    color: "#ff5fa2",
    fontWeight: 700,
    maxWidth: 90,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  usernameMuted: {
    fontSize: 12,
    marginTop: 2,
    color: "#999",
    fontWeight: 700,
    maxWidth: 90,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  dropdown: {
    position: "absolute",
    top: "120%",
    right: 0,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    width: 180,
    overflow: "hidden",
    zIndex: 99,
    border: "1px solid #eee",
  },
  dropdownItem: {
    padding: "10px 14px",
    cursor: "pointer",
    borderBottom: "1px solid #eee",
    fontWeight: 600,
  },

  cart: {
    position: "relative",
    textDecoration: "none",
    fontSize: 18,
    padding: 6,
    borderRadius: 8,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    background: "red",
    color: "#fff",
    fontSize: 11,
    borderRadius: "50%",
    padding: "2px 6px",
  },

  /* ===== modal ===== */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "min(520px, 94vw)",
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
    overflow: "hidden",
    border: "1px solid #eee",
  },
  modalHeader: {
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 45%, #FBC2EB 100%)",
  },
  modalTitle: { fontWeight: 900, color: "#111" },
  modalCloseBtn: {
    border: "none",
    background: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: 10,
    fontWeight: 900,
  },
  modalBody: { padding: 16 },

  modalInputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    border: "1px solid #eee",
    padding: "10px 12px",
    background: "#fff",
    boxShadow: "0 8px 18px rgba(0,0,0,0.06)",
  },
  modalSearchIcon: { opacity: 0.75 },
  modalInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 15,
    padding: "8px 4px",
  },

  modalActions: {
    marginTop: 12,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalBtnGhost: {
    border: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 800,
  },
  modalBtnPrimary: {
    border: "none",
    background: "#ff5fa2",
    color: "#fff",
    cursor: "pointer",
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 900,
  },
  modalHint: {
    marginTop: 10,
    color: "#666",
    fontSize: 13,
    fontWeight: 600,
  },
};
