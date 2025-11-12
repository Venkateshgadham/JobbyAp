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
    <div className="headerContainer">
      <Link to="/">
        <button className="logoBtn" type="button">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="webLogo"
          />
        </button>
      </Link>
      <ul className="smallScreenContainer">
        <li>
          <Link to="/">
            <button className="headerBtn" type="button">
              <IoMdHome className="icon" />
            </button>
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <button className="headerBtn" type="button">
              <BsBriefcase className="icon" />
            </button>
          </Link>
        </li>
        <li>
          <button className="headerBtn" type="button" onClick={onClickLogout}>
            <IoIosLogOut className="icon" />
          </button>
        </li>
      </ul>
      <ul className="largeScreenContainer">
        <li>
          <Link to="/">
            <button className="headerBtn" type="button">
              Home
            </button>
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <button className="headerBtn" type="button">
              Jobs
            </button>
          </Link>
        </li>
      </ul>
      <div className="logoutContainer">
        <button className="logoutBtn" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default withRouter(Header)
