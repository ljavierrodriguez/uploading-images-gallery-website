import React, { useEffect, useState } from 'react';
import './../styles/style.css';

export default function Home() {

    const [gallery, setGallery] = useState(null)

    const [title, setTitle] = useState("");
    const [active, setActive] = useState(true);
    const [image, setImage] = useState(null);

    const [error, setError] = useState(null);

    const [filter, setFilter] = useState(null);

    useEffect(() => {
        getImagesGallery(filter);
    }, [])

    useEffect(() => {
        getImagesGallery(filter);
    }, [filter])

    const getImagesGallery = async (filter) => {
        try {

            let query = (filter === null ? "" : filter === true ? "?active=true" : "?active=false") // validando si filtramos o no el resultado 

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/galleries${query}`)
            const data = await response.json()

            setGallery(data);

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (title !== "" && image !== null) {


            const formData = new FormData()

            formData.append('title', title);
            formData.append('active', active);
            formData.append('image', image);

            uploadImage(formData);

            setError(null);
            e.target.reset();
        } else {
            setError("Please, complete the form");
        }
    }

    const uploadImage = async formData => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/galleries`, {
                method: 'POST',
                body: formData
            })
            const data = await response.json();

            if (data.id) {
                getImagesGallery();
                setTitle("");
                setActive(true);
                setImage(null);
                setError(null);
            } else {
                setError("Error uploading image")
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    const handleChangeActive = async (id, status) => {
        console.log(status);
        try {

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/galleries/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    active: status
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            if(data.id){
                getImagesGallery(filter);
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 py-5">
                        <h1 className="text-center">Gallery</h1>
                        <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                            Upload Image
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label className='mb-2' >Filter:</label>
                            <div className="col-md-12">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" checked={(filter === null ? "checked" : "")} onChange={() => setFilter(null)} />
                                    <label className="form-check-label" htmlFor="inlineRadio1">All</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" checked={(filter === true ? "checked" : "")} onChange={() => setFilter(true)} />
                                    <label className="form-check-label" htmlFor="inlineRadio2">Active</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" checked={(filter === false ? "checked" : "")} onChange={() => setFilter(false)} />
                                    <label className="form-check-label" htmlFor="inlineRadio3">Inactive</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {
                        !!gallery &&
                        gallery.map((image, index) => {
                            return (
                                <div className="col-md-4" key={index}>
                                    <div className="card position-relative my-3">
                                        <img src={image.filename} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <p className="card-text text-center text-primary">{image.title}</p>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" id="imageActive"
                                                    checked={(image.active ? "checked" : "")}

                                                    onChange={() => handleChangeActive(image.id, !image.active)}

                                                />
                                                <label className="form-check-label" htmlFor="imageActive">{image.active ? "active" : "inactive"}</label>
                                            </div>
                                        </div>
                                        <span className={"position-absolute top-0 start-100 translate-middle badge rounded-pill " + (image.active ? "bg-success" : "bg-danger")}>
                                            {image.active ? "active" : "inactive"}
                                            <span className="visually-hidden">Image Status</span>
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Upload Image File</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    {
                        !!error &&
                        (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )
                    }

                    <div className='py-3'>
                        Please fill form to upload image.
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="title" name="title" placeholder="Insert Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="radio" name="active" id="active_false" checked={(!active ? "checked" : "")} onChange={(e) => setActive(!active)} />
                            <label className="form-check-label" htmlFor="active_false">
                                Inactive
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="radio" name="active" id="active_true" checked={(active ? "checked" : "")} onChange={(e) => setActive(!active)} />
                            <label className="form-check-label" htmlFor="active_true">
                                Active
                            </label>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">File</label>
                            <input type="file" className="form-control" id="image" name="image" onChange={e => setImage(e.target.files[0])} />
                        </div>
                        <div className="d-grid">
                            <button className="btn btn-primary btn-sm gap-2">
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}