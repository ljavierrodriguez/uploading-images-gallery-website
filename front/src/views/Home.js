import React, { useEffect, useState } from 'react';
import './../styles/style.css';

export default function Home() {

    const [gallery, setGallery] = useState(null)

    const [title, setTitle] = useState("");
    const [active, setActive] = useState(true);
    const [image, setImage] = useState(null);

    useEffect(() => {
        getImagesGallery();
    }, [])

    const getImagesGallery = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/galleries`)
            const data = await response.json()

            setGallery(data);

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
                    {
                        !!gallery &&
                        gallery.map((image, index) => {
                            return (
                                <div className="col-md-4" key={index}>
                                    <div className="card position-relative">
                                        <img src={image.filename} className="card-img-top" alt="..." />
                                        <div className="card-body">
                                            <p className="card-text text-center text-primary">{image.title}</p>
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

            <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Offcanvas</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className='py-3'>
                        Please fill form to upload image.
                    </div>
                    <form>

                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input type="text" className="form-control" id="title" name="title" placeholder="Insert Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="radio" name="active" id="active_false" checked={(!active ? "checked" : "" )} onChange={(e) => setActive(!active)} />
                            <label className="form-check-label" for="flexRadioDefault1">
                                Inactive
                            </label>
                        </div>
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="radio" name="active" id="active_true" checked={(active ? "checked" : "" )} onChange={(e) => setActive(!active)} />
                            <label className="form-check-label" for="flexRadioDefault2">
                                Active
                            </label>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">File</label>
                            <input type="file" className="form-control" id="image" name="image" />
                        </div>

                    </form>
                </div>
            </div>

        </>
    )
}