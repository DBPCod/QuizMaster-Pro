import { useState } from "react";
import { FaRocket, FaEnvelope, FaLock, FaEyeSlash, FaEye, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
// @ts-ignore
import backgroundAuth from '../assets/backgroundAuth.png';
// @ts-ignore
import logo from "../assets/imgLogin.png";
import { CreateLoginRequest } from "../dtos/requests/CreateLoginRequest";
import authService from "../services/authService.js";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // State quản lý lỗi tại chỗ (cho lỗi 400 và validation)
  const [errors, setErrors] = useState({ password: "" });

  // State quản lý Popup thông báo (cho lỗi 403 và 404)
  const [customAlert, setCustomAlert] = useState({ show: false, message: "", type: "" });

  const closeAlert = () => setCustomAlert({ ...customAlert, show: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({ password: "" }); // Reset lỗi cũ

    const loginRequest = new CreateLoginRequest(email, password);

    // Validation Client-side
    if (!loginRequest.isValid()) {
      setErrors({ password: "Mật khẩu không đúng định dạng" });
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login(loginRequest);
      // Lưu token và chuyển hướng ở đây (ví dụ: useNavigate)
      console.log("Dữ liệu nhận được:", response);
      alert("Đăng nhập thành công!");
    } catch (err) {
      const status = err.response?.status;
      const serverMessage = err.response?.data?.message;

      if (status === 400) {
        // Lỗi 400: Hiển thị bằng span dưới ô nhập liệu
        setErrors({ password: serverMessage || "Email hoặc mật khẩu không chính xác" });
      }
      else if (status === 404) {
        // Lỗi 404: Hiển thị Custom Modal
        setCustomAlert({
          show: true,
          message: serverMessage || "Tài khoản này không tồn tại trên hệ thống!",
          type: "error"
        });
      }
      else if (status === 403) {
        // Lỗi 403: Hiển thị Custom Modal
        setCustomAlert({
          show: true,
          message: serverMessage || "Truy cập bị chặn! Tài khoản của bạn đã bị khóa.",
          type: "warning"
        });
      } else {
        setCustomAlert({
          show: true,
          message: "Đã có lỗi hệ thống xảy ra. Vui lòng thử lại sau.",
          type: "error"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="w-full min-h-screen bg-fixed flex items-center justify-center bg-cover bg-center bg-no-repeat px-4 relative"
      style={{ backgroundImage: `url(${backgroundAuth})` }}
    >
      {/* --- FORM LOGIN --- */}
      <div className="max-w-sm w-full bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20 my-8 z-10">

        <div className="flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-20 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold !text-black text-center">
            Chào mừng thiên tài trở lại
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            Sẵn sàng chinh phục bảng xếp hạng hôm nay chứ?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-700 block ml-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaEnvelope />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="font-bold bg-white text-black block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                placeholder="Nhập email của bạn"
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-medium text-gray-700 block ml-1">Mật khẩu</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`font-bold text-black bg-white block w-full pl-10 pr-10 py-2.5 border rounded-xl outline-none text-sm transition-all ${errors.password ? "border-red-500 ring-1 ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            {/* --- ERROR SPAN (Cho lỗi 400/Validation) --- */}
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 flex items-center gap-1 animate-pulse">
                <FaExclamationTriangle /> {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-70 shadow-lg shadow-blue-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>Bắt đầu thôi <FaRocket /></>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Đăng ký
          </Link>
        </div>
      </div>

      {/* --- CUSTOM MODAL ALERT (Cho lỗi 403/404) --- */}
      {customAlert.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform scale-100 animate-in zoom-in duration-300 text-center">
            <div className={`w-20 h-20 mx-auto mb-5 flex items-center justify-center rounded-full ${customAlert.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
              <FaExclamationTriangle size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Chú ý!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {customAlert.message}
            </p>
            <button
              onClick={closeAlert}
              className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
