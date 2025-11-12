import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcase} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import './index.css'

const SimilarJobItem = props => {
  const {similarJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
    packagePerAnnum,
  } = similarJobDetails
  return (
    <li className="similarsingleJobContainer">
      <div className="logosContainer">
        <img
          src={companyLogoUrl}
          alt="job details company logo"
          className="jobLogo"
        />
        <div>
          <h1 className="jobTitle">{title}</h1>
          <div className="ratingContainer">
            <FaStar className="similarstar" />
            <p className="rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similarJobDescript">Description</h1>
      <p className="smJobDescription">{jobDescription}</p>
      <div className="locationSalaryContainer">
        <div className="locContainer">
          <div className="singleLoc">
            <IoLocationSharp className="locLogoes" />
            <p className="detailss">{location}</p>
          </div>
          <div className="singleLoc">
            <BsBriefcase className="locLogoes" />
            <p className="detailss">{employmentType}</p>
          </div>
        </div>
        <p className="package">{packagePerAnnum}</p>
      </div>
    </li>
  )
}

export default SimilarJobItem
