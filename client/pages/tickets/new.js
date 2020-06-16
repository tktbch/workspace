import React, {useState} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = ({client}) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const handleSuccess = () => {
        Router.push('/');
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    }

    const onPriceBlur = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2))
    }


    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: { title, price },
        onSuccess: handleSuccess
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        doRequest();
    }

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={handleSubmit}>
                { errors }
                <div className="form-group">
                    <label>Title</label>
                    <input onChange={handleTitleChange}
                           value={title}
                           className="form-control"/>
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input onChange={handlePriceChange}
                           onBlur={onPriceBlur}
                           value={price}
                           className="form-control"/>
                </div>
                <button className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default NewTicket;
