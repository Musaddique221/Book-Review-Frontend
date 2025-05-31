import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${BASE_URL}/users/login`, formData);
      if (data.message) {
        toast.success(data.message);
        navigate("/books");
        localStorage.setItem("userInfo", JSON.stringify(data));
      }
      console.log(data, "19");
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  console.log(formData, "11");
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
      <h1 className="font-bold text-center mb-6 text-xl">Login</h1>
      <form className="space-y-4" onSubmit={submitForm}>
        <input
          type="text"
          name="email"
          value={formData.email}
          placeholder="Enter email"
          className="px-4 py-2 rounded-md border w-full "
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          className="px-4 py-2 rounded-md border w-full "
          onChange={handleChange}
        />
        <button
          type="submit"
          className="mb-4  w-full bg-blue-900 rounded-md py-2 text-white hover:bg-blue-700 cursor-pointer "
        >
          Login
        </button>
      </form>

      <p className="space-y-4 text-center">
        Don't Have Account?{" "}
        <a
          className="text-blue-900 font-bold hover:underline cursor-pointer "
          href="/signup"
        >
          Signup Here
        </a>
      </p>
    </div>
  );
};

export default LoginScreen;
