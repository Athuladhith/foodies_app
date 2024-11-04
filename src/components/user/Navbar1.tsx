import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
// import { userDataaction } from "../Redux/UserData/action";
import "bootstrap/dist/css/bootstrap.min.css";
import './Navbar1.css'; 


interface UserData {
  location: string;
  name: string;
}


interface RootState {
  userState: {
    userData: UserData[];
  };
}

export const Navbar: React.FC = () => {
//   const { userData } = useSelector((state: RootState) => state.userState);
  const [logbox, setLogbox] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // dispatch(userDataaction(null));
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            src="https://logosandtypes.com/wp-content/uploads/2021/01/Swiggy.png"
            alt="Swiggy Logo"
            className="rounded-circle"
            width="100"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              {/* <span className="nav-link">{userData[0]?.location}</span> */}
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-search"></i> Search
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-percentage"></i> Offers
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="far fa-life-ring"></i> Help
              </a>
            </li>
            <li
              className="nav-item dropdown"
              onMouseOver={() => setLogbox(true)}
              onMouseLeave={() => setLogbox(false)}
            >
              <a className="nav-link dropdown-toggle" href="#" role="button">
                {/* <i className="fas fa-user"></i> {userData[0]?.name} */}
              </a>
              {logbox && (
                <div className="dropdown-menu show">
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                  <Link className="dropdown-item" to="/orders">
                    Orders
                  </Link>
                  <Link className="dropdown-item" to="/swiggyone">
                    Swiggy One
                  </Link>
                  <Link className="dropdown-item" to="/favourites">
                    Favourites
                  </Link>
                  <div className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              )}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/checkout">
                <i className="fas fa-shopping-cart"></i> Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
