import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import ExcelViewer from './ExcelViewer';
const python_API_URL = process.env.PYTHON_API_URL || "http://192.168.1.10:5000";
const socket = io(python_API_URL);

const Snippet = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const excelFileUrl = `${process.env.PUBLIC_URL}/snippets.xlsx`;
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/login");
    }
    socket.on("progress_update", (data) => {
      setScrapeProgress(data.progress); 
    });

    return () => {
      socket.off("progress_update"); 
    };
  }, [navigate]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessages([]);
    setDownloadUrl(null); 

    try {
      setUploadProgress(0);
      const response = await axios.post(`${python_API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted); 
        },
      });

      const { download_url } = response.data; 
      setDownloadUrl(download_url);
     
      setMessages([...messages, "File uploaded successfully!"]);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    } finally {
      setLoading(false);
      setUploadProgress(0); 
    }
  };

  
    const handleDownload = async () => {
      if (downloadUrl) {
        try {
          const response = await fetch(downloadUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/zip',
            },
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'snippet.zip');
          document.body.appendChild(link);
          link.click();
          toast.success("Zip Downloaded Succesfully");
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading the file:', error);
          toast.error('Error downloading the file.');
        }
      }
    };
    


  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-6 grid-margin">
            <div className={`card ${loading ? "blur" : ""}`}>
              <div className="card-body">
                <h4 className="card-title">Upload Excel and Add Snippet</h4>
                <form className="forms-sample" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="file">Upload Excel File:</label>
                    <input
                      type="file"
                      className="form-control"
                      name="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !file}
                  >
                    Upload and Replace
                  </button>
                </form>
                {messages.length > 0 && (
                  <ul>
                    {messages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                )}
                {downloadUrl && (
                  <div className="mt-3">
                    <p>Generated Zip File ready for download</p>
                    <button
                      onClick={handleDownload}
                      className="btn btn-secondary"
                      disabled={loading}
                    >
                      Download Zip File
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Display upload progress bar when progress is between 1 and 99 */}
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

            {/* Display scrape progress bar when progress is between 1 and 99 */}
            {scrapeProgress > 0 && scrapeProgress < 100 && (
              <div className="d-flex justify-content-center align-items-center mt-3">
                <div className="progress" style={{ width: "50%" }}>
                  <div
                    className="progress-bar progress-bar-striped bg-success"
                    role="progressbar"
                    style={{ width: `${scrapeProgress}%` }}
                    aria-valuenow={scrapeProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    Scraping: {scrapeProgress}%
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            className="col-md-6 grid-margin"
            
          >
            <div className="card">
              <div className="card-body">
            <h2 className="card-title">Rules</h2> <br />
              <h4>
                <b>
                  The columns should be the exact same format as shown here <br/>
                </b>
                <b>
                1st row's heading and data should be as per the example given below : <br/> (refer example below)
 
                </b>
              </h4>
              <br />
              
              <div>
    
    <ExcelViewer fileUrl={excelFileUrl} />
  </div>
              <ul>
                <li>URL</li>
                <li>Form Snippet</li>
                <li>Redirect URL (Without HTTPS)</li>
               <li> <b> Create New excel sheet with only three columns collated like example above </b></li>
              </ul>
              <br />
              <p>
               <b> The above rules should be followed properly for error free
                execution of the code</b>
              </p>
            </div>
          </div>
        </div>
        </div>

      </div>
      <ToastContainer />
    </>
  );
};

export default Snippet;
