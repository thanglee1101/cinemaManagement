import { Movie, Cineplex, Cinema, Showtime, Booking, Ticket, sequelize } from '../models';
import { Op } from 'sequelize';
import moment from 'moment';
const ExcelJS = require('exceljs');

const getByCineplexs = async() => {
    try {
        const cineplexs = await Cineplex.findAll({
            attributes: {
                include: [
                    [
                        sequelize.fn('COUNT', sequelize.col('"Cinemas.Showtimes.Bookings.Tickets"."id"')),
                        'ticket_number',
                    ],
                    [
                        sequelize.fn('SUM', sequelize.col('"Cinemas.Showtimes.Bookings.Tickets"."price"')),
                        'revenue',
                    ],
                ],
            },
            include: [{
                model: Cinema,
                attributes: [],
                include: [{
                    model: Showtime,
                    attributes: [],
                    include: [{
                        model: Booking,
                        attributes: [],
                        where: null && to ? {
                            createdAt: {
                                [Op.between]: [
                                    moment(from).format(),
                                    moment(to).add(1, 'day').subtract(1, 'seconds').format(),
                                ],
                            },
                        } : {},
                        include: [{ model: Ticket, attributes: [] }],
                    }, ],
                }, ],
            }, ],
            group: ['"Cineplex"."id"'],
        });

        let result = {
            labels: [],
            datasets: [{
                label: 'Doanh thu',
                yAxisID: 'right-y-axis',
                data: [],
                backgroundColor: [
                    'rgba(255, 99, 255,0.7)',
                    'rgba(54, 162, 255,0.7)',
                    'rgba(255, 206,255,0.7)',
                    'rgba(75, 192, 255,0.7)',
                    'rgba(153, 102, 255,0.7)',
                    'rgba(255, 159, 64,0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            }, ],
        };

        if (cineplexs) {
            cineplexs.map((cineplex) => {
                result.labels.push(cineplex.name);
                // result.datasets[0].data.push(parseInt(cineplex.dataValues.ticket_number));
                cineplex.dataValues.revenue !== null ?
                    result.datasets[0].data.push(parseInt(cineplex.dataValues.revenue)) :
                    result.datasets[0].data.push(0);
            });
            return result;
        }
    } catch (error) {}
};
const getByMovies = async() => {
    try {
        const movies = await Movie.findAll({
            attributes: {
                include: [
                    [
                        sequelize.fn('COUNT', sequelize.col('"Showtimes.Bookings.Tickets"."id"')),
                        'ticket_number',
                    ],
                    [sequelize.fn('SUM', sequelize.col('"Showtimes.Bookings.Tickets"."price"')), 'revenue'],
                ],
            },
            include: [{
                model: Showtime,
                attributes: [],
                include: [{
                    model: Booking,
                    attributes: [],
                    where: null && null ? {
                        createdAt: {
                            [Op.between]: [
                                moment(from).format(),
                                moment(to).add(1, 'day').subtract(1, 'seconds').format(),
                            ],
                        },
                    } : {},
                    include: [{ model: Ticket, attributes: [] }],
                }, ],
            }, ],
            group: ['"Movie"."id"'],
        });
        let result = {
            labels: [],
            datasets: [{
                    label: 'Số vé',
                    yAxisID: 'left-y-axis',
                    data: [],
                    backgroundColor: '#FF00FF',
                },
                {
                    label: 'Doanh thu',
                    yAxisID: 'right-y-axis',
                    data: [],
                    backgroundColor: '#FF6347',
                },
            ],
        };
        if (movies) {
            movies.map((movie) => {
                result.labels.push(movie.title);
                result.datasets[0].data.push(parseInt(movie.dataValues.ticket_number));
                movie.dataValues.revenue !== null ?
                    result.datasets[1].data.push(parseInt(movie.dataValues.revenue)) :
                    result.datasets[1].data.push(0);
            });
            return result
        }
    } catch (error) {}
};
const getByMonth = async() => {
    try {
        const totals = await Booking.findAll({
            attributes: [
                [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM DATE_TRUNC(\'month\', "createdAt")')), 'month'],
                [sequelize.fn('SUM', sequelize.col('total')), 'totalSum'],
            ],
            group: [sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM DATE_TRUNC(\'month\', "createdAt")'))],
            raw: true,
        });
        let result = {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            datasets: [{
                label: 'Doanh thu',
                data: [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }],
        };
        if (totals) {
            totals.map((total) => {
                total.totalSum !== null ?
                    result.datasets[0].data.push(parseInt(total.totalSum)) :
                    result.datasets[0].data.push(0);
            })
        }
        return result
    } catch (error) {}
}

function sumArray(mang) {
    let sum = 0;
    mang.map(function(value) {
        sum += value;
    });

    return sum;
}
const downloadReportMonth = async(req, res) => {
    const data = req.body
    console.log(data);
    const cells = ['G9', 'H9', 'I9', 'J9', 'K9', 'L9', 'M9', 'N9', 'O9', 'P9', 'Q9', 'R9']
    const sourceFilePath = 'statisticsCSV/reportMonthTem.xlsx'
    const destinationFilePath = 'statisticsCSV/reportMouth.xlsx'
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(destinationFilePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    if (data) {
        const total = sumArray(data)
        for (var i = 0; i < 12; i++) {
            worksheet.getCell(`${cells[i]}`).value = data[i]
        }
        worksheet.getCell('S9').value = total
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Lưu ý: tháng bắt đầu từ 0 (tháng 0 là tháng 1)
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    worksheet.getCell('P6').value = formattedDate
    await workbook.xlsx.writeFile(destinationFilePath);
    console.log('Data written to file successfully');
    res.download(destinationFilePath);
}
const downloadReportCineplex = async(req, res) => {
    const data = req.body
    console.log(data);
    const destinationFilePath = 'statisticsCSV/reportCinemaplex.xlsx'
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(destinationFilePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    if (data) {
        const total = sumArray(data[1])
        for (var i = 0; i < data[0].length; i++) {
            worksheet.getCell(`K${10+i}`).value = data[0][i]
            worksheet.getCell(`L${10+i}`).value = data[1][i]
        }
        worksheet.getCell('L18').value = total
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Lưu ý: tháng bắt đầu từ 0 (tháng 0 là tháng 1)
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    worksheet.getCell('O7').value = formattedDate
    await workbook.xlsx.writeFile(destinationFilePath);
    console.log('Data written to file successfully');
    res.download(destinationFilePath);
}
const downloadReportMovie = async(req, res) => {
    const data = req.body
    const destinationFilePath = 'statisticsCSV/reportMoviesTem.xlsx'
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(destinationFilePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    if (data) {
        const totalTick = sumArray(data[1])
        const totalRe = sumArray(data[2])
        for (var i = 0; i < data[0].length; i++) {
            worksheet.getCell(`J${9+i}`).value = data[0][i]
            worksheet.getCell(`K${9+i}`).value = data[1][i]
            worksheet.getCell(`L${9+i}`).value = data[2][i]
        }
        worksheet.getCell('L17').value = totalRe
        worksheet.getCell('K17').value = totalTick
    }
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Lưu ý: tháng bắt đầu từ 0 (tháng 0 là tháng 1)
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    worksheet.getCell('M6').value = formattedDate
    await workbook.xlsx.writeFile(destinationFilePath);
    console.log('Data written to file successfully');
    res.download(destinationFilePath);
}
export { getByCineplexs, getByMovies, getByMonth, downloadReportMonth, downloadReportCineplex, downloadReportMovie };