/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { loginAdmin } from "../services/adminService";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginAdmin(email, password);
      localStorage.setItem("token", res.token);
      console.log("token", res.token);
      localStorage.setItem("adminData", JSON.stringify(res.data));
      setMessage(res.messageAr);
      console.log("Admin Data:", res.data);
    } catch (err) {
      setMessage("فشل تسجيل الدخول");
      console.error(err);
    }
  };

  return (
    <div
      style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}
    >
      <h1>تسجيل الدخول كـ Admin</h1>
      <input
        type="email"
        placeholder="البريد"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          margin: "10px auto",
          width: "100%",
          padding: "10px",
        }}
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          margin: "10px auto",
          width: "100%",
          padding: "10px",
        }}
      />
      <button
        onClick={handleLogin}
        style={{ padding: "10px 20px", marginTop: "10px" }}
      >
        تسجيل الدخول
      </button>
      <p>{message}</p>
    </div>
  );
};

export default Login;
