import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcase} from 'react-icons/bs'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import Loader from 'react-loader-spinner'
import SimilarJobItem from '../SimilarJobItem'
import Header from '../Header'
import './index.css'

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    similarJobsData: [],
    skills: [],
    lifeAtCompany: {},
    status: 'loading',
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.job_details
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,

        title: jobDetails.title,
      }
      const similarJobs = data.similar_jobs
      const updatedSimilarJobs = similarJobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        id: eachJob.id,
        title: eachJob.title,
      }))
      const updatedSkills = jobDetails.skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))
      const lifeAtCompany = jobDetails.life_at_company
      const updatedLifeATcompany = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }
      this.setState({
        jobItemDetails: updatedJobDetails,
        similarJobsData: updatedSimilarJobs,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeATcompany,
        status: 'success',
      })
    } else {
      this.setState({status: 'failure'})
    }
  }

  getJobDetails = () => {
    const {jobItemDetails, skills, similarJobsData, lifeAtCompany} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
    } = jobItemDetails
    const {imageUrl, description} = lifeAtCompany
    return (
      <div className="jobItemBgContainer">
        <Header />
        <div className="singleJobItemDetails">
          <div className="singleJobContainer">
            <div className="logosContainer">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="jobLogo2"
              />
              <div>
                <h1 className="jobTitle2">{title}</h1>
                <div className="ratingContainer">
                  <FaStar className="star2" />
                  <p className="rating2">{rating}</p>
                </div>
              </div>
            </div>
            <div className="locationSalaryContainer">
              <div className="locContainer">
                <div className="singleLoc">
                  <IoLocationSharp className="locLogo2" />
                  <p className="details2">{location}</p>
                </div>
                <div className="singleLoc">
                  <BsBriefcase className="locLogo2" />
                  <p className="details2">{employmentType}</p>
                </div>
              </div>
              <p className="package2">{packagePerAnnum}</p>
            </div>
            <hr className="horline2" />
            <div className="descriptLink">
              <h1 className="package2">Description</h1>
              <div className="visitLinkContainer">
                <a
                  href={companyWebsiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="linkText"
                >
                  Visit
                </a>
                <FaExternalLinkAlt className="externalLink" />
              </div>
            </div>
            <p className="jobDescription2">{jobDescription}</p>
            <div className="skillsContainer">
              <h1 className="skillsHead">Skills</h1>
              <ul className="allSkillsContainer">
                {skills.map(eachSkill => (
                  <li className="singleSkillContainer" key={eachSkill.name}>
                    <img
                      src={eachSkill.imageUrl}
                      alt={eachSkill.name}
                      className="skillImg"
                    />
                    <p className="skillText">{eachSkill.name}</p>
                  </li>
                ))}
              </ul>
              <div className="lifeAtCompanyContainer">
                <div>
                  <h1 className="skillsHead">Life at Company</h1>
                  <p className="descriptionCompany">{description}</p>
                </div>
                <img
                  src={imageUrl}
                  alt="life_at_company"
                  className="companyLifeImg"
                />
              </div>
            </div>
          </div>
          <div className="similarJobsContainer">
            <h1 className="skillsHead">Similar Jobs</h1>
            <ul className="allSimilarJobsContainer">
              {similarJobsData.map(eachJob => (
                <SimilarJobItem similarJobDetails={eachJob} key={eachJob.id} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {status} = this.state
    return (
      <div className="renderResultsContainer">
        {status === 'loading' ? this.renderLoader() : this.getJobDetails()}
      </div>
    )
  }
}

export default JobItemDetails
