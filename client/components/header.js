import React from 'react';
import Router from 'next/router';
import Link from 'next/link';
import buildClient from "../api/build-client";

const Header = ({currentUser}) => {

    const handleSignout = async () => {
        const client = buildClient({req: {}})
        await client.post('/api/users/signout')
        Router.push('/')
    }
    return (
        <nav className="navbar navbar-light bg-light">
            <Link href="/"><a className="navbar-brand">TktBitch</a></Link>

            <div className="d-flex justify-content-end">
                <ul className="nav d-flex align-items-center">
                    { currentUser ?
                        (<li className="nav-item"><a className="nav-link" onClick={handleSignout}>Sign Out</a></li>) :
                        (
                            <>
                                <li className="nav-item"><Link href="/auth/signup"><a className="nav-link">Sign Up</a></Link></li>
                                <li className="nav-item"><Link href="/auth/signin"><a className="nav-link">Sign In</a></Link></li>
                            </>
                        )
                    }
                </ul>
            </div>
        </nav>
    )
}

export default Header;
