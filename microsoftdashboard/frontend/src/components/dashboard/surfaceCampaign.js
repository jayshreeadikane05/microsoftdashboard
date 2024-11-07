import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";
const python_API_URL = process.env.PYTHON_API_URL || "http://192.168.1.10:5000";
const BASE_API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api";
const SurfaceCampaign = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [searchYear, setSearchYear] = useState('');
  const [searchQuarter, setSearchQuarter] = useState('');
  const [searchCycle, setSearchCycle] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [isDownloadDisabled, setIsDownloadDisabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0); 
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login'); 
    } else {
      fetchCampaigns(); 
    }
  }, [navigate]);

  useEffect(() => {
    fetchCampaigns();
  }, [currentPage, itemsPerPage, searchYear, searchQuarter, searchCycle, searchStatus]); 

  const fetchCampaigns = async (page = currentPage, limit = itemsPerPage) => {
    setLoading(true);
    setError(''); 
    try {
      const token = Cookies.get('token');
      const response = await axios.post(`${BASE_API_URL}/pri/campagin/surface`, {
        year: searchYear,
        quarter: searchQuarter,
        cycle: searchCycle,
        status: searchStatus,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          page,
          limit,
        },
      });

      setCampaigns(response.data.data.campaigns || []);
      setTotalPages(response.data.data.totalPages);
      setTotalCampaigns(response.data.data.totalCampaigns); 
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to fetch campaigns.');
      setCampaigns([]); 
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

  const handleYearChange = (e) => {
    setSearchYear(e.target.value);
    setCurrentPage(1); 
  };

  const handleQuarterChange = (e) => {
    setSearchQuarter(e.target.value);
    setCurrentPage(1);
  };

  const handleCycleChange = (e) => {
    setSearchCycle(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setSearchStatus(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChangeCampaign = async (campaignId, newStatus) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.put(`${BASE_API_URL}/pri/campagin/${campaignId}`, {
        status: newStatus,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedCampaigns = campaigns.map(campaign =>
          campaign._id === campaignId ? { ...campaign, status: newStatus } : campaign
        );
        setCampaigns(updatedCampaigns);
        toast.success("Status Updated Successfully")
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
      setError('Failed to update status.');
    }
  };
  function handleDownloadExcel(filename) {
    const downloadUrl = `${python_API_URL}/${filename}`;
  
    axios({
      url: downloadUrl,
      method: 'GET',
      responseType: 'blob', 
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); 
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('Error downloading the file:', error);
      });
  }
  const handleDownloadLog = async () => {
    try {
      const response = await fetch(`${python_API_URL}/download_log`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and simulate a click to download the file
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'app.log'); // Set the file name for download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading log file:', error);
    }
  };
  


  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-body">
              <h4>Surface Campaigns</h4>
              <div className="d-flex mb-3 mt-5">
                <select className="form-select" value={searchYear} onChange={handleYearChange}>
                  <option value="">Select Year</option>
                  {[2023, 2024, 2025, 2026].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
  
                <select className="form-select minimal ms-2" value={searchQuarter} onChange={handleQuarterChange}>
                  <option value="">Select Quarter</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
  
                <select className="form-select minimal ms-2" value={searchCycle} onChange={handleCycleChange}>
                  <option value="">Select Cycle</option>
                  <option value="1">Cycle 1</option>
                  <option value="2">Cycle 2</option>
                  <option value="3">Cycle 3</option>
                  <option value="4">Cycle 4</option>
                </select>
  
                <select className="form-select minimal ms-2" value={searchStatus} onChange={handleStatusChange}>
                  <option value="">Select Status</option>
                  <option value="LP Generated">LP Generated</option>
                  <option value="Content Hosted">Content Hosted</option>
                  <option value="Changes Required">Changes Required</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {!loading && campaigns.length > 0 && (
                  <p className='showing-result'>
                    {`Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, totalCampaigns)} to ${Math.min(
                      currentPage * itemsPerPage,
                      totalCampaigns
                    )} of ${totalCampaigns} entries`}
                  </p>
                )}
              </div>
  
              {loading ? (
                <p>Loading campaigns...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Quarter</th>
                          <th>Cycle</th>
                          <th>Html file Name</th>
                          <th>Status</th>
                          <th>IT-Tech Link sheet</th>
                          <th>Error Log</th>
                          <th>Created Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(campaigns) && campaigns.length > 0 ? (
                          campaigns.map((campaign) => (
                            <tr key={campaign._id}>
                              <td>{campaign.year}</td>
                              <td>{campaign.quarter.startsWith("Q") 
                                ? `Quarter ${campaign.quarter.substring(1)}` 
                                : campaign.quarter}
                              </td>
                              <td>{campaign.cycle === "1" ? `Cycle 1` : `Cycle ${campaign.cycle}`}</td>
                              <td>{`${campaign.namehtml}.html`}</td>   
                              <td>
                                <div className="position-relative">
                                  <select
                                    className="form-select"
                                    value={campaign.status || "LP Generated"}
                                    onChange={(e) => handleStatusChangeCampaign(campaign._id, e.target.value)}
                                  >
                                    <option value="LP Generated">LP Generated</option>
                                    <option value="Content Hosted">Content Hosted</option>
                                    <option value="Changes Required">Changes Required</option>
                                    <option value="Inactive">Inactive</option>
                                  </select>
                                  {campaign.status && (
                                    <span className="position-absolute top-50 end-0 translate-middle-y pe-2 text-success">
                                      <i className="bi bi-check-circle"></i> 
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                {campaign.updated_excel_sheet ? (
                                  <button onClick={() => handleDownloadExcel(campaign.updated_excel_sheet)} className="btn btn-primary">
                                    Download Excel
                                  </button>
                                ) : (
                                  "No file uploaded"
                                )}
                              </td>
                              <td>
                                <button onClick={handleDownloadLog} className="btn btn-secondary">
                                  Download Log
                                </button>
                              </td>
                              <td>{formatDate(campaign.createdAt)}</td> 
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8">No campaigns available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="form-group d-flex align-items-center">
                      <label htmlFor="itemsPerPage" className="me-2">Items per page:</label>
                      <select
                        id="itemsPerPage"
                        className="form-select"
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        style={{ width: "auto" }} // Make sure the select box is not too wide
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                      </select>
                    </div>
                    <nav aria-label="Page navigation">
                      <ul className="pagination mb-0">
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index}
                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default SurfaceCampaign;