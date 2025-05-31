import React from "react";
import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../constants/url";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${BASE_URL}/users/signup`, formData);

      if (data.message) {
        toast.success(data.message);
        navigate("/books");
        localStorage.setItem("userInfo", JSON.stringify(data));
      }

      console.log(data, "25");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md shadow-md p-4 mx-auto mt-20 rounded-md">
      <h1 className="font-bold text-xl text-center mb-4">Signup </h1>
      <form onSubmit={submitHandler}>
        <input
          className="px-4 py-2 border rounded-md w-full mb-4"
          placeholder="Enter name"
          name="name"
          type="text"
          onChange={changeHandler}
          value={formData.name}
        />
        <input
          className="px-4 py-2 border rounded-md w-full mb-4"
          placeholder="Enter email"
          name="email"
          type="email"
          onChange={changeHandler}
          value={formData.email}
        />
        <input
          className="px-4 py-2 border rounded-md w-full mb-4"
          placeholder="Enter phone number"
          name="phoneNumber"
          onChange={changeHandler}
          value={formData.phoneNumber}
        />
        <input
          className="px-4 py-2 border rounded-md w-full mb-4"
          placeholder="Enter password"
          name="password"
          onChange={changeHandler}
          value={formData.password}
        />

        <button
          type="submit"
          className="mb-4  w-full bg-blue-900 rounded-md py-2 text-white hover:bg-blue-700 cursor-pointer "
        >
          Signup
        </button>
      </form>

      <p className="text-center">
        Already have an account?{" "}
        <a
          className="text-blue-900 font-bold hover:underline cursor-pointer "
          href="/"
        >
          Login here
        </a>
      </p>
    </div>
  );
};

export default SignupScreen;
