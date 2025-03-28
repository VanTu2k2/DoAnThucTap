import { useState } from "react";
import { loginUser } from "../../service/apiService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hook/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigate();
  const { login } = useAuth(); // Lấy hàm login từ context
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Hiện trạng thái đang tải
    try {
      const response = await loginUser(formData);
      login(response.data.user);
      navigation("/");
    } catch (error: any) {
      // setMessage(`Error: ${error.response?.data?.message || error.message}`);
      // setMessage("Tên người dùng hoặc mật khẩu không hợp lệ!");
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes("Invalid username or password")) {
        setMessage("Tên người dùng hoặc mật khẩu không hợp lệ!");
      } else {
        setMessage(`Đăng nhập thất bại: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false); // Tắt trạng thái đang tải
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome Back!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="username"
              placeholder="Tên đăng nhập"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <a
              onClick={() => navigation("/forgot-password")}
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Quên mật khẩu?
            </a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 font-bold rounded-md transition duration-300 ${isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {isLoading ? "Logging in..." : "Đăng nhập"}
          </button>
        </form>
        <p className="text-gray-500 text-center mt-4">{message}</p>
        <button
          onClick={() => navigation("/register")}
          className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-md transition duration-300"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
