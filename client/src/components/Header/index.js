import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './styles.scss';
import { getUserSelector } from './../../redux/selectors/authSelector';
import { logoutAction } from '../../redux/actions/authActions';

function Header() {
  const user = useSelector(getUserSelector);
  const dispatch = useDispatch();
  const history = useHistory();

  const loginOnClick = () => {
    history.push('/login');
  };

  const registerOnClick = () => {
    history.push('/register');
  };

  const onLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAction());
    history.push('/');
  };

  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <a
          href="/"
          className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none">
          <img
            src="https://www.cgv.vn/skin/frontend/cgv/default/images/cgvlogo.png"
            alt="cgvlogo"
          />
        </a>
        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <a href="/" className="nav-link px-4 link-dark fw-bold menu-link">
              Trang chủ
            </a>
          </li>
          <li>
            <a href="/cineplexs" className="nav-link px-4 link-dark fw-bold menu-link">
              Rạp
            </a>
          </li>
          <li>
            <a href="/movies" className="nav-link px-4 link-dark fw-bold menu-link">
              Phim
            </a>
          </li>
          <li>
            <a href="/showtimes" className="nav-link px-4 link-dark fw-bold menu-link">
              Lịch chiếu
            </a>
          </li>
        </ul>
        <div className="col-md-3 text-end">
          {!user ? (
            <>
              <button
                type="button"
                onClick={loginOnClick}
                className="btn btn-outline-primary me-2 color-outline-primary">
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={registerOnClick}
                className="btn btn-primary color-primary">
                Đăng ký
              </button>
            </>
          ) : (
            <div className="dropdown">
              <button
                className="dropdown-toggle btn btn-color-profile"
                type="button"
                id="dropdownMenuProfile"
                data-bs-toggle="dropdown"
                aria-expanded="false">
                <div>
                  <img
                    src={user.avatar}
                    alt="mdo"
                    width={36}
                    height={36}
                    className="rounded-circle"
                  />
                  <span className="text-center ms-1 mx-auto">{user.fullname}</span>
                </div>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuProfile">
                <li>
                  <a className="dropdown-item" href="/profile">
                    Thông tin cá nhân
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/history">
                    Lịch sử đặt vé
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={onLogout} href="/logout">
                    Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
