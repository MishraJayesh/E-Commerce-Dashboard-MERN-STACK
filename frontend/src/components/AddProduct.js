import React, { useState } from 'react';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompnay] = useState('');
    const [error, setError] = useState(false);

    const addProduct = async () => {

        if (!name || !price || !company || !category) {
            setError(true);
            return false
        }

        const userId = JSON.parse(localStorage.getItem('user'))._id;
        let result = await fetch("http://localhost:8000/add-product", {
            method: "post",
            body: JSON.stringify({ name, price, category, company, userId }),
            headers: {
                "Content-type": "application/json",
                authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`

            }
        });
        result = await result.json();
        console.log(result)

    }

    return (
        <div className='product'>
            <h1>Add Product</h1>

            <input type="text" placeholder='Enter Product Name' className='inputField'
                value={name} onChange={(e) => { setName(e.target.value) }}
            />
            {error && !name && <span className='invalid-input'>Enter Valid Name</span>}

            <input type="text" placeholder='Enter Product Price' className='inputField'
                value={price} onChange={(e) => { setPrice(e.target.value) }}
            />
            {error && !price && <span className='invalid-input'>Enter Valid Price</span>}

            <input type="text" placeholder='Enter Product Category' className='inputField'
                value={category} onChange={(e) => { setCategory(e.target.value) }}
            />
            {error && !category && <span className='invalid-input'>Enter Valid Category</span>}

            <input type="text" placeholder='Enter Product Company' className='inputField'
                value={company} onChange={(e) => { setCompnay(e.target.value) }}
            />
            {error && !company && <span className='invalid-input'>Enter Valid Company</span>}


            <button onClick={addProduct} className='appButton'>Add Product</button>
        </div>
    )
}

export default AddProduct;