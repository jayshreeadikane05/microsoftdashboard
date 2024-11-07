import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import io from "socket.io-client";
// Import the ExcelViewer component
import ExcelViewer from './ExcelViewer';

import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
const python_API_URL = process.env.PYTHON_API_URL || "http://192.168.1.10:5000";
const BASE_API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api";
const socket = io(python_API_URL); // Corrected this line
const GenerateLP = () => {
  const navigate = useNavigate();
  const excelFileUrl = `${process.env.PUBLIC_URL}/testexcel.xlsx`;
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
  const [dataSolution, setDataSolution] = useState("");
  const [quarter, setQuarter] = useState("");
  const [cycle, setCycle] = useState("");
  const [nameHtml, setNameHtml] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [zipFile, setZipFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(false); // Track if button is disabled
  const [isUploadDisabled, setIsUploadDisabled] = useState(false); // New state for upload button

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataSolution || !quarter || !cycle || !nameHtml || !file) {
      setMessages(["Please fill out all the fields and upload a file."]);
      return;
    }

    const formData = new FormData();
    formData.append("datasolution", dataSolution);
    formData.append("quarter", quarter);
    formData.append("cycle", cycle);
    formData.append("namehtml", nameHtml);
    formData.append("file", file);

    try {
      setLoading(true); // Start loading before the upload
      setUploadProgress(0); // Reset progress

      const uploadResponse = await axios.post(
        `${python_API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted); // Update progress
          },
        }
      );

      if (uploadResponse.status === 200 && uploadResponse.data.filename) {
        const filename = uploadResponse.data.filename;
        const scrapeResponse = await axios.get(
          `${python_API_URL}/scrape/${filename}`,
          {
            params: {
              quarter,
              cycle,
              datasolution: dataSolution,
              namehtml: nameHtml,
            },
          }
        );

        if (scrapeResponse.status ==200 ) {
          const generatedZipFile = scrapeResponse.data.zipFilename;
          const updatedexcelfile = scrapeResponse.data.updatedExcelSheet;

          console.log("scrappingresultsss>>>>",scrapeResponse )
          setZipFile(generatedZipFile, updatedexcelfile);

          // Show the toast when scraping is successful and zip file is ready
          toast.success(
            <>
              Scrapped Successfully <br />
              Download the zip file.
            </>
          );
          setMessages(["Scraping and file generation completed successfully."]);
          await sendCampaignDetails(generatedZipFile, updatedexcelfile);
        } else {
          setMessages(["Scraping failed or zip file not generated."]);
        }
      } else {
        setMessages(["File upload failed"]);
      }
    } catch (error) {
      setMessages([`Error: ${error.response?.data?.message || error.message}`]);
    } finally {
      setLoading(false);
      setUploadProgress(0); // Reset after completion
    }
  };

  const sendCampaignDetails = async (zipFilename, updatedexcelfile) => {
    const year = new Date().getFullYear();
    const token = Cookies.get("token");

    const formData = new FormData();
    formData.append("year", year);
    formData.append("datasolution", dataSolution);
    formData.append("quarter", quarter);
    formData.append("cycle", cycle);
    formData.append("namehtml", nameHtml);
    formData.append("zip_file_name", zipFilename);
    formData.append("updated_excel_sheet", updatedexcelfile);
    formData.append("file", file);
    try {
      const response = await axios.post(
          `${BASE_API_URL}/pri/campagin`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessages((prev) => [...prev, "Campaign created successfully."]);
        setDataSolution("");
        setQuarter("");
        setCycle("");
        setNameHtml("");
        setFile(null);
      } else {
        setMessages((prev) => [...prev, "Failed to send campaign details."]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        `Error sending campaign details: ${error.message}`,
      ]);
    }
  };

  const handleDownload = async () => {
    setIsDownloadDisabled(true); // Disable the button after click
    if (!zipFile) return;

    toast.success("Zip Downloaded Succesfully");

    try {
      const response = await axios.get(
       `${python_API_URL}/download_zip/${zipFile}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", zipFile);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessages('');
      setIsUploadDisabled(true);
    } catch (error) {
      setMessages([`Download failed: ${error.message}`]);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-md-6 grid-margin">
            <div className={`card ${loading ? "blur" : ""}`}>
              <div className="card-body">
                <h4 className="card-title">Upload Excel Sheet to Generate LP</h4>
                
                <form className="forms-sample" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="datasolution">Select Data Solution:</label>
                    <select
                      className="form-control minimal"
                      name="datasolution"
                      id="datasolution"
                      value={dataSolution}
                      onChange={(e) => setDataSolution(e.target.value)}
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="azure">Azure</option>
                      <option value="bizzapps">BizzApps</option>
                      <option value="modernwork">ModernWork</option>
                      <option value="security">Security</option>
                      <option value="surface">Surface</option>
                      <option value="power-platform">Power Platform</option>
                    </select>
                  </div>

              
                  <div className="form-group mb-3">
                    <label htmlFor="quarter">Select Quarter:</label>
                    <select
                      className="form-control minimal"
                      name="quarter"
                      id="quarter"
                      value={quarter}
                      onChange={(e) => setQuarter(e.target.value)}
                    >
                      <option value="">Select Option</option>
                      <option value="Q1">Quarter Q1</option>
                      <option value="Q2">Quarter Q2</option>
                      <option value="Q3">Quarter Q3</option>
                      <option value="Q4">Quarter Q4</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="cycle">Select Cycle:</label>
                    <select
                      className="form-control minimal"
                      name="cycle"
                      id="cycle"
                      value={cycle}
                      onChange={(e) => setCycle(e.target.value)}
                    >
                      <option value="">Select Option</option>
                      <option value="1">Cycle 1</option>
                      <option value="2">Cycle 2</option>
                      <option value="3">Cycle 3</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label htmlFor="namehtml">Add the name of HTML File (Only Add Number)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="namehtml"
                      id="namehtml"
                      value={nameHtml}
                      onChange={(e) => setNameHtml(e.target.value)}
                    />
                  </div>

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
                   
                  >
                    Upload and Generate
                  </button>
                  
                </form>

                {messages.length > 0 && (
                  <ul>
                    {messages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                )}

                {zipFile && (
                  <div className="mt-3">
                    <p>Generated Zip File: {zipFile}</p>
                    <button
                      onClick={handleDownload}
                      className="btn btn-secondary"
                      disabled={isDownloadDisabled} // Disable the button after download start
                    >
                      Download Zip File
                    </button>
                  </div>
                )}
              </div>
            </div>
            {loading && (
              <div className="d-flex justify-content-center align-items-center mt-3">
                <div className="progress" style={{ width: "100%" }}>
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
                1st row's heading and data should be as per the example given below : <br/>(refer example below)
                </b>
              </h4>
              <br />
              
              <div>
    
    <ExcelViewer fileUrl={excelFileUrl} />
  </div>
              <ul>
                <li>url</li>
                <li>country</li>
                <li>language</li>
                <li>solutionarea</li>
                <li>assetname</li>
                <li>pdflink</li>
                <li>formtype</li>
                <li>contenttype</li>
                <li>PDF link & webinar link: make sure to add "HTTPS" </li>
                <li>United Arab Emirates - Country Name Need to be Renamed as UAE  </li>
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
    </>
  );
};

export default GenerateLP;
