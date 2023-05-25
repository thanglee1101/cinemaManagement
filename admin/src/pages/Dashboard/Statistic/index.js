import React, { useEffect, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import axiosClient from '../../../api/axiosClient';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import './styles.scss';

function Statistic() {
  const [dataMovies, setDataMovies] = useState({labels:[],datasets:[]});
  const [dataCineplexs, setDataCineplexs] = useState({labels:[],datasets:[]});
  const [startDateMovies, setStartDateMovies] = useState(null);
  const [endDateMovies, setEndDateMovies] = useState(null);

  const [startDateCineplexs, setStartDateCineplexs] = useState(null);
  const [endDateCineplexs, setEndDateCineplexs] = useState(null);

  const onChangeDateMovies = (dates) => {
    const [start, end] = dates;
    setStartDateMovies(start);
    setEndDateMovies(end);
    changeDataMovies({
      from: start ? moment(start).format('YYYY-MM-DD') : '',
      to: end ? moment(end).format('YYYY-MM-DD') : '',
    });
  };
  const onChangeDateCinplexs = (dates) => {
    const [start, end] = dates;
    setStartDateCineplexs(start);
    setEndDateCineplexs(end);
    changeDataCineplexs({
      from: start ? moment(start).format('YYYY-MM-DD') : '',
      to: end ? moment(end).format('YYYY-MM-DD') : '',
    });
  };

  const changeDataMovies = async (params) => {
    const response = await axiosClient.get('/statistic/movies', { params });
    setDataMovies(response);
  };

  const changeDataCineplexs = async (params) => {
    const response = await axiosClient.get('/statistic/cineplexs', { params });
    setDataCineplexs(response);
  };
  useEffect(() => {
    const fetchDataSetsMovies = async () => {
      const response = await axiosClient.get('/statistic/movies');
      setDataMovies(response);
    };
    fetchDataSetsMovies();
    const fetchDataSetsCineplexs = async () => {
      const response = await axiosClient.get('/statistic/cineplexs');
      setDataCineplexs(response);
    };
    fetchDataSetsCineplexs();
    return () => {
      setDataMovies([]);
      setDataCineplexs([]);
    };
  }, []);
  console.log(dataMovies);
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
  console.log(1);
  return (
    <div className="content">
      {/* <Row>
        <Col>
          <h1 className="text-center">Statistics</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="mt-3">
            <Col></Col>
            <Col></Col>
            <Col>
              <h3 className="text-center">Movies</h3>
            </Col>
            <Col></Col>
            <Col>
              <Form.Group>
                <DatePicker
                  className="form-control text-center"
                  selected={startDateMovies}
                  startDate={startDateMovies}
                  endDate={endDateMovies}
                  dateFormat="dd/MM/yyyy"
                  selectsRange
                  isClearable={true}
                  placeholderText="Select date range"
                  onChange={onChangeDateMovies}
                />
              </Form.Group>
            </Col>
          </Row>
          <Bar data={dataMovies} options={options} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className="mt-5">
            <Col></Col>
            <Col></Col>
            <Col>
              <h3 className="text-center">Cineplexs</h3>
            </Col>
            <Col></Col>
            <Col>
              <Form.Group>
                <DatePicker
                  className="form-control text-center"
                  selected={startDateCineplexs}
                  startDate={startDateCineplexs}
                  endDate={endDateCineplexs}
                  dateFormat="dd/MM/yyyy"
                  selectsRange
                  isClearable={true}
                  placeholderText="Select date range"
                  onChange={onChangeDateCinplexs}
                />
              </Form.Group>
            </Col>
          </Row>
          <Bar className="mb-5" data={dataCineplexs} options={options} />
        </Col>
      </Row> */}
      {/* <iframe title="dashboarh" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=0ccec969-74a6-4c6d-a28d-fdb085cd168b&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f" frameborder="0" allowFullScreen="true"></iframe> */}
      <iframe title="dashboarh" width="100%" height="100%" src="https://app.powerbi.com/reportEmbed?reportId=0ccec969-74a6-4c6d-a28d-fdb085cd168b&autoAuth=true&ctid=e7572e92-7aee-4713-a3c4-ba64888ad45f" frameborder="0" allowFullScreen="true"></iframe>
    </div>
  );
}

export default Statistic;
