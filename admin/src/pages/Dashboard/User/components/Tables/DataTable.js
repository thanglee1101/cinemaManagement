import ReactDatatable from '@ashvin27/react-datatable';
import { orderBy } from 'lodash';
import moment from 'moment';
import React from 'react';
import { Image } from 'react-bootstrap';
import './styles.scss';

function DataTable(props) {
  const { users } = props;

  const columns = [
    {
      key: 'id',
      text: 'ID',
      sortable: true,
      cell: (user, index) => {
        return index + 1;
      },
    },
    {
      key: 'avatar',
      text: 'Ảnh',
      sortable: true,
      cell: (user) => {
        return <Image className="img_user_profile" src={user.avatar}></Image>;
      },
    },
    {
      key: 'fullname',
      text: 'Họ tên',
      sortable: true,
    },
    {
      key: 'phone',
      text: 'Sdt',
      sortable: true,
    },
    {
      key: 'email',
      text: 'Email',
      sortable: true,
    },
    {
      key: 'address',
      text: 'Địa chỉ',
      sortable: true,
    },
    {
      key: 'birthday',
      text: 'Ngày sinh',
      sortable: true,
      cell: (user) => {
        return moment(user.birthday).format('DD/MM/YYYY');
      },
    },
    {
      key: 'status',
      text: 'Trạng thái',
      sortable: true,
    },
  ];

  const config = {
    page_size: 50,
    show_filter: false,
    show_length_menu: false,
    show_pagination: true,
    pagination: 'advance',
  };

  const onSort = (column, records, sortOrder) => {
    return orderBy(records, [column], [sortOrder]);
  };

  return (
    <>
      <ReactDatatable
        responsive
        hover
        config={config}
        records={users}
        columns={columns}
        onSort={onSort}
      />
    </>
  );
}

export default DataTable;
