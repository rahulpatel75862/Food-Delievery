import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../App";
import { LoadingButton } from "@mui/lab";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setIsLoading(true);
    if (!email.trim()) {
      toast.error("Please Enter the email.");
      return;
    }
    try {
      await axios.post(`${serverUrl}/api/auth/send/otp`, { email });
      toast.success("Otp sent successfully");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send otp");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error("Please Enter the opt");
      return;
    }
    try {
      await axios.post(`${serverUrl}/api/auth/verify/otp`, { email, otp });
      toast.success("Otp verified");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify otp");
    }
  };

  const resetPassword = async () => {
    if (!newPassword.trim()) {
      toast.error("Please Enter the new password");
      return;
    }
    if (!confirmPassword.trim()) {
      toast.error("Please Enter the confirm password");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New Password and confirm Password should be same.");
      return;
    }
    try {
      await axios.post(`${serverUrl}/api/auth/reset/otp`, {
        email,
        newPassword,
      });
      toast.success("Password reset successfully");
      navigate("/signin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset Password");
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            onClick={() => navigate("/signin")}
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>
        {step == 1 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <LoadingButton
              loading={isLoading}
              onClick={sendOtp}
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#ff4d2d",
                "&:hover": { backgroundColor: "#e64323" },
                fontWeight: "bold",
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              Send OTP
            </LoadingButton>
          </div>
        )}
        {step == 2 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="number"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={() => verifyOtp()}
            >
              verify
            </button>
          </div>
        )}
        {step == 3 && (
          <div>
            <div className="mb-6">
              <label
                htmlFor="NewPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword1 ? "text" : "password"}
                  className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword1((prev) => !prev)}
                >
                  {showPassword1 ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="ConfirmPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword2 ? "text" : "password"}
                  className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword2((prev) => !prev)}
                >
                  {showPassword2 ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>
            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={() => resetPassword()}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
