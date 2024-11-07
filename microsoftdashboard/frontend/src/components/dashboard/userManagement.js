import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true before API call
      setError(""); // Reset error state before fetching
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_API_URL}/pri/user?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.data.users);
        setCurrentPage(response.data.data.currentPage);
        setTotalPages(response.data.data.totalPages);
        setTotalUsers(response.data.data.totalusers);
      } catch (error) {
        setError("Failed to fetch users."); // Set error message
        toast.error("Failed to fetch users.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading to false after API call completes
      }
    };

    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const handleAddUser = () => {
    navigate("/add-user");
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="button-container d-flex justify-content-between">
                  <h2>User Management</h2>
                  <button className="btn btn-primary mb-3" onClick={handleAddUser}>
                    Add User
                  </button>
                </div>
                <div className="table-responsive">
                  {loading ? (
                    <p>Loading Users...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <>
                      <table className="table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td>{user._id}</td>
                              <td>{user.email}</td>
                              <td>{user.username}</td>
                              <td>{user.role}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="form-group d-flex align-items-center">
                    <label htmlFor="itemsPerPage" className="me-2">Items per page:</label>
                    <select
                      id="itemsPerPage"
                      className="form-select"
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      style={{ width: "auto" }}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UserManagement;