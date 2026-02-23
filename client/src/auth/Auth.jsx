import React, { useState } from "react";
import axios from "axios";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const res = await axios.post(url, data);
      alert(res.data);
    } catch (err) {
      alert(err.response.data);
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <h2>{isLogin ? "Login Form" : "Register Form"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">{isLogin ? "LOGIN" : "REGISTER"}</button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)} className="switch">
          {isLogin
            ? "Not a member? Signup now"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
