import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

const LichSuDichVu: React.FC = () => {
  // Dữ liệu mẫu lịch sử dịch vụ
  const serviceHistory = [
    { date: '2025-01-01', customer: 'Nguyễn Văn A', service: 'Massage toàn thân' },
    { date: '2025-01-02', customer: 'Lê Thị B', service: 'Chăm sóc da mặt' },
    { date: '2025-01-03', customer: 'Trần Văn C', service: 'Xông hơi' },
    { date: '2025-01-04', customer: 'Hoàng Thị D', service: 'Trị liệu cổ vai gáy' },
  ];

  return (
    <div className="flex flex-col p-6 gap-8">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        className="text-gray-700 font-semibold"
      >
        Lịch Sử Dịch Vụ Spa
      </Typography>

      {/* Row 1: Bảng lịch sử dịch vụ */}
      <Card className="shadow-md">
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            className="text-gray-800 font-medium"
          >
            Lịch sử sử dụng dịch vụ
          </Typography>
          <Box className="overflow-x-auto">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-bold text-gray-600">Ngày sử dụng</TableCell>
                  <TableCell className="font-bold text-gray-600">Khách hàng</TableCell>
                  <TableCell className="font-bold text-gray-600">Dịch vụ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {serviceHistory.map((row, index) => (
                  <TableRow key={index} className="hover:bg-gray-100">
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.customer}</TableCell>
                    <TableCell>{row.service}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default LichSuDichVu;
