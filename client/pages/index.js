import React from 'react';
import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    return (
        <div className="container">
            { currentUser ?
                <p>You are logged in as { currentUser.email }</p> :
                <p>You are not logged in.</p>
            }
        </div>
    )
}

LandingPage.getInitialProps = async (context) => {
    return {
        title: 'Landing Page'
    };
}

export default LandingPage;
