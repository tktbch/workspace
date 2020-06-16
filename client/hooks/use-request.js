import React, {useState} from 'react';
import axios from 'axios';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null)
            const resp = await axios[method](url, {...body, ...props});
            if (onSuccess) {
                onSuccess(resp.data)
            }
            return resp.data;
        } catch (err) {
            setErrors(
                <div className="alert alert-danger">
                    <ul>
                        {err.response?.data.errors.map(e => (
                            <li key={e.message}>{e.message}</li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    return { doRequest, errors };
}
