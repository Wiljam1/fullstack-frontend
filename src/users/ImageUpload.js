import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ImageUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Fetch images when the component mounts
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await axios.get('http://localhost:3001/images');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images:', error.message);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file');
            return;
        }
    
        const formData = new FormData();
        formData.append('image', selectedFile);
    
        try {
            const response = await axios.post('http://localhost:3001/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setImages((prevImages) => [...prevImages, response.data]); // Update state with the new image
        } catch (error) {
            console.error('Error uploading image:', error.message);
        }
    };

    return (
        <div className='container'>
            <div className='row'>
            <div className='col-md-6 offset-md-3 border rounded p-4 mt-2 shadow'>
                <h2 className='text-center m-4'>Image Upload</h2>
                <form onSubmit={handleUpload}>
                <div className='mb-3'>
                    <label htmlFor='image' className='form-label'>
                    Select Image
                    </label>
                    <input type='file' className='form-control' name='image' onChange={handleFileChange} />
                </div>
                <button type='submit' className='btn btn-outline-primary'>
                    Upload Image
                </button>
                <Link className='btn btn-outline-danger mx-2' to='/'>
                    Cancel
                </Link>
                </form>

                <div>
                    <h2 className='mt-4'>Uploaded Images</h2>
                    {Array.isArray(images) && images.length > 0 ? (
                        images.map((image, index) => (
                            <div key={index}>
                                <Link to={`/image-edit/${image.id}`}>
                                    <img
                                        src={`data:image/jpeg;base64,${image.data}`}
                                        alt={`Image ${image.id}`}
                                        width='150'
                                        height='150'
                                        className='m-2'
                                    />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No images available.</p>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default ImageUpload;