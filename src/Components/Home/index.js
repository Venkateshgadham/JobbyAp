import {Redirect, Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div>
      <Header />
      <div className="homeContainer">
        <h1 className="title">Find The Job That Fits Your Life</h1>
        <p className="content">
          Millions of people are searching for jobs,salary imformation,company
          reviews.Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button className="findJobBtn" type="button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Home
