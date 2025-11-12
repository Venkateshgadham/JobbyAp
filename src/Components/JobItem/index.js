import {Link} from 'react-router-dom'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcase} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import './index.css'

const JobItem = props => {
  const {singleJobDetails} = props
  const {
    companyLogoUrl,
    rating,
    title,
    location,
    packagePerAnnum,
    employmentType,
    jobDescription,
    id,
  } = singleJobDetails
  return (
    <Link to={`/jobs/${id}`} className="link-text">
      <div className="singleJobContainer">
        <div className="logosContainer">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="job-logo"
          />
          <div>
            <h1 className="jobTitleNew">{title}</h1>
            <div className="ratingContainer">
              <FaStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="locationSalaryContainer">
          <div className="locContainer">
            <div className="singleLoc">
              <IoLocationSharp className="locationLogo" />
              <p className="empType">{location}</p>
            </div>
            <div className="singleLoc">
              <BsBriefcase className="locationLogo" />
              <p className="empType">{employmentType}</p>
            </div>
          </div>
          <p className="packagePerAnnum">{packagePerAnnum}</p>
        </div>
        <hr className="horlineNEWXs" />
        <h1 className="descriptures">Description</h1>
        <p className="jobDescriptions">{jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobItem
