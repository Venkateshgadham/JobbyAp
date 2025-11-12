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

    if (response.ok) {
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

      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        id: eachJob.id,
        title: eachJob.title,
      }))

      const updatedSkills = jobDetails.skills.map(skill => ({
        name: skill.name,
        imageUrl: skill.image_url,
      }))

      const updatedLifeAtCompany = {
        description: jobDetails.life_at_company.description,
        imageUrl: jobDetails.life_at_company.image_url,
      }

      this.setState({
        jobItemDetails: updatedJobDetails,
        similarJobsData: updatedSimilarJobs,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeAtCompany,
        status: 'success',
      })
    } else {
      this.setState({status: 'failure'})
    }
  }

  renderJobDetails = () => {
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

    return (
      <>
        <Header />
        <div className="jobItemBgContainer">
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
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="linkText"
              >
                Visit <FaExternalLinkAlt />
              </a>
            </div>

            <p className="jobDescription2">{jobDescription}</p>

            <h1 className="skillsHead">Skills</h1>
            <ul className="allSkillsContainer">
              {skills.map(skill => (
                <li key={skill.name} className="singleSkillContainer">
                  <img
                    src={skill.imageUrl}
                    alt={skill.name}
                    className="skillImg"
                  />
                  <p className="skillText">{skill.name}</p>
                </li>
              ))}
            </ul>

            <h1 className="skillsHead">Life at Company</h1>
            <div className="lifeAtCompanyContainer">
              <p className="descriptionCompany">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="companyLifeImg"
              />
            </div>
          </div>

          <h1 className="skillsHead">Similar Jobs</h1>
          <ul className="allSimilarJobsContainer">
            {similarJobsData.map(eachJob => (
              <SimilarJobItem key={eachJob.id} similarJobDetails={eachJob} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" height="50" width="50" />
    </div>
  )

  render() {
    const {status} = this.state

    if (status === 'loading') {
      return this.renderLoader()
    }

    return this.renderJobDetails()
  }
}

export default JobItemDetails
