import './index.css'

const NotFound = () => (
  <div className="notFoundContainer">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="notFoundImg"
    />
    <h1 className="notFoundHead">Page Not Found</h1>
    <p className="notFoundMSG">
      We are sorry, the page you are requested could not be found
    </p>
  </div>
)

export default NotFound
