import React from "react";
import '../../styles/landingPage.css';
import Logo from '../../assets/images/mrtg-transp.svg';
import facebookIcon from '../../assets/images/sm-icons/facebook.svg';
import twitterIcon from '../../assets/images/sm-icons/twitter.svg';
import linkedinIcon from '../../assets/images/sm-icons/linkedin.svg';
import gplusIcon from '../../assets/images/sm-icons/google-plus.svg';
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import * as ROUTES from '../../constants/routes';

const Index = (props) => {

    return (
        <React.Fragment>
            <header>
                <img id='logo' src={Logo} alt={'Logo'}/>
                <div className='navbarHolder'>
                    <div className='loginHolder'>
                        <div className='loginLink'>
                            <AccountBoxIcon/><a href='/login'> Broker Login</a>
                        </div>
                    </div>
                    <div className='menuHolder'>
                        <ul id='menu'>
                            <li>
                                <a href='#'>About</a></li>
                            <li>
                                <a href='#'>Home Loans</a></li>
                            <li>
                                <a href='#'>Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </header>
            <section className='middle'>
                <Button className='registerLink' component={Link} to={ROUTES.SIGN_UP}>
                    Register as a Broker
                </Button>
            </section>
            <footer>
                <div className='sm-icons'>
                    <a href='#'><img src={facebookIcon} alt={'Social Media Icon'}/></a>
                    <a href='#'><img src={twitterIcon} alt={'Social Media Icon'}/></a>
                    <a href='#'><img src={linkedinIcon} alt={'Social Media Icon'}/></a>
                    <a href='#'><img src={gplusIcon} alt={'Social Media Icon'}/></a>
                </div>
            </footer>
        </React.Fragment>
    )
}

export default Index;