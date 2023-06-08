import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Bar, Pie, Line } from 'react-chartjs-2';
import './styles.scss';
import axios from 'axios';
import io from 'socket.io-client';

function Statistic() {
  const [stockData, setStockData] = useState();

  const handleDownloadReportMonth = (datas) => {

    axios({
      url: 'http://127.0.0.1:5000/api/statistic/downloadStatMonth', // Đường dẫn đến API endpoint trên backend
      method: 'POST',
      responseType: 'blob',
      data: datas// Xác định kiểu dữ liệu phản hồi là dạng blob (binary large object)
    })
      .then((response) => {
        // Xử lý phản hồi thành công
        console.log(response);
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'reportMonth.xlsx';
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        console.log(link);
        document.body.removeChild(link);
      })
      .catch((error) => {
        // Xử lý lỗi khi tải xuống file Excel
        console.error('Lỗi khi tải xuống file Excel:', error);
      });
  }
  const handleDownloadReportCineplex = () => {
    const data = []
    if (stockData) {
      data.push(stockData[0].labels)
      data.push(stockData[0].datasets[0].data)
    }
    axios({
      url: 'http://127.0.0.1:5000/api/statistic/downloadStatCinemaplex', // Đường dẫn đến API endpoint trên backend
      method: 'POST',
      responseType: 'blob',
      data: data// Xác định kiểu dữ liệu phản hồi là dạng blob (binary large object)
    })
      .then((response) => {
        // Xử lý phản hồi thành công
        console.log(response);
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'reportCinemaplex.xlsx';
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        console.log(link);
        document.body.removeChild(link);
      })
      .catch((error) => {
        // Xử lý lỗi khi tải xuống file Excel
        console.error('Lỗi khi tải xuống file Excel:', error);
      });
  }
  const handleDownloadReportMovies = () => {
    const data = []
    if (stockData) {
      data.push(stockData[2].labels)
      data.push(stockData[2].datasets[0].data)
      data.push(stockData[2].datasets[1].data)

    }
    axios({
      url: 'http://127.0.0.1:5000/api/statistic/downloadStatMovie', // Đường dẫn đến API endpoint trên backend
      method: 'POST',
      responseType: 'blob',
      data: data// Xác định kiểu dữ liệu phản hồi là dạng blob (binary large object)
    })
      .then((response) => {
        // Xử lý phản hồi thành công
        console.log(response);
        const contentDisposition = response.headers['content-disposition'];
        let fileName = 'reportMovie.xlsx';
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        console.log(link);
        document.body.removeChild(link);
      })
      .catch((error) => {
        // Xử lý lỗi khi tải xuống file Excel
        console.error('Lỗi khi tải xuống file Excel:', error);
      });
  }
  useEffect(() => {
    // Kết nối tới server Socket.IO
    const socket = io('http://localhost:5001', { transports: ['websocket'] });
    // Lắng nghe sự kiện nhận dữ liệu chứng khoán từ server
    socket.on('stockData', (data) => {
      setStockData(data);
    });
    // Cleanup kết nối khi component bị hủy
    return () => {
      socket.disconnect();
    };
  }, []);
  console.log(stockData);
  const options = {
    responsive: true,
    tooltips: {
      mode: 'index',
      intersect: true,
    },
    scales: {
      'left-y-axis': {
        position: 'left',
      },
      'right-y-axis': {
        position: 'right',
      },
    },
  };
  return (
    <div className="content">
      <Row>
        <Col>
          <h1 className="text-center">Thống kê</h1>
        </Col>
      </Row>
      <Row style={{ height: "400px" }}>
        <Col>
          <Row className="mt-3">
            <Col>
              <h3 >Doanh thu theo phim</h3>
            </Col>
          </Row>
          {stockData ? <Bar data={stockData[2]} options={options} /> : null}
        </Col>
        <Col>
          <Row className="mt-3">
            <Col>
              <h3 >Doanh thu theo rạp</h3>
            </Col>
          </Row>
          <Row style={{ paddingBottom: "50%" }}>
            <Col></Col>
            <Col>
              {stockData ? <Pie data={stockData[0]} /> : null}
            </Col>
            <Col></Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Row className="mt-3">
          <Col>
            <h3 >Doanh thu theo Tháng</h3>
          </Col>
        </Row>
        <Col></Col>
        <Col>
          {stockData ? <Line data={stockData[1]} /> : null}
        </Col>
        <Col >
          <Col style={{ paddingLeft: "20%" }}>
            <Row>
              <Button className='mt-3' onClick={handleDownloadReportMovies} style={{ width: "25%" }}>Xuất doanh thu theo phim</Button>
            </Row>
            <Row>
              <Button className='mt-3' onClick={handleDownloadReportCineplex} style={{ width: "25%" }}>Xuất doanh thu theo rạp</Button>
            </Row>
            <Row>
              {stockData ?
                <Button onClick={() => handleDownloadReportMonth(stockData[1].datasets[0].data)} className='mt-3' style={{ width: "25%" }}>Xuất doanh thu theo tháng</Button>
                :
                <Button onClick={() => handleDownloadReportMonth([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])} className='mt-3' style={{ width: "25%" }}>Xuất doanh thu theo tháng</Button>
              }
            </Row>
          </Col>
        </Col>
      </Row>
    </div>
  );

}

export default Statistic;
