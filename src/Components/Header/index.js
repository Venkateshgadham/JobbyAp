import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {IoMdHome, IoIosLogOut} from 'react-icons/io'
import {BsBriefcase} from 'react-icons/bs'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="headerContainer">
      <Link to="/" className="logoLink">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="webLogo"
        />
      </Link>

      {/* Mobile View Icons */}
      <ul className="smallScreenContainer">
        <li>
          <Link to="/" className="headerBtn">
            <IoMdHome className="icon" />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="headerBtn">
            <BsBriefcase className="icon" />
          </Link>
        </li>
        <li>
          <button className="headerBtn" type="button" onClick={onClickLogout}>
            <IoIosLogOut className="icon" />
          </button>
        </li>
      </ul>

      {/* Desktop View Links */}
      <ul className="largeScreenContainer">
        <li>
          <Link to="/" className="headerBtn">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="headerBtn">
            Jobs
          </Link>
        </li>
      </ul>

      <button className="logoutBtn" type="button" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
