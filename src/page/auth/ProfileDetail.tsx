import { useEffect } from "react";
import { useAuth } from "../../hook/AuthContext";


const ProfileDetail: React.FC = () => {


  const { login, user } = useAuth();


  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        login(JSON.parse(storedUser)); // Khôi phục user từ localStorage
      }
    }
  }, [user, login]);

  return (
    <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800  text-gray-900 dark:text-white p-9" style={
      {
        borderRadius: '10px',
        height: '100vh',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }
    }>
      <div className="w-full max-w-md" style={{ borderRadius: '10px', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          paddingBottom: '10px',
          borderBottom: '1px solid #e5e7eb',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: '1.2',
          width: '100%',
          maxWidth: '400px'
        }}>Thông tin cá nhân</h2>

        <img src={user?.imageUrl} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', marginTop: "20px" }} />

        <p className="mt-3">{user?.name}</p>

        <p className="mt-3">Email: {user?.email}</p>

        <p className="mt-3">Số điện thoại: {user?.phone}</p>

        <p className="mt-3">Địa chỉ: {user?.address}</p>

        <p className="mt-3">Mô tả: {user?.description}</p>

        
      </div>


    </div>
  );
}

export default ProfileDetail;