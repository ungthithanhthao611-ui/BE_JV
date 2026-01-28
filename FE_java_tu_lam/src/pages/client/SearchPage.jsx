import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { searchProducts } from "../../api/productApi";

const SUGGESTIONS = ["Trà", "Cà phê", "Bánh", "Trà sữa", "Nước ép"];

export default function SearchPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const qInUrl = (params.get("q") || "").trim();

  const [keyword, setKeyword] = useState(qInUrl);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const [sort, setSort] = useState("newest"); // newest | priceAsc | priceDesc
  const [hoverId, setHoverId] = useState(null);

  // Sync input khi user back/forward
  useEffect(() => {
    setKeyword(qInUrl);
  }, [qInUrl]);

  // Debounce -> đẩy keyword lên URL
  useEffect(() => {
    const t = setTimeout(() => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        const val = keyword.trim();
        if (val) next.set("q", val);
        else next.delete("q");
        return next;
      });
    }, 350);

    return () => clearTimeout(t);
  }, [keyword, setParams]);

  // Call API theo URL q
  useEffect(() => {
    const q = (params.get("q") || "").trim();

    if (!q) {
      setProducts([]);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    searchProducts(q)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setProducts(data);
      })
      .catch((e) => {
        console.log("Search error:", e);
        setError("Không tìm thấy hoặc lỗi API tìm kiếm.");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [params]);

  const displayed = useMemo(() => {
    const list = [...products];

    if (sort === "priceAsc") {
      list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "priceDesc") {
      list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else {
      // newest: backend bạn đang ORDER BY id DESC rồi => giữ nguyên
    }

    return list;
  }, [products, sort]);

  const countText = useMemo(() => {
    if (!qInUrl) return "Nhập từ khóa để tìm sản phẩm";
    return `Kết quả cho: “${qInUrl}” • ${displayed.length} sản phẩm`;
  }, [qInUrl, displayed.length]);

  const handleSubmitSearch = () => {
    // ép update ngay (không chờ debounce)
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      const val = keyword.trim();
      if (val) next.set("q", val);
      else next.delete("q");
      return next;
    });
  };

  const clearAll = () => {
    setKeyword("");
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("q");
      return next;
    });
  };

  return (
    <div style={styles.page}>
      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div>
            <div style={styles.heroTitle}>🔎 Tìm kiếm sản phẩm</div>
            <div style={styles.heroSub}>
              Gõ tên trà, cà phê, bánh ngọt… rồi chọn sản phẩm bạn thích ✨
            </div>
          </div>

          {/* ✅ SỬA: QUAY LẠI TRANG CHỦ */}
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            ← Quay lại Trang Chủ
          </button>
        </div>

        {/* SEARCH BAR */}
        <div style={styles.searchBar}>
          <div style={styles.inputWrap}>
            <span style={styles.searchIcon} aria-hidden="true">
              🔍
            </span>

            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmitSearch();
              }}
              placeholder="Ví dụ: trà đào, latte, bánh tiramisu..."
              style={styles.input}
              aria-label="Tìm kiếm sản phẩm"
            />

            {keyword.trim() && (
              <button style={styles.clearBtn} onClick={clearAll} title="Xóa">
                ✕
              </button>
            )}
          </div>

          <button style={styles.searchBtn} onClick={handleSubmitSearch}>
            Tìm
          </button>
        </div>

        {/* SUGGESTIONS */}
        <div style={styles.suggestRow}>
          <span style={styles.suggestLabel}>Gợi ý:</span>
          <div style={styles.chips}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                style={styles.chip}
                onClick={() => setKeyword(s)}
                title={`Tìm "${s}"`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={styles.container}>
        <div style={styles.toolbar}>
          <div style={styles.resultText}>{countText}</div>

          <div style={styles.sortBox}>
            <span style={styles.sortLabel}>Sắp xếp:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={styles.select}
              aria-label="Sắp xếp kết quả"
            >
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá tăng dần</option>
              <option value="priceDesc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* STATES */}
        {loading && (
          <div style={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={styles.skeletonCard}>
                <div style={styles.skeletonImg} />
                <div style={styles.skeletonLine1} />
                <div style={styles.skeletonLine2} />
              </div>
            ))}
          </div>
        )}

        {!loading && error && <div style={styles.error}>{error}</div>}

        {!loading && !error && qInUrl && displayed.length === 0 && (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🥲</div>
            <div style={styles.emptyTitle}>Không có sản phẩm phù hợp</div>
            <div style={styles.emptySub}>
              Thử từ khóa khác như <b>“Trà”</b>, <b>“Cà phê”</b>, <b>“Bánh”</b> nha.
            </div>
          </div>
        )}

        {/* LIST */}
        {!loading && !error && qInUrl && displayed.length > 0 && (
          <div style={styles.grid}>
            {displayed.map((p) => {
              const isHover = hoverId === p.id;
              return (
                <Link
                  key={p.id}
                  // ✅ SỬA: ĐƯỜNG DẪN CHI TIẾT ĐÚNG (/products/123)
                  to={`/products/${p.id}`}
                  style={{ ...styles.card, ...(isHover ? styles.cardHover : null) }}
                  title="Xem chi tiết"
                  onMouseEnter={() => setHoverId(p.id)}
                  onMouseLeave={() => setHoverId(null)}
                >
                  <div style={styles.imgWrap}>
                    <img
                      src={p.photo?.startsWith("http") ? p.photo : `${import.meta.env.VITE_API_BASE_URL}/images/${p.photo || p.image || ""}`}
                      alt={p.title || p.name}
                      style={styles.img}
                      onError={(e) => {
                        const fallback = "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22420%22%20height%3D%22320%22%3E%3Crect%20fill%3D%22%23eaeaea%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%23555%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                    />
                  </div>

                  <div style={styles.body}>
                    <div style={styles.title} title={p.title || p.name}>
                      {p.title || p.name}
                    </div>

                    <div style={styles.priceRow}>
                      <div style={styles.price}>
                        {(p.price ?? 0).toLocaleString("vi-VN")} đ
                      </div>

                      {p.price_root > 0 && p.price_root < p.price && (
                        <div style={styles.salePill}>
                          -{Math.round(((p.price - p.price_root) / p.price) * 100)}%
                        </div>
                      )}
                    </div>

                    <div style={styles.desc}>
                      {p.description ||
                        p.shortDescription ||
                        "Sản phẩm TeaShop / Bakery"}
                    </div>

                    <div style={styles.viewMore}>Xem chi tiết →</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ======================
   INLINE STYLES (pastel)
====================== */
const styles = {
  page: { background: "#f6f6f6", minHeight: "85vh" },

  hero: {
    padding: "22px 0 18px",
    background:
      "linear-gradient(90deg, #FF9A9E 0%, #FAD0C4 45%, #FBC2EB 100%)",
  },
  heroInner: {
    width: "90%",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  heroTitle: { fontSize: 22, fontWeight: 900, color: "#1a1a1a" },
  heroSub: { marginTop: 6, color: "rgba(0,0,0,0.65)", fontWeight: 600 },

  backBtn: {
    border: "none",
    background: "rgba(255,255,255,0.85)",
    padding: "10px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 800,
    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
    whiteSpace: "nowrap",
  },

  searchBar: {
    width: "90%",
    margin: "14px auto 0",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  inputWrap: {
    flex: 1,
    position: "relative",
    background: "rgba(255,255,255,0.92)",
    borderRadius: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  searchIcon: { fontSize: 16, opacity: 0.7 },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 16,
    background: "transparent",
    padding: "8px 6px",
  },
  clearBtn: {
    border: "none",
    background: "#fff0f5",
    padding: "8px 10px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 900,
  },
  searchBtn: {
    border: "none",
    cursor: "pointer",
    padding: "12px 16px",
    borderRadius: 16,
    fontWeight: 900,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
    whiteSpace: "nowrap",
  },

  suggestRow: {
    width: "90%",
    margin: "10px auto 0",
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  suggestLabel: { fontWeight: 800, color: "rgba(0,0,0,0.65)" },
  chips: { display: "flex", gap: 8, flexWrap: "wrap" },
  chip: {
    border: "none",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.85)",
    fontWeight: 800,
  },

  container: { width: "90%", margin: "18px auto 30px" },

  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 14,
  },
  resultText: { color: "#333", fontWeight: 800 },
  sortBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "8px 10px",
  },
  sortLabel: { color: "#666", fontWeight: 800 },
  select: {
    border: "none",
    outline: "none",
    fontWeight: 800,
    cursor: "pointer",
    background: "transparent",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 16,
  },

  card: {
    textDecoration: "none",
    color: "#111",
    background: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #eee",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    transform: "translateY(0px)",
    transition: "transform 150ms ease",
  },
  cardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
  },

  imgWrap: { width: "100%", height: 170, background: "#fafafa" },
  img: { width: "100%", height: "100%", objectFit: "cover" },

  body: { padding: 12 },
  title: {
    fontWeight: 900,
    marginBottom: 8,
    lineHeight: 1.2,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  priceRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  price: { color: "#ff5fa2", fontWeight: 950, marginBottom: 8 },
  salePill: {
    fontWeight: 900,
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    background: "#ffe4ec",
    color: "#b00020",
  },
  desc: { color: "#666", fontSize: 13, lineHeight: 1.35, minHeight: 34 },
  viewMore: { marginTop: 10, fontWeight: 900, color: "#333", opacity: 0.8 },

  error: {
    padding: 14,
    background: "#ffecec",
    borderRadius: 12,
    color: "#b00020",
    fontWeight: 800,
    border: "1px solid #ffd2d2",
  },

  empty: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #eee",
    padding: 22,
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { marginTop: 6, fontSize: 18, fontWeight: 950 },
  emptySub: { marginTop: 6, color: "#666", fontWeight: 700 },

  // Skeleton
  skeletonCard: {
    background: "#fff",
    borderRadius: 16,
    border: "1px solid #eee",
    padding: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },
  skeletonImg: {
    height: 150,
    borderRadius: 12,
    background: "linear-gradient(90deg, #f2f2f2 0%, #eaeaea 50%, #f2f2f2 100%)",
  },
  skeletonLine1: {
    marginTop: 10,
    height: 14,
    borderRadius: 999,
    background: "#eee",
    width: "85%",
  },
  skeletonLine2: {
    marginTop: 8,
    height: 12,
    borderRadius: 999,
    background: "#eee",
    width: "65%",
  },
};