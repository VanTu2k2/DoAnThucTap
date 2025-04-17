// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import RegisterForm from "../page/auth/Register";
// import GetUser from "../page/auth/GetUser";
// import LoginForm from "../page/auth/LoginForm";
// import Home from "../page/home-TrangChinh/Home";
// import SettingsDetail from "../page/setting/SettingsDetail";
// import ProfileDetail from "../page/auth/ProfileDetail";
// import ForgotPassword from "../page/auth/ForgotPassword";

// import TrangChu from "../components/home/TrangChu";
// import GioiThieu from "../components/menu/GioiThieu";
// import DichVu from "../components/menu/DichVu";

// const NavigatorBrowser: React.FC = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* <Route path="/" element={<Home />} /> */}
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/getuserid" element={<GetUser />} />
//         <Route path="/profile" element={<ProfileDetail />} />
//         <Route path="/settings" element= {<SettingsDetail />} />

//         <Route path="/" element={<TrangChu />} />
//         <Route path="/gioithieu" element={<GioiThieu />} />
//         <Route path="/dichvu" element={<DichVu />} />
//       </Routes>
//     </Router>
//   );
// };

// export default NavigatorBrowser;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import RegisterForm from "../page/auth/Register";
// import GetUser from "../page/auth/GetUser";
// import LoginForm from "../page/auth/LoginForm";
// import Home from "../page/home-TrangChinh/Home";
// import SettingsDetail from "../page/setting/SettingsDetail";
// import ProfileDetail from "../page/auth/ProfileDetail";
// import ForgotPassword from "../page/auth/ForgotPassword";

// import Menu from "../components/menu/Menu"; // Nhớ import thanh menu vào

// const NavigatorBrowser: React.FC = () => {
//   return (
//     <Router>
//       {/* Thanh menu đặt ngoài Routes để không bị re-render */}
//       <Menu />

//       <Routes>
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/getuserid" element={<GetUser />} />
//         <Route path="/profile" element={<ProfileDetail />} />
//         <Route path="/settings" element={<SettingsDetail />} />
//       </Routes>
//     </Router>
//   );
// };

// export default NavigatorBrowser;


// import React from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import RegisterForm from "../page/auth/Register";
// import GetUser from "../page/auth/GetUser";
// import LoginForm from "../page/auth/LoginForm";
// import Home from "../page/home-TrangChinh/Home";
// import SettingsDetail from "../page/setting/SettingsDetail";
// import ProfileDetail from "../page/auth/ProfileDetail";
// import ForgotPassword from "../page/auth/ForgotPassword";

// import Menu from "../components/menu/Menu";

// const NavigatorBrowser: React.FC = () => {
//   return (
//     <Router>
//       <Content />
//     </Router>
//   );
// };

// // Component chứa menu + điều hướng
// const Content: React.FC = () => {
//   const location = useLocation();

//   // Các trang không hiển thị menu
//   const hiddenMenuPaths = ["/login", "/register", "/forgot-password"];
//   const shouldShowMenu = !hiddenMenuPaths.includes(location.pathname);

//   return (
//     <>
//       {/* Chỉ hiển thị nếu không nằm trong hiddenMenuPaths */}
//       {shouldShowMenu && <Menu />} 

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/getuserid" element={<GetUser />} />
//         <Route path="/profile" element={<ProfileDetail />} />
//         <Route path="/settings" element={<SettingsDetail />} />
//       </Routes>
//     </>
//   );
// };

// export default NavigatorBrowser;


import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import RegisterForm from "../page/auth/Register";
import GetUser from "../page/auth/GetUser";
import LoginForm from "../page/auth/LoginForm";
import SettingsDetail from "../page/setting/SettingsDetail";
import ProfileDetail from "../page/auth/ProfileDetail";
import ForgotPassword from "../page/auth/ForgotPassword";

import Menu from "../components/menu/Menu";

import BookingPage from "../page/appointment-LichHen/DatLichhen";
import AppointmentList from "../page/appointment-LichHen/XemLichDatHen";
import AccountCustomer from "../page/customer-KhachHang/AccountCustomer";

const NavigatorBrowser: React.FC = () => {
  return (
    <Router>
      <Content />
    </Router>
  );
};

// Component chứa menu + điều hướng
const Content: React.FC = () => {
  const location = useLocation();

  // Các trang không hiển thị menu
  const hiddenMenuPaths = ["/login", "/register", "/forgot-password", "/profile", "/settings", "/booking", "/listbooking" ];
  const shouldShowMenu = !hiddenMenuPaths.includes(location.pathname);

  return (
    <>
      {/* Chỉ hiển thị Menu nếu không thuộc hiddenMenuPaths */}
      {shouldShowMenu && <Menu />}

      <Routes>
        {/* Các trang KHÔNG có trong Menu */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/listbooking" element={<AppointmentList />} />
        <Route path="/profile" element={<AccountCustomer />} />


        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/getuserid" element={<GetUser />} />
        {/* <Route path="/profile" element={<ProfileDetail />} /> */}
        <Route path="/settings" element={<SettingsDetail />} />
      </Routes>
    </>
  );
};

export default NavigatorBrowser;

