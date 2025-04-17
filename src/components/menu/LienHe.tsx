// import { useState, useEffect, useRef } from "react";
// import { AccountCircleOutlined, LogoutOutlined, NotificationsActiveOutlined, SettingsOutlined, Visibility, VisibilityOff, Person, Lock, LockOpen, Search, ShoppingCart, Home, AutoAwesome, SelfImprovement, Spa, People, Article, ContactMail, EventNoteOutlined, ChatBubbleOutlineOutlined, ArrowUpwardOutlined, KeyboardArrowDown, Close } from "@mui/icons-material";
// import { Avatar, Badge, IconButton, Box} from "@mui/material";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../hook/AuthContext";
// import { loginUser, logout } from "../../service/apiService";
// import { motion, AnimatePresence } from "framer-motion";
// const LienHe: React.FC = () => {
//     return (
//         <div>
//             <h2>Liên hệ nè ................................</h2>
//         </div>
//     );
// };

// export default LienHe;


// import { useState } from "react";
// import { Box, TextField, Button, Typography, Grid, Paper } from "@mui/material";
// import { motion } from "framer-motion";
// import { Spa, ContactMail } from "@mui/icons-material";

// const LienHe: React.FC = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     message: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle API call here
//     console.log("Form submitted:", formData);
//   };

//   return (
//     <Box
//       component={motion.div}
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "linear-gradient(135deg, #e0f7fa 0%, #fff 100%)",
//         p: 3,
//       }}
//     >
//       <Paper
//         elevation={4}
//         sx={{
//           borderRadius: 4,
//           p: 4,
//           maxWidth: 600,
//           width: "100%",
//           backgroundColor: "white",
//         }}
//       >
//         <Box display="flex" alignItems="center" gap={1} mb={2}>
//           <Spa color="primary" fontSize="large" />
//           <Typography variant="h5" fontWeight="bold">
//             Liên hệ với chúng tôi
//           </Typography>
//         </Box>

//         <Typography variant="body1" mb={3} color="text.secondary">
//           Hãy để lại lời nhắn, chúng tôi sẽ phản hồi bạn sớm nhất có thể.
//         </Typography>

//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Họ và tên"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 variant="outlined"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 variant="outlined"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Số điện thoại"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 variant="outlined"
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Lời nhắn"
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 multiline
//                 rows={4}
//                 variant="outlined"
//               />
//             </Grid>
//           </Grid>

//           <Button
//             type="submit"
//             variant="contained"
//             endIcon={<ContactMail />}
//             sx={{
//               mt: 3,
//               background: "linear-gradient(to right, #00bfa5, #1de9b6)",
//               color: "#fff",
//               fontWeight: "bold",
//               borderRadius: 3,
//               px: 4,
//               py: 1.5,
//               textTransform: "none",
//               "&:hover": {
//                 background: "linear-gradient(to right, #1de9b6, #00bfa5)",
//               },
//             }}
//           >
//             Gửi liên hệ
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default LienHe;


import { Box, Typography, TextField, Button, Paper } from "@mui/material";
import { Phone, Email, AccessTime, Room } from "@mui/icons-material";

const LienHe = () => {
    return (
        <Box sx={{ backgroundColor: "#f3e9dd", py: 6, px: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* TIÊU ĐỀ */}
        <Typography
            variant="h4"
            sx={{
            fontFamily: "serif",
            fontWeight: 700,
            textTransform: "uppercase",
            mb: 4,
            }}
        >
            Liên hệ
        </Typography>

        {/* FORM VÀ HÌNH */}
        <Box
            sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 5,
            width: "100%",
            maxWidth: 1400,
            alignItems: "flex-start",
            justifyContent: "center",
            }}>
                
            {/* FORM */}
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <Typography variant="h6" sx={{ fontFamily: "serif", fontWeight: 600, mb: 1 }}>
                    Thông tin liên hệ
                </Typography>
                <Typography sx={{ mb: 3, color: "#4f4f4f", fontSize: 15 }}>
                    Quý khách vui lòng để lại thông tin, bên mình nhận thư sẽ liên hệ quý khách trong thời gian sớm nhất.
                </Typography>

                <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Tên khách hàng</Typography>
                        <TextField fullWidth placeholder="Tên khách hàng" size="small" sx={{ bgcolor: "#fff7f2", borderRadius: 2 }} />
                    </Box>

                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Email</Typography>
                        <TextField fullWidth placeholder="Email" size="small" sx={{ bgcolor: "#fff7f2", borderRadius: 2 }} />
                    </Box>

                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Số điện thoại</Typography>
                        <TextField fullWidth placeholder="Số điện thoại" size="small" sx={{ bgcolor: "#fff7f2", borderRadius: 2 }} />
                    </Box>

                    <Box>
                        <Typography fontWeight={600} fontSize={14} mb={0.5}>Nội dung <span style={{ fontWeight: 400, fontStyle: "italic" }}>(không bắt buộc)</span></Typography>
                        <TextField fullWidth placeholder="Nội dung" multiline rows={4} sx={{ bgcolor: "#fff7f2", borderRadius: 2 }}/>
                    </Box>

                    <Button variant="contained" sx={{ alignSelf: "flex-start", backgroundColor: "#c96f4a", color: "white", borderRadius: "30px", px: 3, py: 1, fontWeight: "bold", textTransform: "none", "&:hover": { backgroundColor: "#b45a3d" }, }}>
                        Gửi thông tin
                    </Button>
                </Box>                
            </Box>

            {/* HÌNH ẢNH */}
            <Box
                sx={{
                    width: { xs: "100%", md: "50%" },
                    borderRadius: "40px",
                    overflow: "hidden",
                    boxShadow: 3,
                }}>
                <img
                    src="anh-spa.jpg" // thay bằng ảnh bạn muốn
                    alt="Spa Reception"
                    style={{ width: "100%", height: "auto"}}
                />
            </Box>
        </Box>

        {/* THÔNG TIN LIÊN HỆ */}
        <Box
            sx={{
            mt: 6,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            width: "100%",
            maxWidth: 1400,
            }}
        >
            {/* MAP */}
            <Box
            sx={{
                flex: 1,
                height: 400,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: 2,
            }}
            >
                <iframe
                    title="IUH - Trường Đại học Công nghiệp TP.HCM"
                    src="https://www.google.com/maps?q=Trường+Đại+học+Công+nghiệp+TP.HCM&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </Box>

            {/* THÔNG TIN */}
            <Paper elevation={2} sx={{ p: 4, borderRadius: 3, flex: 1, bgcolor: "#fff7f2" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Mọi chi tiết xin liên hệ với Siêu Spa tại:
            </Typography>

            <Typography sx={{ mb: 1 }}><Phone fontSize="small" sx={{ mr: 1 }} />Hotline: 039 6868 789</Typography>
            <Typography sx={{ mb: 1 }}><Email fontSize="small" sx={{ mr: 1 }} />info@sieuspa.vn</Typography>
            <Typography sx={{ mb: 1 }}><AccessTime fontSize="small" sx={{ mr: 1 }} />09:30 - 21:30 (Tất cả các ngày trong tuần)</Typography>
            <Typography sx={{ mt: 1 }}>
                <Room fontSize="small" sx={{ mr: 1 }} />
                CN1: 150D Nguyễn Văn Trỗi, P.14, Q. Phú Nhuận, Tp.HCM
                <br />
                <Room fontSize="small" sx={{ mr: 1 }} />
                CN2: 10D Trần Nhật Duật, P.9, Q.1, Tp.HCM
            </Typography>
            </Paper>
        </Box>
        </Box>
    );
};

export default LienHe;