import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';


const ScheduledJobsTable = () => {
const apiUrl =window._env_.API_BASE_URL;
  const [jobDataList, setJobDataList] = useState([]);
  const [scheduledJobNameFilter, setScheduledJobNameFilter] = useState('');
const [scheduledJobStatusFilter, setScheduledJobStatusFilter] = useState('');
const [currentPage, setCurrentPage] = useState(1);

const itemsPerPage = 8;

const filteredScheduledJobs = jobDataList.filter((job) => {
  const nameMatch = job.jobName.toLowerCase().includes(scheduledJobNameFilter.toLowerCase());
  const statusMatch = (job.jobStatus || '').toLowerCase().includes(scheduledJobStatusFilter.toLowerCase());
  return nameMatch && statusMatch;
});

const totalPages = Math.ceil(filteredScheduledJobs.length / itemsPerPage);
const paginatedData = filteredScheduledJobs.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
  const user = window._env_.SCHEDULER_API_USER || "grcuser";
  const pass = window._env_.SCHEDULER_API_PWD || "crave@123";

const formatTimestamp = (timestamp) => {
  return timestamp?.split('.')[0] || '';
};


  const fetchJobData = async () => {
    try {
      const token = btoa(`${user}:${pass}`);
      const response = await axios.get(`${apiUrl}/jobschedular/schJobList`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });
      setJobDataList(response.data);
    } catch (error) {
      console.error('❌ Fetch error:', error);
    }
  };

  useEffect(() => {
    console.log('Fetching jobs using URL:', `${apiUrl}/jobschedular/schJobList`);
    fetchJobData();
  },[apiUrl]);




  return (
    <div>
<div className="header-container">
  <div className="title">
    📋 <strong>Scheduled Jobs</strong>
  </div>
  <button className="refresh-button" onClick={fetchJobData} >
    🔄 Refresh Jobs
  </button>
</div>



      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
  <input
    type="text"
    placeholder="Filter by Job Name"
    value={scheduledJobNameFilter}
    onChange={(e) => {
      setScheduledJobNameFilter(e.target.value);
      setCurrentPage(1);
    }}
    style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
  />
  <input
    type="text"
    placeholder="Filter by Job Status"
    value={scheduledJobStatusFilter}
    onChange={(e) => {
      setScheduledJobStatusFilter(e.target.value);
      setCurrentPage(1);
    }}
    style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
  />
</div>

<div style={{ overflowX: "auto" }}>
        <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        tableLayout: "fixed", // Optional, for consistent layout
      }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th className="table-th">Job Name</th>
              <th className="table-th">Group</th>
               <th className="table-th">App Name</th>
              <th className="table-th">Schedule Type</th>
              <th className="table-th">Start At</th>
              <th className="table-th">End At</th>
              <th className="table-th">Frequency</th>
              <th className="table-th">Job Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "12px" }}
                >
                  No jobs found
                </td>
              </tr>
            ) : (
              paginatedData.map((job, index) => (
                <tr key={index}>
              <td className="table-td">{job.jobName}</td>
              <td className="table-td">{job.groupName}</td>
                <td className="table-td">{job.applicationName}</td>
              <td className="table-td">{job.scheduleType || (job.runNow ? 'Immediate' : 'Once')}</td>
              <td className="table-td">{formatTimestamp(job.startAt) || '-'}</td>
              <td className="table-td">{formatTimestamp(job.endAt) || '-'}</td>
              <td className="table-td">{job.frequencyInMinutes || '-'}</td>
              <td className="table-td">{job.jobStatus || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "0 5px",
                padding: "6px 12px",
                backgroundColor: currentPage === i + 1 ? "#007bff" : "#e7e7e7",
                color: currentPage === i + 1 ? "white" : "black",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduledJobsTable;