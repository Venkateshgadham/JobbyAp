import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {IoIosSearch} from 'react-icons/io'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

// New: locations to display in sidebar
const locationsList = ['Hyderabad', 'Bangalore', 'Chennai', 'Delhi', 'Mumbai']

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    status: apiStatusConstants.initial,
    jobDetailsStatus: apiStatusConstants.initial,
    jobDetailsList: [],
    searchInput: '',
    title: '',
    empType: [], // array of selected employment types (ids)
    salRange: '',
    // New state to hold selected locations
    selectedLocations: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearch = () => {
    const {searchInput} = this.state
    this.setState({title: searchInput, searchInput: ''}, this.getJobsDetails)
  }

  onClickEmpType = label => {
    this.setState(prevState => {
      const {empType} = prevState
      const isSelected = empType.includes(label)
      const updatedEmpType = isSelected
        ? empType.filter(type => type !== label)
        : [...empType, label]
      return {empType: updatedEmpType}
    }, this.getJobsDetails)
  }

  onClickSalRange = range => {
    this.setState({salRange: range}, this.getJobsDetails)
  }

  // New: handle selecting/unselecting locations
  onChangeLocation = event => {
    const {value} = event.target
    this.setState(prevState => {
      const {selectedLocations} = prevState
      const isSelected = selectedLocations.includes(value)
      const updatedLocations = isSelected
        ? selectedLocations.filter(loc => loc !== value)
        : [...selectedLocations, value]
      return {selectedLocations: updatedLocations}
    }, this.getJobsDetails)
  }

  getProfileDetails = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const profile = data.profile_details
      const updatedData = {
        name: profile.name,
        profileImgUrl: profile.profile_image_url,
        shortBio: profile.short_bio,
      }
      this.setState({
        profileDetails: updatedData,
        status: apiStatusConstants.success,
      })
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  getProfileCard = () => {
    const {profileDetails} = this.state
    const {name, profileImgUrl, shortBio} = profileDetails
    return (
      <div className="profileCard">
        <img src={profileImgUrl} alt="" className="profileImg" />
        <h1 className="profile">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  getProfileFailureView = () => (
    <div className="profileFailure">
      <button
        className="retryBtn"
        type="button"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSection = () => {
    const {status} = this.state
    switch (status) {
      case apiStatusConstants.success:
        return this.getProfileCard()
      case apiStatusConstants.failure:
        return this.getProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.getLoader()
      default:
        return null
    }
  }

  getLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#6366f1" height="50" width="50" />
    </div>
  )

  // NOTE: modified to include location filters in query
  getJobsDetails = async () => {
    const {title, empType, salRange, selectedLocations} = this.state
    const multiEmpType = empType.join(',')
    const multiLocations = selectedLocations.join(',')
    this.setState({jobDetailsStatus: apiStatusConstants.inProgress})

    // build query params conditionally
    const params = new URLSearchParams()
    if (title) params.append('search', title)
    if (multiEmpType) params.append('employment_type', multiEmpType)
    if (salRange) params.append('minimum_package', salRange)
    if (multiLocations) params.append('location', multiLocations)

    const url = `https://apis.ccbp.in/jobs?${params.toString()}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const jobDetails = data.jobs
      const updatedData = jobDetails.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetailsList: updatedData,
        jobDetailsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsStatus: apiStatusConstants.failure})
    }
  }

  onClickRetryBtn = () => {
    this.setState({status: apiStatusConstants.success}, this.getJobsDetails)
  }

  getJobsFetchFailure = () => (
    <div className="jobFailureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobFailureImg"
        alt="failure view"
      />
      <h1 className="jobFailhead">Oops! Something Went Wrong</h1>
      <p className="jobfailContent">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retryBtn" type="button" onClick={this.onClickRetryBtn}>
        Retry
      </button>
    </div>
  )

  getNoJobsFound = () => (
    <div className="jobFailureContainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="jobFailureImg"
        alt="failure view"
      />
      <h1 className="jobFailhead">No Jobs Found</h1>
      <p className="jobfailContent">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  getJobSearchResults = () => {
    const {jobDetailsList} = this.state
    return (
      <div className="jobdetailsContainer">
        {jobDetailsList.length === 0
          ? this.getNoJobsFound()
          : this.getAllJobsDetails()}
      </div>
    )
  }

  getAllJobsDetails = () => {
    const {jobDetailsList, searchInput} = this.state
    return (
      <div>
        <div className="inputContainer2">
          <input
            type="search"
            placeholder="Search"
            className="input"
            onChange={this.onChangeSearch}
            value={searchInput}
          />
          <div className="iconContainer">
            <button
              type="button"
              className="SearchIconBtn"
              onClick={this.onClickSearch}
              data-testid="searchButton"
            >
              <IoIosSearch className="SearchIcon" />
            </button>
          </div>
        </div>
        <ul className="allJobsContainer">
          {jobDetailsList.map(eachJobDetails => (
            <JobItem
              key={eachJobDetails.id}
              singleJobDetails={eachJobDetails}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderJobsSection = () => {
    const {jobDetailsStatus} = this.state
    switch (jobDetailsStatus) {
      case apiStatusConstants.success:
        return this.getJobSearchResults()
      case apiStatusConstants.failure:
        return this.getJobsFetchFailure()
      case apiStatusConstants.inProgress:
        return this.getLoader()
      default:
        return null
    }
  }

  render() {
    const {searchInput, empType, salRange, selectedLocations} = this.state
    return (
      <div className="bgJobsContainer">
        {/* header: make Header sticky via CSS below */}
        <Header />

        <div className="jobsContainer">
          {/* Left: Filters - make this sidebar sticky */}
          <aside className="topSection jobs-sidebar">
            {/* Search box (top) */}
            <div className="inputContainer">
              <input
                type="search"
                placeholder="Search"
                className="input"
                onChange={this.onChangeSearch}
                value={searchInput}
              />
              <div className="iconContainer">
                <button
                  type="button"
                  className="SearchIconBtn"
                  onClick={this.onClickSearch}
                  data-testid="searchButton"
                >
                  <IoIosSearch className="SearchIcon" />
                </button>
              </div>
            </div>

            {/* Profile */}
            <div>{this.renderProfileSection()}</div>

            <hr className="horlines" />

            {/* Employment Type */}
            <div className="empTypeCategory">
              <h1 className="typeHead">Type of Employment</h1>
              <ul className="listContainer">
                {employmentTypesList.map(eachItem => (
                  <li className="typeContainer" key={eachItem.employmentTypeId}>
                    <label className="label">
                      <input
                        type="checkbox"
                        name="employment"
                        className="checkInput"
                        checked={empType.includes(eachItem.employmentTypeId)}
                        onChange={() =>
                          this.onClickEmpType(eachItem.employmentTypeId)
                        }
                      />
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="horline" />

            {/* Salary Range */}
            <div className="empTypeCategory">
              <h1 className="typeHead">Salary Range</h1>
              <ul className="listContainer">
                {salaryRangesList.map(eachItem => (
                  <li className="typeContainer" key={eachItem.salaryRangeId}>
                    <label className="label">
                      <input
                        type="radio"
                        name="salary"
                        className="checkInput"
                        checked={salRange === eachItem.salaryRangeId}
                        onChange={() =>
                          this.onClickSalRange(eachItem.salaryRangeId)
                        }
                      />
                      {eachItem.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="horline" />

            {/* NEW: Locations Filter (positioned below Salary Range) */}
            <div className="empTypeCategory">
              <h1 className="typeHead">Locations</h1>
              <ul className="listContainer">
                {locationsList.map(loc => (
                  <li className="typeContainer" key={loc}>
                    <label className="label">
                      <input
                        type="checkbox"
                        name="location"
                        className="checkInput"
                        value={loc}
                        checked={selectedLocations.includes(loc)}
                        onChange={this.onChangeLocation}
                      />
                      {loc}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Right: Jobs results */}
          <main className="bottomSection">{this.renderJobsSection()}</main>
        </div>
      </div>
    )
  }
}

export default Jobs
