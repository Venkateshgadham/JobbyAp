import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {userName: '', passWord: '', errorMsg: ''}

  onChangeUsername = event => {
    this.setState({userName: event.target.value})
  }

  onChangePassword = event => {
    this.setState({passWord: event.target.value})
  }

  RedirectToHome = () => {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      const {history} = this.props
      history.replace('/')
    }
  }

  onClickSubmit = async event => {
    event.preventDefault()
    const {userName, passWord} = this.state
    const userDetails = {username: userName, password: passWord}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 5})

      this.RedirectToHome()
    } else {
      const data = await response.json()
      this.setState({userName: '', passWord: '', errorMsg: data.error_msg})
    }
  }

  render() {
    const {userName, passWord, errorMsg} = this.state
    return (
      <div className="loginContainer">
        <div className="loginCard">
          <div className="logoContainer">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="websitelogo"
            />
          </div>
          <form onSubmit={this.onClickSubmit}>
            <div>
              <label htmlFor="username" className="inputlabel">
                USERNAME
              </label>
              <br />
              <div className="loginInputContainer">
                <input
                  className="inputLogin"
                  type="text"
                  id="username"
                  placeholder="Username"
                  value={userName}
                  onChange={this.onChangeUsername}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="inputlabel">
                PASSWORD
              </label>
              <br />
              <div className="loginInputContainer">
                <input
                  className="inputLogin"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={passWord}
                  onChange={this.onChangePassword}
                />
              </div>
            </div>
            <div>
              <button type="submit" className="loginBtn">
                Login
              </button>
              {errorMsg && <p className="errorMsg">{errorMsg}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
