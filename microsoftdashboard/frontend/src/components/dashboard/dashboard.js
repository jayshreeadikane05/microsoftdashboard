import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2'; // Import both Bar and Pie components
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend); // Register all necessary components

const BASE_API_URL = process.env.BASE_API_URL || "http://192.168.1.10:8000/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const chartRef = useRef(null);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      navigate('/login');
    } else {
      axios.get(`${BASE_API_URL}/pri/campaginscount`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        if (response.data && response.data.data) {
          const {
            azureCount,
            bizzCount,
            modernworkCount,
            securityCount,
            surfaceCount,
            powerplatformCount,
            yearMonthData 
          } = response.data.data;

          setCounts({
            azureCount,
            bizzCount,
            modernworkCount,
            securityCount,
            surfaceCount,
            powerplatformCount
          });

          // Prepare data for the pie chart
          const pieLabels = [
            'Azure',
            'BizzApps',
            'Modern Work',
            'Security',
            'Surface',
            'Power Platform'
          ];

          const pieDataValues = [
            azureCount,
            bizzCount,
            modernworkCount,
            securityCount,
            surfaceCount,
            powerplatformCount
          ];

          setPieData({
            labels: pieLabels,
            datasets: [{
              data: pieDataValues,
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
            }],
          });

          // Prepare data for the bar chart
          if (Array.isArray(yearMonthData) && yearMonthData.length > 0) {
            const labels = []; 
            const datasets = [
              { label: 'Azure', data: [], backgroundColor: 'rgba(75, 192, 192, 0.6)' },
              { label: 'BizzApps', data: [], backgroundColor: 'rgba(255, 99, 132, 0.6)' },
              { label: 'Modern Work', data: [], backgroundColor: 'rgba(54, 162, 235, 0.6)' },
              { label: 'Security', data: [], backgroundColor: 'rgba(255, 206, 86, 0.6)' },
              { label: 'Surface', data: [], backgroundColor: 'rgba(153, 102, 255, 0.6)' },
              { label: 'Power Platform', data: [], backgroundColor: 'rgba(255, 159, 64, 0.6)' },
            ];
        
            yearMonthData.forEach(item => {
              labels.push(item.year); 
              datasets[0].data.push(item.azureCount || 0);
              datasets[1].data.push(item.bizzCount || 0); 
              datasets[2].data.push(item.modernworkCount || 0); 
              datasets[3].data.push(item.securityCount || 0); 
              datasets[4].data.push(item.surfaceCount || 0);
              datasets[5].data.push(item.powerplatformCount || 0);
            });
        
            setChartData({
              labels,
              datasets,
            });
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching campaign counts:', error);
      });
    }
  }, [navigate]);

  return (
    <div className="content-wrapper">
      <div className="row">
        <div className="col-sm-12">
          <div className="home-tab">
            <div className="tab-content tab-content-basic">
              <div className="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="overview">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="statistics-details d-flex align-items-center justify-content-between">
                      <div className="counterRow">
                        <p className="statistics-title"> Azure</p>
                        <h3 className="rate-percentage">{counts.azureCount} </h3>
                        <p> Campaigns Generated</p>
                      </div>
                      <div className="counterRow">
                        <p className="statistics-title">BizzApps</p>
                        <h3 className="rate-percentage">{counts.bizzCount} </h3>
                        <p> Campaigns Generated</p>
                      </div>
                      <div className="counterRow">
                        <p className="statistics-title">Modern Work</p>
                        <h3 className="rate-percentage">{counts.modernworkCount}</h3>
                        <p> Campaigns Generated</p>
                      </div>
                      <div className="d-none d-md-block counterRow">
                        <p className="statistics-title">Security</p>
                        <h3 className="rate-percentage">{counts.securityCount} </h3>
                        <p> Campaigns Generated</p>
                      </div>
                      <div className="d-none d-md-block counterRow">
                        <p className="statistics-title">Surface</p>
                        <h3 className="rate-percentage">{counts.surfaceCount} </h3>
                        <p> Campaigns Generated</p>
                      </div>
                      <div className="d-none d-md-block counterRow">
                        <p className="statistics-title">Power Platform</p>
                        <h3 className="rate-percentage">{counts.powerplatformCount} </h3>
                        <p> Campaigns Generated</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
            <div className="col-lg-8 d-flex flex-column">
              <div className="row flex-grow">
                <div className="col-12 grid-margin stretch-card">
                  <div className="card card-rounded">
                    <div className="card-body">
                    
                        <div>
                        <h4 className="card-title card-title-dash">Campaign Data ( Year Wise )</h4>
                        
                        </div>
                        <div className="mt-5" style={{ width: '100%' }}> 
                          <Bar
                            data={chartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  beginAtZero: true,
                                  title: {
                                    display: true,
                                    text: 'Campaign Counts',
                                  },
                                },
                                x: {
                                  title: {
                                    display: true,
                                    text: 'Year',
                                  },
                                },
                              },
                            }}
                            height={400} // Optional: Set a height for the chart
                          />
                        </div>
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 d-flex flex-column">
              <div className="row flex-grow">
                <div className="col-12 grid-margin stretch-card">
                  <div className="card card-rounded">
                    <div className="card-body">
                    
                        <div>
                          <h4 className="card-title card-title-dash">Campaign Data (Year Wise)</h4>
                        </div>
                        <div className="mt-5" style={{ width: '100%', height: '400px' }}> 
                        <Pie
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                          }}
                        />
                      </div>
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
