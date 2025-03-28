import { useEffect, useState } from "react";
import { useAuth } from "../../hook/AuthContext";
import { EditOutlined as EditIcon, CameraAlt as CameraIcon, ArrowBack as BackIcon, Save as SaveIcon, Close as CloseIcon } from "@mui/icons-material";

const ProfileDetail: React.FC = () => {
  const { login, user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    description: user?.description || "",
  });

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        login(JSON.parse(storedUser)); // Khôi phục user từ localStorage
      }
    }
  }, [user, login]);

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      description: user?.description || "",
    });
    setIsChanged(false);
  }, [user]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      description: user?.description || "",
    });
    setIsChanged(false);
  };

  // const handleSaveClick = () => {
  //   if (isChanged) {
  //     setIsEditing(false);
  //     login({ ...user, ...formData });
  //     setIsChanged(false);
  //   }
  // };

  const handleSaveClick = () => {
    if (isChanged) {
      const updatedUser = { ...user, ...formData };
  
      // Lưu vào localStorage để giữ dữ liệu sau khi đăng xuất
      localStorage.setItem("user", JSON.stringify(updatedUser));
  
      // Cập nhật vào context
      login(updatedUser);
  
      setIsEditing(false);
      setIsChanged(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    // Kiểm tra xem có thay đổi không
    setIsChanged(
      newFormData.name !== user?.name ||
      newFormData.email !== user?.email ||
      newFormData.phone !== user?.phone ||
      newFormData.address !== user?.address ||
      newFormData.description !== user?.description
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
        
        {/* Tiêu đề */}
        <div className="flex items-center mb-6">
          {isEditing && <BackIcon className="cursor-pointer mr-2" onClick={handleCancelClick} />}
          <h2 className="text-xl font-semibold text-center w-full uppercase">{isEditing ? "Cập nhật thông tin" : "Thông tin tài khoản"}</h2>
        </div>

        {/* Chỉ hiển thị Avatar + Tên khi không ở chế độ chỉnh sửa */}
        {!isEditing && (
          <div className="flex items-center mb-6 border-b-4 pb-6">
            <div className="relative">
              <img src={user?.imageUrl} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
              <button className="absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full shadow-md">
                <CameraIcon className="text-white w-5 h-5" />
              </button>
            </div>
            <div className="ml-4">
              <p className="text-xl font-bold flex items-center">
                {user?.name}
                <EditIcon onClick={handleEditClick} className="ml-2 cursor-pointer bg-white rounded-full hover:bg-gray-400 hover:text-white transition duration-300"/>
              </p>
            </div>
          </div>
        )}

        {/* Thông tin cá nhân */}
        <h1 className="text-lg font-semibold">Thông tin cá nhân</h1>

        <div className="mt-4">
          <table className="w-full max-w-lg border-separate border-spacing-y-4">
            <tbody>
              {isEditing ? (
                <>
                  <tr>
                    <td className="font-medium pr-4">Tên hiển thị:</td>
                    <td><input className="border-b-2 focus:outline-none w-full" name="name" value={formData.name} onChange={handleChange} /></td>
                  </tr>
                  {/* <tr>
                    <td className="font-medium pr-4">Email:</td>
                    <td><input className="border-b-2 focus:outline-none w-full" name="email" value={formData.email} onChange={handleChange} /></td>
                  </tr> */}
                  <tr>
                    <td className="font-medium pr-4">Số điện thoại:</td>
                    <td><input className="border-b-2 focus:outline-none w-full" name="phone" value={formData.phone} onChange={handleChange} /></td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Địa chỉ:</td>
                    <td><input className="border-b-2 focus:outline-none w-full" name="address" value={formData.address} onChange={handleChange} /></td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Mô tả:</td>
                    <td><input className="border-b-2 focus:outline-none w-full" name="description" value={formData.description} onChange={handleChange} /></td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Giới tính:</td>
                    <td>
                      <label className="mr-4">
                        <input type="radio" name="gender" value="male" className="mr-1" /> Nam
                      </label>
                      <label>
                        <input type="radio" name="gender" value="female" className="mr-1" /> Nữ
                      </label>
                    </td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Ngày sinh:</td>
                    <td className="flex space-x-2">
                      <select className="border p-2 rounded">
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select className="border p-2 rounded">
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select className="border p-2 rounded">
                        {Array.from({ length: 100 }, (_, i) => (
                          <option key={2024 - i} value={2024 - i}>{2024 - i}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </>
              ) : (
                <>
                  <tr>
                    <td className="font-medium pr-4">Email:</td>
                    <td>{user?.email}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Số điện thoại:</td>
                    <td>{user?.phone}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Địa chỉ:</td>
                    <td>{user?.address}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Mô tả:</td>
                    <td>{user?.description}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Giới tính:</td>
                    {/* <td>{user?.description}</td> */}
                  </tr>
                  <tr>
                    <td className="font-medium pr-4">Ngày sinh:</td>
                    {/* <td>{user?.description}</td> */}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Nút cập nhật hoặc lưu */}
        <div className="flex justify-end items-center border-t-4 mt-6 pt-4">
          {isEditing ? (
            <div className="flex space-x-4">
              <button 
                onClick={handleCancelClick} 
                className="flex border border-gray-400 items-center text-xl font-medium rounded-md px-3 py-2 text-gray-600 bg-gray-200"
              >
                <CloseIcon className="mr-2" /> Hủy
              </button>
              <button 
                onClick={handleSaveClick} 
                disabled={!isChanged} 
                className={`flex border items-center text-xl font-medium rounded-md px-3 py-2 
                  ${isChanged ? "bg-blue-600 text-white border-blue-600" : "bg-blue-200 text-gray-600 border-gray-400 cursor-not-allowed"}`}
              >
                <SaveIcon className="mr-2" /> Lưu
              </button>
            </div>
          ) : (
            <button onClick={handleEditClick} className="flex items-center justify-center w-full text-xl font-medium text-gray-600 hover:bg-gray-400 hover:text-white">
              <EditIcon className="mr-2 cursor-pointer"/> Cập nhật
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
