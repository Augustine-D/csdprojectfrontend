import React from "react";
import { logout } from "../utils/logout";

const DashboardLayout = ({ title, children }) => {
  const phone = localStorage.getItem("phone");
  const role = localStorage.getItem("role");

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>{title}</h2>
        <div>
          <span style={styles.info}>{role} - {phone}</span>
          <button style={styles.logout} onClick={logout}>Logout</button>
        </div>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles = {
  container: { minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: {
    backgroundColor: "#004aad",
    color: "white",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: { marginRight: "15px" },
  logout: {
    background: "red",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  main: { padding: "20px" },
};

export default DashboardLayout;
