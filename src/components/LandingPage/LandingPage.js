import { Link } from 'react-router-dom';
import LandingBg from '../images/LandingBg.svg'
import privacy from '../images/patientPrivacy.png'
import trustedService from '../images/trustedService.png'
import freeService from '../images/freeService.png'
import logo from '../images/Logo.png'
import './landingpage.css'
const LandingPage = () => {
    return (
        <div className='LandingPage'>
            <nav>
                <ul>
                    <Link to="/"><li>Home</li></Link>
                    <Link to="/contact"><li>Contact</li></Link>
                    <Link to="/login"><li>Login</li></Link>
                </ul>
            </nav>
            <div className='LandingPageContent'>
                <div className='LandingPageImgAndText'>
                    <img src={LandingBg} alt='' />
                    <div className='LandingPageText'>
                        <img src={logo} className='logoImage' alt='' />
                        <p>WE ARE MEDI-HELP</p>
                        <p>PROVIDES MEDICAL SERVICES ONLINE</p>
                        <p>FROM TRUSTED DOCTORS</p>
                    </div>
                </div>
                <div className='LandingPageServices'>
                    <div className='LandingPageServicesHeading'>
                        <span className="material-symbols-outlined" style={{ marginRight: "10px" }}>vital_signs</span>
                        What We Are Serving
                        <span className="material-symbols-outlined" style={{ marginLeft: "10px" }}>vital_signs</span>
                    </div>
                    <div className='LandingPageServicesBoxes'>
                        <div className='LandingPageServicesBox'>
                            <img src={privacy} alt='' />
                            <div>
                                <p>PATIENT PRIVACY</p>
                                <p>Patient don't have to worry about his/her privacy. Your talk with your Doctor will be upto you and doctor. </p>
                            </div>
                        </div>
                        <div className='LandingPageServicesBox'>
                            <img src={trustedService} alt='' />
                            <div>
                                <p>TRUSTED SERVICES</p>
                                <p>Patient don't have to worry about his/her privacy. Your talk with your Doctor will be upto you and doctor. </p>
                            </div>
                        </div>
                        <div className='LandingPageServicesBox'>
                            <img src={freeService} alt='' />
                            <div>
                                <p>NO CHANGES</p>
                                <p>Patient don't have to worry about his/her privacy. Your talk with your Doctor will be upto you and doctor. </p>
                            </div>
                        </div>
                    </div>
                    <div>Don't hesitate to Get Your Treatment</div>
                    <div>We are here for you. You can discus your problem with our Doctors.</div>
                    <div>NOTE : Please go to the nearby Hospital in case of Emergency</div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;