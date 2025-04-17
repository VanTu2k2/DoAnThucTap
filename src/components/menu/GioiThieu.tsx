import { useEffect } from "react";
import { Container, Card, CardContent, Typography, Button, Box } from "@mui/material";
import { Spa, Star, Phone, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } }
  };

  const GioiThieu: React.FC = () => {
  // useEffect(() => {
  //   document.title = "Hệ Thống Massage Trị Liệu | Thư Giãn & Sức Khỏe";
  // }, []);

  const images = ["/trilieu1.png", "/trilieu2.jpg", "/massage-tri-lieu.jpg"]; // Danh sách ảnh
  
  return (
    <div>
      {/* <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{
          backgroundImage: "url('https://source.unsplash.com/1600x900/?spa,relax,luxury')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: "20px",
          backgroundColor: "rgba(0,0,0,0.6)",
          boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)"
        }}>
        <Container>
          <Typography variant="h2" fontWeight="bold" sx={{ textShadow: "2px 2px 15px rgba(255,255,255,0.5)" }}>
            Trải Nghiệm Massage Trị Liệu Cao Cấp
          </Typography>
          <Typography variant="h5" mt={2} sx={{ textShadow: "1px 1px 10px rgba(255,255,255,0.5)" }}>
            Thư giãn – Hồi phục – Cân bằng cơ thể
          </Typography>
        </Container>
      </motion.section>

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
      </Container> */}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://source.unsplash.com/1600x900/?wellness,spa,therapy')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "120px 20px",
          textAlign: "center"
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Hành Trình Hồi Phục & Thăng Hoa Cảm Xúc
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Massage trị liệu không chỉ là thư giãn mà là sự kết nối giữa cơ thể và tâm trí. Hãy để mỗi giác quan của bạn được đánh thức và chăm sóc toàn diện.
          </Typography>
        </Container>
      </motion.section>

      {/* <Container sx={{ py: 14, maxWidth: "lg" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
          >
            Về Chúng Tôi
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              maxWidth: 900,
              mx: "auto",
              color: "gray",
              mt: 2,
              fontSize: { xs: "1rem", md: "1.25rem" },
              lineHeight: 1.8,
              px: { xs: 2, md: 0 },
            }}
          >
            Chúng tôi không chỉ cung cấp dịch vụ massage mà còn là hành trình chăm sóc sức khỏe thể chất và tinh thần một cách toàn diện.
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            alignItems: "stretch",
            flexDirection: { xs: "column", md: "row" },
            mt: 12,
            px: { xs: 2, md: 4 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              maxWidth: { md: "50%" },
              display: "flex",
              alignItems: "stretch",
            }}
          >
            <img
              src={images[0]}
              alt="Về chúng tôi"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "24px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
              }}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              maxWidth: { md: "50%" },
              pl: { md: 6 },
              pt: { xs: 6, md: 0 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              sx={{ fontSize: { xs: "1.75rem", md: "2.25rem" } }}
            >
              Sứ Mệnh & Giá Trị Cốt Lõi
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.2rem" },
                lineHeight: 2,
                color: "#444",
              }}
            >
              Tại trung tâm của chúng tôi, mỗi liệu trình trị liệu không chỉ đơn thuần là một trải nghiệm thư giãn, mà còn là một nghệ thuật chữa lành. 
              Chúng tôi kết hợp giữa phương pháp hiện đại và truyền thống để tạo nên hiệu quả tối ưu, giúp khách hàng phục hồi năng lượng, tăng cường sức khỏe và tìm lại sự cân bằng trong cuộc sống.
            </Typography>

            <Typography
              sx={{
                mt: 3,
                fontSize: { xs: "1rem", md: "1.2rem" },
                lineHeight: 2,
                color: "#444",
              }}
            >
              Với đội ngũ chuyên viên tận tâm và giàu kinh nghiệm, không gian được thiết kế theo tiêu chuẩn cao cấp, chúng tôi luôn đặt khách hàng làm trung tâm – mang đến sự hài lòng tuyệt đối trong từng khoảnh khắc trải nghiệm.
            </Typography>
          </Box>
        </Box>
      </Container> */}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "flex-start",
          px: { xs: 2, md: 10 },
          py: { xs: 6, md: 16 },
          gap: { xs: 8, md: 10 },
          maxWidth: "1800px", // tăng khung chứa để ảnh lớn không bị bó
          margin: "0 auto",
        }}
      >
        {/* KHỐI ẢNH */}
        <Box
          sx={{
            position: "relative",
            width: 720,
            height: 680,
            flexShrink: 0,
          }}
        >
          {/* Hình 1 – Dọc lớn hơn */}
          <Box
            component="img"
            src={images[0]}
            alt="img1"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 300,
              height: 520,
              borderRadius: 4,
              objectFit: "cover",
              boxShadow: 6,
              zIndex: 3,
            }}
          />

          {/* Hình 2 – Vuông lớn hơn */}
          <Box
            component="img"
            src={images[1]}
            alt="img2"
            sx={{
              position: "absolute",
              top: 0,
              left: 340,
              width: 320,
              height: 320,
              borderRadius: 4,
              objectFit: "cover",
              boxShadow: 5,
              zIndex: 2,
            }}
          />

          {/* Hình 3 – Ngang lớn hơn */}
          <Box
            component="img"
            src={images[2]}
            alt="img3"
            sx={{
              position: "absolute",
              top: 380,
              left: 220,
              width: 440,
              height: 300,
              borderRadius: 4,
              objectFit: "cover",
              boxShadow: 5,
              zIndex: 1,
            }}
          />
        </Box>

        {/* KHỐI NỘI DUNG */}
        <Box sx={{ maxWidth: 700 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "#c3a27e",
              mb: 3,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            Sứ Mệnh & Giá Trị Cốt Lõi
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              color: "#444",
              lineHeight: 2,
            }}
          >
            Spa được nhiều du khách trong và ngoài nước biết đến. Đến Spa Quý khách sẽ cảm nhận không gian ấm cúng, gần gũi,
            sang trọng nhưng vẫn mang phong cách thuần Việt, Spa chăm sóc từ Tóc, Nail, Da mặt và Massage Trị Liệu Bấm Huyệt 
            ngăn ngừa cũng như điều trị các bệnh: chấn thương, thể dục sai phương pháp, suy giãn tĩnh mạch, thoái hóa đốt sống, thần kinh tọa,... 
            Đặc biệt ngâm lá Dao đỏ của vùng núi Tây Bắc đã được áp dụng tuyệt vời tại Spa. Cuộc sống càng hiện đại thì môi trường càng ảnh hưởng
            nhiều đến sức khỏe, cùng thói quen sinh hoạt thiếu cân bằng, áp lực công việc sẽ tác động xấu lên hệ miễn dịch của cơ thể. 
            Hệ thống Spa đã ra đời và trở thành một nơi lý tưởng cho Quý khách được chăm sóc và lấy lại tinh thần sảng khoái, 
            cơ thể tràn đầy sức sống bằng các liệu pháp chuẩn y học cổ truyền.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              color: "#444",
              lineHeight: 2,
            }}
          >
            Với đội ngũ chuyên viên tận tâm và giàu kinh nghiệm, không gian được thiết kế theo tiêu chuẩn cao cấp, 
            chúng tôi luôn đặt khách hàng làm trung tâm – mang đến sự hài lòng tuyệt đối trong từng khoảnh khắc trải nghiệm.
          </Typography>
        </Box>
      </Box>

      {/* Nội dung ảnh và chữ */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          minHeight: { xs: "auto", md: "1100px" },
          width: "100%",
        }}
      >
        <Box sx={{ flex: 1 }}>
          <img
            src="/massage-tri-lieu.jpg" 
            alt="Spa Team"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f2f0ed",
            p: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
              Spa Chăm Sóc <br />
            <Box component="span" sx={{ color: "#a16c3f" }}>
              Sức Khỏe & Tinh Thần Của Bạn
            </Box>
          </Typography>

          <Typography sx={{ color: "#555", lineHeight: 1.8, mb: 4, fontSize: "18px" }}>
            Spa tự hào là “spa sức khỏe” duy trì chất lượng suốt 12 năm nay với đội ngũ bác sĩ, kỹ thuật viên được đào tạo tiêu chuẩn gần 10 năm. Ưu điểm kỹ thuật viên chính là khả năng cảm nhận các điểm tắc nghẽn gây đau nhức trên cơ thể khách và làm tan các điểm đau nhức đó, làm mềm sự căng cơ và giải phóng năng lượng cơ thể cân bằng Tinh Thần & Sức Khỏe. Massage Trị Liệu được xem là một phương pháp không dùng thuốc nhằm tác động lên da, cơ và các huyệt đạo giúp thư giãn chống mệt mỏi căng thẳng.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            {[
              { icon: "🌟", text: "Dịch vụ tốt nhất" },
              { icon: "🤝", text: "Khách hàng trên hết" },
              { icon: "👨‍⚕️", text: "Kỹ Thuật Viên Tận Tâm, Tận Tình" },
              { icon: "🧖‍♀️", text: "Không Gian Thư Giãn" },
              { icon: "📋", text: "Phục Vụ Chuyên Nghiệp" },
              { icon: "💰", text: "Giá cả phải chăng" },
              { icon: "⏱️", text: "Đặt Lịch Nhanh Chóng & Linh Hoạt" },
              { icon: "💎", text: "Khỏe Trong Đẹp Ngoài" },
            ].map((item, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", width: "45%" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    mr: 2,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="body1" fontWeight="500">{item.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>Trải Nghiệm Dịch Vụ Hôm Nay</Typography>
        <Typography variant="subtitle1" mb={4}>
          Hãy dành thời gian cho bản thân. Đặt lịch ngay để được chăm sóc như bạn xứng đáng.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button variant="contained" color="success" startIcon={<Phone />} sx={{ px: 4, py: 1.5, fontSize: "16px", borderRadius: "30px" }}>
            Gọi Tư Vấn
          </Button>
          <Button variant="contained" color="primary" startIcon={<LocationOn />} sx={{ px: 4, py: 1.5, fontSize: "16px", borderRadius: "30px" }}>
            Xem Vị Trí
          </Button>
        </Box>
      </Container>

    </div>
  );
};

export default GioiThieu;
