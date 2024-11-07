import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';

const python_API_URL = process.env.PYTHON_API_URL || "http://192.168.1.10:5002";

const FilesCollate = () => {
    const [files, setFiles] = useState([]);
    const [downloadLink, setDownloadLink] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [toggle, setToggle] = useState(false);

    const onDrop = (acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    };

    const handleRemoveFile = (file) => {
        setFiles((prevFiles) => prevFiles.filter((f) => f !== file));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (files.length === 0) {
            toast.error('Please upload at least one Excel file.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        setUploading(true);
        setUploadProgress(0);
        setToggle(false);

        try {
            const response = await axios.post(`${python_API_URL}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentCompleted);
                },
            });

            if (response.status === 200) {
                const { file_url } = response.data;
                setDownloadLink(file_url);
                toast.success('Files collated successfully! Ready to download.');
                setToggle(true);
            } else {
                toast.error('Error processing files. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDownload = async () => {
        if (downloadLink) {
            try {
                const response = await fetch(downloadLink, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'collated_file.xlsx');
                document.body.appendChild(link);
                link.click();
                toast.success("Collated Excel file downloaded successfully.");
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error downloading the file:', error);
                toast.error('Error downloading the file.');
            }
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.xlsx',
    });

    return (
        <div style={{ padding: '20px', backgroundColor: 'white', margin: '20px 60px 0 60px', width: '780px', height: 'max-content' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '30px' }}>Upload Excel Files to Collate</h2>
            <form onSubmit={handleSubmit}>
                <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '120px', borderRadius: '5px', textAlign: 'center' }}>
                    <input {...getInputProps()} />
                    <h4>Drag 'n' drop some files here, or click to select files</h4>
                </div>
                <div className="file-list mt-3">
                    {files.map((file) => (
                        <div key={file.name} className="file-item d-flex justify-content-between align-items-center mt-2">
                            <span>{file.name}</span>
                            <button type="button" onClick={() => handleRemoveFile(file)} className='btn btn-danger btn-sm'>Remove</button>
                        </div>
                    ))}
                </div>
                <button
                    type="submit"
                    disabled={uploading}
                    className='btn btn-primary mt-3'
                >
                    {uploading ? 'Uploading...' : 'Upload and Collate'}
                </button>
            </form>

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <div className="progress" style={{ width: "50%" }}>
                        <div
                            className="progress-bar progress-bar-striped bg-info"
                            role="progressbar"
                            style={{ width: `${uploadProgress}%` }}
                            aria-valuenow={uploadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            Uploading: {uploadProgress}%
                        </div>
                    </div>
                </div>
            )}

            {downloadLink && (
                <div id="download-link" className="mt-3">
                    <button onClick={handleDownload} className='btn btn-secondary'>
                        Download Collated Excel File
                    </button>
                </div>
            )}

            {toggle && (
                <div className="toggle-section mt-3">
                    {/* You can add any additional information or buttons here */}
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default FilesCollate;
