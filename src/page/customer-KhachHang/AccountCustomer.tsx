import { useState } from "react";
import { useAuth } from "../../hook/AuthContext"; // hook lấy user đăng nhập
import ProfileDetail from "../auth/ProfileDetail";
import AppointmentList from "../appointment-LichHen/XemLichDatHen";
import { useLocation, useNavigate } from "react-router-dom";
import InvoiceList from "../bill-HoaDon/HoaDonDichVu";
import OrderCartView from "../shoppingcart-GioHang/GioHang";

const tabs = [
  { key: "account", label: "Quản lý tài khoản" },
  { key: "profile", label: "Thông tin tài khoản" },
  { key: "listbooking", label: "Lịch hẹn của tôi" },
  { key: "orders", label: "Giỏ hàng của tôi" },
  { key: "myorders", label: "Đơn hàng của tôi" },
  { key: "address", label: "Số địa chỉ nhận hàng" },
  // { key: "favorite", label: "Danh sách yêu thích" },
];

const AccountCustomer: React.FC = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const tab = pathParts[2] || "profile"; // 🟢 lấy phần sau "/profile/"

  const navigate = useNavigate();

  const { user } = useAuth(); // Lấy user từ context
  const [bookingTab, setBookingTab] = useState("appointment"); // Tabs phụ cho Booking
  
  const [invoiceTab, setInvoiceTab] = useState("productcart");
  
  const setActiveTab = (tabKey: string) => {
    if (tabKey === "profile") {
      navigate(`/profile`); // Không có thêm /profile
    } else {
      navigate(`/profile/${tabKey}`);
    }
  };

  const renderContent = () => {
    switch (tab) {
      case "account":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Thông tin tài khoản</h2>
            <div className="flex items-center mb-6 border-b-4 pb-6">
              <img
                src={user?.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md"
              />
              <div className="ml-4">
                <p className="text-xl font-bold">{user?.name}</p>
                <p className="text-base text-gray-500">{user?.email}</p>
                <button
                  onClick={() => setActiveTab("profile")}
                  className="mt-1 text-sm text-blue-500 hover:underline hover:text-blue-700 transition-colors"
                >
                  Chỉnh sửa
                </button>
              </div>
            </div>
  
            <table className="w-full border-separate border-spacing-y-4">
              <tbody>
                <tr>
                  <td className="font-medium pr-4 w-1/3">Số điện thoại:</td>
                  <td>{user?.phone || "Chưa cập nhật"}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4">Địa chỉ:</td>
                  <td>{user?.address || "Chưa cập nhật"}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4">Mô tả:</td>
                  <td>{user?.description || "Chưa cập nhật"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
  
      case "profile":
        return <ProfileDetail />;
      
      case "listbooking":        
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Danh sách lịch hẹn</h2>
            {/* Tabs phụ trong Booking */}
            <div className="flex space-x-6 border-b border-gray-200 mb-4">
              {[
                { label: "Dịch vụ chờ đặt lịch hẹn", key: "bookingdelay" },
                { label: "Lịch hẹn", key: "appointment" },
                { label: "Lịch sử", key: "history" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setBookingTab(tab.key)}
                  className={`pb-1 text-sm font-medium transition-colors ${
                    bookingTab === tab.key
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600 border-b-2 border-transparent hover:text-orange-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {invoiceTab === "bookingdelay" && (
              <InvoiceList filterByStatus={["PENDING"]} currentUserId={user?.id} />
            )}

            {bookingTab === "appointment" && (
              <AppointmentList filterByStatus={["PENDING", "SCHEDULED"]} />
            )}

            {bookingTab === "history" && (
              <AppointmentList filterByStatus={["CANCELLED", "COMPLETED", "PAID"]} />
            )}

          </div>
        );

        case "orders":        
        return (
          <div>
            <h2 className="text-xl font-semibold mb-2">Danh sách giỏ hàng</h2>
            <div className="flex space-x-6 border-b border-gray-200 mb-4">
              {[
                { label: "Giỏ hàng sản phẩm", key: "productcart" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setInvoiceTab(tab.key)}
                  className={`pb-1 text-sm font-medium transition-colors ${
                    invoiceTab === tab.key
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-600 border-b-2 border-transparent hover:text-orange-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {invoiceTab === "productcart" && (
              <OrderCartView />
            )}
          </div>
        );
        case "myorders":
          return <div>Đơn hàng của tôi</div>;
        case "address":
          return <div>Địa chỉ nhận hàng</div>;
        case "favorite":
          return <div>Danh sách yêu thích</div>;
      default:
        return <div>Chọn mục ở bên trái để xem thông tin.</div>;
    }
  };
  
  return (
    <div className="flex justify-center py-10 px-4 bg-gray-50 min-h-screen">
      <div className="flex w-full max-w-7xl gap-4">
        {/* Sidebar */}
        <div className="w-1/4">
          <div className="bg-white rounded-xl shadow p-4 space-y-5">
            <div className="flex flex-col items-center text-center mb-4">
              <img
                src={user?.imageUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                alt="Avatar"
                className="w-16 h-16 mb-3 rounded-full border-4 border-white shadow-md"
              />
              <div className="font-semibold text-gray-800">
                {user?.name ? `Chào ${user.name}` : "Tài khoản"}
              </div>
              <div
                className="text-sm text-gray-500 cursor-pointer hover:underline hover:text-blue-700"
                onClick={() => setActiveTab("profile")}
              >
                Chỉnh sửa tài khoản
              </div>
            </div>

            {tabs.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setActiveTab(tabItem.key)}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-green-100 ${
                  tab === tabItem.key ? "bg-green-100 font-medium" : ""
                }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Nội dung */}
        <div className="w-3/4">
          <div className="bg-white rounded-xl shadow p-6 min-h-[510px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountCustomer;
