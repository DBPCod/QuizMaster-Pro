import { useState } from "react";
import { FaRocket, FaEnvelope, FaLock, FaEyeSlash, FaEye } from "react-icons/fa";
// 1. Sửa lại cách import ảnh (bỏ ngoặc nhọn)
// @ts-ignore
import backgroundAuth from '../assets/backgroundAuth.png';
// @ts-ignore
import logo from "../assets/imgLogin.png";
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Đang đăng nhập:", { email, password });
    setTimeout(() => {
      setLoading(false);
      alert("Đăng nhập thành công!");
    }, 1500);
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  return (
    <section
      // 2. Thêm các class để ảnh phủ kín và căn giữa
      className="w-full bg-fixed flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      // 3. Đưa style vào đúng vị trí trong thẻ mở
      style={{ backgroundImage: `url(${backgroundAuth})` }}
    >
      <div className="max-w-sm w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6 border border-white/20 my-10">

        {/* Logo & Header */}
        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-20 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold !text-black text-center">
            Chào mừng thiên tài trở lại
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Sẵn sàng chinh phục bảng xếp hạng hôm nay chứ?
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={handleEmailChange}
                className="font-bold text-black block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-gray-400 focus:placeholder-transparent transition-all duration-200"
                placeholder="Nhập email của bạn"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-left ext-sm font-medium text-gray-700 block">Mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaLock />
              </span>
              <input
                type={showPassword ? "password" : "text"}
                required
                value={password}
                onChange={handlePasswordChange}
                className="font-bold text-black block w-full pl-10 pr-3 py-2.5 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm placeholder:text-gray-400 focus:placeholder-transparent transition-all duration-200"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-blue-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Bắt đầu thôi <FaRocket />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="#" className="text-blue-600 font-bold hover:underline">
            Đăng ký
          </a>
        </div>
      </div>
    </section>
  );
}
