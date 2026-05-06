import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTrophy } from 'react-icons/fa';

// Giả sử bạn đã có biến backgroundAuth và logo giống bên login
// import logo from './path/to/logo.png';
// import backgroundAuth from './path/to/background.jpg';
// @ts-ignore
import backgroundAuth from '../assets/backgroundAuth.png';
import { Link } from 'react-router-dom';
const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Logic xử lý đăng ký của bạn
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <section
      // 1. Giữ nguyên container giống form login của bạn
      className="w-full bg-fixed flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${backgroundAuth})` }}
    >
      {/* 2. max-w-sm: Đảm bảo độ rộng nhỏ gọn y hệt form login */}
      <div className="max-w-sm w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 border border-white/20 my-6">

        {/* Logo & Header - Đồng bộ padding và font size */}
        <div className="flex flex-col items-center">
          <div className="bg-[#f59e0b] p-4 rounded-2xl mb-4 shadow-sm animate-bounce">
            <FaTrophy className="text-white text-3xl" />
          </div>
          <h2 className="text-2xl font-bold !text-black text-center">
            Gia nhập Biệt đội
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Trở thành thiên tài tiếp theo ngay hôm nay!
          </p>
        </div>

        {/* Form Register - Đồng bộ space-y-4 giống login */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-left text-sm font-medium text-gray-700 block">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // Copy nguyên class input từ login: font-bold, py-2.5, rounded-xl...
                className="font-bold text-black block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-gray-400 focus:placeholder-transparent transition-all duration-200"
                placeholder="Nhập email của bạn"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-left text-sm font-medium text-gray-700 block">Mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-bold text-black block w-full pl-10 pr-10 py-2.5 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-gray-400 focus:placeholder-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label className="text-left text-sm font-medium text-gray-700 block">Nhập lại mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaLock />
              </span>
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="font-bold text-black block w-full pl-10 pr-10 py-2.5 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm  focus:placeholder-transparent transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button - Đồng bộ style py-3, bg-blue-600, rounded-xl */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-blue-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Đăng ký ngay"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-bold hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;
