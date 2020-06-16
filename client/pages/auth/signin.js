import React, {useState} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        doRequest()
    }

    const handleSuccess = data => {
        Router.push('/');
    }

    const { doRequest, errors } = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: { email, password },
        onSuccess: handleSuccess
    });

    return (
        <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            { errors }
            <div className="form-group">
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} className="form-control"/>
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control"/>
            </div>
            <button className="btn btn-primary">Sign In</button>
        </form>
    )
}
