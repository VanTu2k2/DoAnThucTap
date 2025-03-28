import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hook/AuthContext";
import { Container, Card, CardContent, Typography, Button, Box } from "@mui/material";
import { Spa, Star, Phone, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
};

const DichVu: React.FC = () => {
    return (
        <div>
            <h2>Aloooo Dịch Vụ nè </h2>

            {/* Dịch Vụ */}
            <Container sx={{ py: 10, textAlign: "center", backgroundColor: "#f8f8f8", borderRadius: "10px" }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>Dịch Vụ Massage</Typography>
                </motion.div>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
                {["Massage Thư Giãn", "Massage Trị Liệu", "Chăm Sóc Da"].map((service, index) => (
                    <motion.div key={index} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Card sx={{ p: 4, textAlign: "center", width: 320, borderRadius: "15px", boxShadow: "5px 5px 20px rgba(0,0,0,0.2)" }}>
                        <Spa sx={{ fontSize: 60, color: "green" }} />
                        <CardContent>
                        <Typography variant="h5" fontWeight="bold">{service}</Typography>
                        <Typography color="textSecondary">Tận hưởng liệu pháp giúp cơ thể và tâm trí thư thái.</Typography>
                        </CardContent>
                    </Card>
                    </motion.div>
                ))}
                </Box>
            </Container>

            {/* Ưu Điểm */}
            <Container sx={{ py: 10, textAlign: "center", backgroundColor: "#222", color: "white", borderRadius: "10px" }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>Tại Sao Chọn Chúng Tôi?</Typography>
                </motion.div>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
                {["Chuyên gia trị liệu hàng đầu", "Không gian sang trọng", "Dịch vụ tận tâm"].map((adv, index) => (
                    <motion.div key={index} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <Card sx={{ p: 4, textAlign: "center", width: 320, backgroundColor: "#333", color: "white", borderRadius: "15px", boxShadow: "5px 5px 20px rgba(0,0,0,0.3)" }}>
                        <Star sx={{ fontSize: 60, color: "yellow" }} />
                        <CardContent>
                        <Typography variant="h5" fontWeight="bold">{adv}</Typography>
                        </CardContent>
                    </Card>
                    </motion.div>
                ))}
                </Box>
            </Container>

            {/* Liên Hệ */}
            <Container sx={{ py: 10, textAlign: "center", backgroundColor: "#111", color: "white", borderRadius: "10px" }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>Liên Hệ Ngay</Typography>
                </motion.div>
                <Typography variant="h6" mt={2}>Đặt lịch ngay hôm nay để trải nghiệm dịch vụ chăm sóc sức khỏe đỉnh cao.</Typography>
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="contained" color="success" startIcon={<Phone />} sx={{ px: 5, py: 2, fontSize: "16px", borderRadius: "30px", transition: "0.3s", '&:hover': { boxShadow: "0px 0px 15px rgba(0,255,0,0.8)" } }}>
                    Gọi Ngay
                </Button>
                <Button variant="contained" color="primary" startIcon={<LocationOn />} sx={{ px: 5, py: 2, fontSize: "16px", borderRadius: "30px", transition: "0.3s", '&:hover': { boxShadow: "0px 0px 15px rgba(0,0,255,0.8)" } }}>
                    Xem Bản Đồ
                </Button>
                </Box>
            </Container>
        </div>

    );
};

export default DichVu;