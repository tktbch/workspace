import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header title={pageProps.title} currentUser={currentUser}/>
            <div className="container">
                <Component {...pageProps} currentUser={currentUser} />
            </div>
        </div>
    )
}

AppComponent.getInitialProps = async (appContext) => {
    const { ctx, Component } = appContext;
    const client = buildClient(ctx);
    const resp = await client.get(`/api/users/currentuser`);
    let pageProps = {};
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx, client, resp.data.currentUser)
    }

    return {
        pageProps,
        ...resp.data
    };
}


export default AppComponent;
