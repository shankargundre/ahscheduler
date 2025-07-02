import React from 'react';
import  { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const JobRunStatus = () => {

  const [jobRunStatusData, setJobRunStatusData] = useState([]);
  const [showJobRunStatus, setShowJobRunStatus] = useState(false);

  const [jobRunStatusPage, setJobRunStatusPage] = useState(1);
  const jobRunStatusRowsPerPage = 8;

  const [jobNameFilter, setJobNameFilter] = useState("");
  const [jobRunStatusFilter, setJobRunStatusFilter] = useState("");
  const apiUrl = window._env_.API_BASE_URL;
  const user =  import.meta.env.VITE_SCHEDULAR_API_USER || "grcuser";
  const pass =  import.meta.env.VITE_SCHEDULAR_API_PWD || "crave@123";
  
  const formatTimestamp = (timestamp) => {
    return timestamp?.split(".")[0] || "";
  };
  const fetchJobRunStatus = async () => {
  
    try {
      const token =btoa(`${user}:${pass}`);;
      const response = await axios.get(`${apiUrl}/jobschedular/jobRunStatus`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });
  
      setJobRunStatusData(response.data); 
      setShowJobRunStatus(true);
    } catch (error) {
      console.error('❌ Error fetching Job Run Status:', error);
      alert('Failed to fetch Job Run Status');
    }
  };

  useEffect(() => {
    console.log('Fetching jobs using URL:', `${apiUrl}/jobschedular/jobRunStatus`);
    fetchJobRunStatus();
  });

  const filteredJobRunStatus = jobRunStatusData.filter((item) => {
    const jobNameMatch = item.jobName.toLowerCase().includes(jobNameFilter.toLowerCase());
    const jobRunStatusMatch = item.jobRunStatus.toLowerCase().includes(jobRunStatusFilter.toLowerCase());
    return jobNameMatch && jobRunStatusMatch;
  });
  
  const paginatedRunStatus = filteredJobRunStatus.slice(
    (jobRunStatusPage - 1) * jobRunStatusRowsPerPage,
    jobRunStatusPage * jobRunStatusRowsPerPage
  );
  
  const totalRunStatusPages = Math.ceil(filteredJobRunStatus.length / jobRunStatusRowsPerPage);


  return (
    <div style={{ marginTop: '20px' }}>
   <h3>🟢 Job Run Status</h3>

  <div
    style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '10px',
    }}
  >
    {/* <button
      onClick={fetchJobRunStatus}
      style={{
        padding: '6px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Show Job Run Status
    </button> */}

    <input
      type="text"
      placeholder="Filter by Job Name"
      value={jobNameFilter}
      onChange={(e) => {
        setJobNameFilter(e.target.value);
        setJobRunStatusPage(1);
      }}
      style={{
        padding: '6px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    />
    <input
      type="text"
      placeholder="Filter by Job Status"
      value={jobRunStatusFilter}
      onChange={(e) => {
        setJobRunStatusFilter(e.target.value);
        setJobRunStatusPage(1);
      }}
      style={{
        padding: '6px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    />
  </div>
  
    {showJobRunStatus && (
      <>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th className="table-th">Job Run Id</th>
              <th className="table-th">Job Name</th>
                <th className="table-th">App Name</th>
              <th className="table-th">Job Incr Run Id</th>
              <th className="table-th">ScheduleType</th>
              <th className="table-td-date">Next Run</th>
              <th className="table-th">Job Run Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRunStatus.length === 0 ? (
              <tr><td colSpan="5" className="table-td" style={{ textAlign: 'center' }}>No job run status data available</td></tr>
            ) : (
              paginatedRunStatus.map((item, index) => (
                <tr key={index}>
                  <td className="table-td">{item.runId}</td>
                  <td className="table-td">{item.jobName}</td>
                    <td className="table-td">{item.applicationName}</td>
                  <td className="table-td">{item.jobIncrRunId}</td>
                  <td className="table-td">{item.scheduleType}</td>
                  <td className="table-td-date">{formatTimestamp(item.nextStartAt)}</td> 
                  <td className="table-td">{item.jobRunStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
  
        {totalRunStatusPages > 1 && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {Array.from({ length: totalRunStatusPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setJobRunStatusPage(i + 1)}
                style={{
                  margin: '0 5px',
                  padding: '6px 12px',
                  backgroundColor: jobRunStatusPage === i + 1 ? '#007bff' : '#e7e7e7',
                  color: jobRunStatusPage === i + 1 ? 'white' : 'black',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </>
    )}
  </div>
  );
};

export default JobRunStatus;