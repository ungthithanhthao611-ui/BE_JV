import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({ children }) {
  return (
    <div style={styles.container}>
      <AdminSidebar />

      <main style={styles.mainContent}>
        <AdminHeader />
        <div style={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f2f4f8",
    fontFamily: "Segoe UI, sans-serif",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  pageContent: {
    padding: 20,
  },
};
