import { useState } from "react";
import { registerUser, verifyOtp } from "../../service/apiService";
import axios from "axios";
import { CloudUpload } from "lucide-react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../hook/AuthContext"; // Import context
import { loginUser } from "../../service/apiService"; // Import API login

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    address: "",
    description: "",
    phone:"",
    imageUrl: "", // Lưu avatar dưới dạng URL từ Cloudinary
  });
  const [message, setMessage] = useState<string>("");
  const [otp, setOtp] = useState<string>(""); // OTP state
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false); // Trạng thái OTP đã gửi
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false); // Trạng thái OTP đã xác thực
  const [isLoading, setIsLoading] = useState<boolean>(false); // Trạng thái xử lý
  const [imageFile, setImageFile] = useState<File | null>(null); // Lưu trữ file ảnh
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth(); // Lấy hàm login từ context
  const navigation = useNavigate();
  const handleNavigation = (path: string) => {
    navigation(path);
  };

  const handleRegisterSuccess = async () => {
    try {
      // Tự động đăng nhập với thông tin vừa đăng ký
      const response = await loginUser({ 
        username: formData.username, 
        password: formData.password 
      });
  
      login(response.data.user); // Lưu user vào context
      navigation("/"); // Chuyển sang trang chủ
  
    } catch (error) {
      console.error("Tự động đăng nhập thất bại:", error);
      navigation("/login"); // Nếu lỗi, chuyển về trang login
    }
  };

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    username: false,
    password: false,
    address: false,
    description: false,
    phone: false,
  });
  
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    address: "",
    description: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm cập nhật trạng thái focus
  const handleFocus = (field: string, value: boolean) => {
    setIsFocused((prev) => ({ ...prev, [field]: value }));
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Kiểm tra kích thước ảnh
      if (file.size > 1048576) {
        setMessage("Ảnh tải lên quá lớn. Vui lòng chọn ảnh dưới 1MB.");
        return;
      }

      // Tạo URL preview ảnh
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); // Cập nhật URL preview
      setImageFile(file); // Cập nhật file ảnh

      // Xóa ảnh trước đó (nếu có)
      if (formData.imageUrl) {
        try {
          const publicId = formData.imageUrl.split("/").pop()?.split(".")[0];
          await axios.post(
            `https://api.cloudinary.com/v1_1/dokp7ig0u/delete_by_token`,
            { public_id: publicId }
          );
        } catch (error) {
          console.error("Lỗi khi xóa ảnh cũ:", error);
        }
      }

      setMessage(
        "Ảnh đã được chọn. Ảnh sẽ được tải lên khi bạn nhấn 'Đăng ký'."
      );
    }
  };

  const validateName = (value) => {
    const nameRegex = /^[A-Za-zÀ-ỹ\s]{2,50}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, name: "Họ và Tên không được để trống" }));
    } else if (!nameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        name: "Tên chỉ chứa chữ cái, khoảng trắng, từ 2-50 ký tự",
      }));
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, email: "Email không được để trống" }));
    } else if (!emailRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Email phải có đuôi @gmail.com",
      }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validateUsername = (value) => {
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, username: "Tên đăng nhập không được để trống" }));
    } else if (!usernameRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        username: "Tên đăng nhập ít nhất 4 ký tự, không dấu cách",
      }));
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }
  };
  
  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*@)[A-Za-z\d@]{8,30}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, password: "Mật khẩu không được để trống" }));
    } else if (!passwordRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải có 8-30 ký tự, gồm chữ hoa, chữ thường, số và ít nhất 1 ký tự '@'",
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const validateAddress = (value) => {
    const addressRegex = /^[A-Za-z0-9À-ỹ\s,./-]{3,100}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, address: "Địa chỉ không được để trống" }));
    } else if (!addressRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        address: "Địa chỉ chứa chữ, số, khoảng trắng, dấu phẩy và dấu chấm (3-100 ký tự)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, address: "" }));
    }
  };

  const validateDescription = (value) => {
    const descriptionRegex = /^[A-Za-z0-9À-ỹ\s,./-]{3,100}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, description: "Mô tả không được để trống" }));
    } else if (!descriptionRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        description: "Mô tả chứa chữ, số, khoảng trắng, dấu phẩy và dấu chấm (3-100 ký tự)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const validatePhone = (value) => {
    const phoneRegex = /^0\d{9}$/;
    if (!value) {
      setErrors((prev) => ({ ...prev, phone: "Vui lòng nhập số điện thoại" }));
    } else if (!phoneRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số và bắt đầu bằng số 0",
      }));
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateName(formData.name);
    validateEmail(formData.email);
    validateUsername(formData.username);
    validatePassword(formData.password);
    validateAddress(formData.address);
    validateDescription(formData.description);
    validatePhone(formData.phone);
    
    if (Object.values(errors).some((error) => error !== "")) {
      return;
    }
  
    setIsLoading(true);
    try {
      let imageUrl = formData.imageUrl;

      // Tải ảnh lên Cloudinary nếu có file
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "spamassage");
  
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
          uploadFormData
        );
        imageUrl = response.data.secure_url; // Lấy URL ảnh
      }

      // Tải ảnh lên Cloudinary nếu có file
      if (imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "spamassage");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dokp7ig0u/image/upload",
          uploadFormData
        );
        imageUrl = response.data.secure_url; // Lấy URL ảnh
      }
  
      // Gửi thông tin đăng ký
      const userToRegister = { ...formData, imageUrl };

      // Gửi yêu cầu đăng ký với thông tin avatar từ Cloudinary
      await registerUser(userToRegister); // Gửi thông tin đăng ký
      setMessage("OTP đã được gửi đến email của bạn.");
      setIsOtpSent(true); // OTP đã được gửi
    } catch (error: unknown) {
        if (error instanceof Error) {
          const err = error as any;
          setMessage(`Error: ${err.response?.data?.message || err.message}`);
        } else {
          setMessage("Đã xảy ra lỗi không xác định.");
        }
      } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await verifyOtp(
        new URLSearchParams({
          email: formData.email,
          otp: otp,
        })
      );
      if (response.data.message === "OTP verified successfully") {
        setIsOtpVerified(true);
        setMessage(
          "OTP đã được xác thực thành công. Bạn có thể hoàn tất đăng ký."
        );
      } else {
        setMessage("OTP không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error: any) {
      setMessage(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100">
      <form
        onSubmit={handleSubmit}
        // className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl transform transition-all"
        className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl transform transition-all hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Đăng ký thành viên</h2>

        {!isOtpSent ? (
          <>
            <div className="gap-4 mb-4">
              <div className="relative">
                <label
                  className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                    isFocused.name || formData.name
                      ? "-top-3 left-3 text-gray-500 text-sm"
                      : "top-5 left-4 text-gray-500 text-lg"
                  }`}
                >
                  Họ và Tên *
                </label>

                <input
                  name="name"
                  value={formData.name}
                  placeholder="Họ và Tên"
                  onChange={(e) => {
                    handleChange(e); // Cập nhật giá trị vào formData
                    validateName(e.target.value); // Kiểm tra lỗi ngay khi nhập
                  }}
                  onFocus={() => handleFocus("name", true)}
                  onBlur={() => handleFocus("name", false)}
                  className={`w-full p-4 pt-6 text-base border rounded-md focus:outline-none focus:ring-2 ${
                    errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
              {/* Hiển thị lỗi nếu có */}
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <label
                  className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                    isFocused.email || formData.email
                      ? "-top-3 left-3 text-gray-500 text-sm"
                      : "top-5 left-4 text-gray-500 text-lg"
                  }`}
                >
                  Email *
                </label>

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  placeholder="Email"
                  onChange={(e) => {
                    handleChange(e); // Cập nhật giá trị vào formData
                    validateEmail(e.target.value); // Kiểm tra lỗi ngay khi nhập
                  }}
                  onFocus={() => handleFocus("email", true)}
                  onBlur={() => handleFocus("email", false)}
                  className={`w-full p-4 pt-6 text-base border rounded-md focus:outline-none focus:ring-2 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-1/2 relative">
                <label
                  className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                    isFocused.username || formData.username
                      ? "-top-3 left-3 text-gray-500 text-sm"
                      : "top-5 text-gray-500 text-lg"
                  }`}
                >
                  Tên đăng nhập *
                </label>
                <input
                  name="username"
                  value={formData.username}
                  placeholder="Tên đăng nhập"
                  onChange={(e) => {
                    handleChange(e); // Cập nhật giá trị vào formData
                    validateUsername(e.target.value); // Kiểm tra lỗi ngay khi nhập
                  }}
                  onFocus={() => handleFocus("username", true)}
                  onBlur={() => handleFocus("username", false)}
                  className={`w-full p-4 pt-6 text-base border rounded-md focus:outline-none focus:ring-2 ${
                    errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {errors.username && <p className="text-red-600 text-sm mt-1">{errors.username}</p>}
              </div>

              <div className="w-1/2 relative">
                <div className="relative">
                  <label
                    className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                      isFocused.password || formData.password
                        ? "-top-3 left-3 text-gray-500 text-sm"
                        : "top-5 left-4 text-gray-500 text-lg"
                    }`}
                  >
                    Mật khẩu *
                  </label>

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="Mật khẩu"
                    onChange={(e) => {
                      handleChange(e); // Cập nhật giá trị vào formData
                      validatePassword(e.target.value); // Kiểm tra lỗi ngay khi nhập
                    }}
                    onFocus={() => handleFocus("password", true)}
                    onBlur={() => handleFocus("password", false)}
                    className={`w-full p-4 pt-6 text-base border rounded-md focus:outline-none focus:ring-2 ${
                      errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <label
                  className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                    isFocused.address || formData.address
                      ? "-top-3 left-3 text-gray-500 text-sm"
                      : "top-5 left-4 text-gray-500 text-lg"
                  }`}
                >
                  Địa chỉ *
                </label>

                <input
                  name="address"
                  value={formData.address}
                  placeholder="Địa chỉ"
                  onChange={(e) => {
                    handleChange(e); // Cập nhật giá trị vào formData
                    validateAddress(e.target.value); // Kiểm tra lỗi ngay khi nhập
                  }}
                  onFocus={() => handleFocus("address", true)}
                  onBlur={() => handleFocus("address", false)}
                  className={`w-full p-4 pt-6 text-base border rounded-md focus:outline-none focus:ring-2 ${
                    errors.address ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <label
                  className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                    isFocused.description || formData.description
                      ? "-top-3 left-3 text-gray-500 text-sm"
                      : "top-5 left-4 text-gray-500 text-lg"
                  }`}
                >
                  Mô tả *
                </label>

                <input
                  name="description"                  
                  value={formData.description}
                  placeholder="Mô tả"
                  onChange={(e) => {
                    handleChange(e); // Cập nhật giá trị vào formData
                    validateDescription(e.target.value); // Kiểm tra lỗi ngay khi nhập
                  }}
                  onFocus={() => handleFocus("description", true)}
                  onBlur={() => handleFocus("description", false)}
                  className={`w-full p-4 pt-6 text-base border rounded-md focus:outline-none focus:ring-2 ${
                    errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="gap-4 mb-4">
              <div className="relative">
                <label
                  className={`absolute left-4 bg-white px-1 transition-all pointer-events-none ${
                    isFocused.phone || formData.phone
                      ? "-top-3 left-3 text-gray-500 text-sm"
                      : "top-5 left-4 text-gray-500 text-lg"
                  }`}
                >
                  Số điện thoại *
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  placeholder="Số điện thoại"
                  onChange={(e) => {
                    handleChange(e); // Cập nhật giá trị vào formData
                    validatePhone(e.target.value); // Kiểm tra lỗi ngay khi nhập
                  }}
                  onFocus={() => handleFocus("phone", true)}
                  onBlur={() => handleFocus("phone", false)}
                  className={`w-full p-4 pt-6 text-base border rounded-md focus:outline-none focus:ring-2 ${
                    errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-40 p-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 border-gray-300 dark:border-gray-600"
              >
                <CloudUpload className="text-gray-500 dark:text-gray-400" fontSize="large" />
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Kéo & thả hoặc nhấn để chọn ảnh</p>
                <input
                  id="file-upload"
                  type="file"
                  name="avatar"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Ảnh xem trước:</p>
                  <img
                    src={imagePreview}
                    alt="Xem trước"
                    className="w-40 h-40 object-cover rounded-xl shadow-md mx-auto border border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`w-full ${isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white p-3 rounded-md transition duration-200`}
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>

            <div className="text-center text-blue-500 mt-4">
              <button onClick={() => handleNavigation('/login')} >Đã có tài khoản? Đăng nhập</button>
            </div>
          </>
        ) : !isOtpVerified ? (
          <div className="mb-4">
            <input
              type="text"
              placeholder="Nhập OTP"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              onClick={handleVerifyOtp}
              className={`w-full ${isLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
                } text-white p-3 rounded-md transition duration-200 mt-4`}
              disabled={isLoading}
            >
              {isLoading ? "Đang xác thực..." : "Xác thực OTP"}
            </button>
          </div>
        ) : (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full text-center">
              {/* Icon xác nhận */}
              <div className="flex justify-center mb-4">
                <span className="text-green-500 text-5xl">✔</span>
              </div>
          
              {/* Tiêu đề */}
              <h2 className="text-xl font-bold text-red-600 uppercase">
                Đăng ký thành công
              </h2>
          
              {/* Nội dung */}
              <p className="text-gray-700 mt-2">
                Bạn đã đăng ký tài khoản thành công. Bạn có thể cập nhật và chỉnh sửa thông tin trong phần quản lý thông tin.
              </p>
          
              {/* Nút chuyển trang */}
              <button 
                onClick={handleRegisterSuccess} 
                className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md">
                Xác nhận
              </button>
            </div>
          </div>
        )}

        {message && (
          <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
