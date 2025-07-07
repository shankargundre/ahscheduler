import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const JobAndApplicationDetailForm = () => {
  const [jobName, setJobName] = useState("");
  const [scheduleType, setScheduleType] = useState("Once");
  const [timeZone, setTimeZone] = useState("Asia/Kolkata");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [frequencyInMinutes, setFrequencyInMinutes] = useState("");

  const [applicationName, setApplicationName] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [tenantID, setTenantID] = useState("");
  const [applicationList, setApplicationList] = useState([]);
  const [jobRequestBody, setJobRequestBody] = useState("");
const groupName = "grc";
  const [apiNames, setApiNames] = useState([]);
  const [apiName, setApiName] = useState("");
  const apiUrl = window._env_.API_BASE_URL;
 // const appTenant = import.meta.env.API_TENANT || "DEVINST";
  const user =  import.meta.env.VITE_SCHEDULAR_API_USER || "grcuser";
  const pass =  import.meta.env.VITE_SCHEDULAR_API_PWD || "crave@123";
   const { instance } = useParams();

  const formatWithSeconds = (dateTime) => {
    return dateTime.length === 16 ? `${dateTime}:00` : dateTime;
  };

  const token = btoa(`${user}:${pass}`);
  useEffect(() => {
    axios
      .get(`${apiUrl}/jobschedular/apiList`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      .then((response) => {
        setApiNames(response.data); // e.g. ["AllUserRole", "RoleContent"]
      })
      .catch((error) => {
        console.error("Error fetching APIS:", error);
      });
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/registerscimapp/registerfortenant/${instance}/getAllApplications`
        );
        setApplicationList(response.data.Applications);
      } catch (error) {
        console.error("Failed to fetch application Names:", error);
        alert("❌ Could not load application Names.");
      }
    };
    fetchApplications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobName || !groupName) {
      alert("Please fill in the required fields.");
      return;
    }

    let jobData = {
      jobName,
      groupName,
      scheduleType,
      applicationData: {
        applicationName,
        applicationType,
        tenantID,
        apiName,
        jobRequestBody,
      },
    };

    if (scheduleType === "Once") {
      if (!startAt) {
        alert("Start time is required for one-time schedule.");
        return;
      }
      jobData = {
        ...jobData,
        timeZone,
        startAt: formatWithSeconds(startAt),
      };
    } else if (scheduleType === "Recurring") {
      if (!startAt || !endAt || !frequencyInMinutes) {
        alert(
          "Start time, end time and frequency are required for Recurring schedule."
        );
        return;
      }
      jobData = {
        ...jobData,
        timeZone,
        startAt: formatWithSeconds(startAt),
        endAt: formatWithSeconds(endAt),
        frequencyInMinutes: parseInt(frequencyInMinutes, 10),
      };
    } else if (scheduleType === "Immediate") {
      jobData = {
        ...jobData,
        runNow: true,
        timeZone,
      };
    }

    let parsedJson = {};
    if (jobRequestBody.trim()) {
      try {
        parsedJson = JSON.parse(jobRequestBody);
      } catch (error) {
         console.error("Failed to fetch application Names:", error);
        alert("❌ Invalid JSON in Job Request Body (Json) Data field.");
        return;
      }
    }

    // Add parsed JSON to jobData
    jobData.applicationData.jobRequestBody = parsedJson;

    try {
      // const user = 'grcuser';
      // const pass = 'crave@123';
      const token =  btoa(`${user}:${pass}`);
      const response = await axios.post(
        `${apiUrl}/jobschedular/schedule`,
        jobData,
        {
          headers: {
            Authorization: `Basic ${token}`,
          },
        }
      );

      if (response.data === "success") {
        alert("✅ Job submitted successfully!");
        //  fetchJobData();
      } else {
        alert("❌  Job submit failed ! " + response.data);
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("❌ Failed to submit job. Job Name must be unique , for existing Scheduled Job Name check Job Detail.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Job Details Section */}
          <div style={{ flex: 1 }}>
            <h2>🛠️ Job Details</h2>
            <label style={{ gap: "10px" }}>
              Schedule Type:
              <select
                value={scheduleType}
                onChange={(e) => setScheduleType(e.target.value)}
              >
                <option value="Once">Once</option>
                <option value="Immediate">Immediate</option>
                <option value="Recurring">Recurring</option>
              </select>
            </label>

            <label>
              Job Name:
              <input
                type="text"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                required
              />
            </label>

            {(scheduleType === "Immediate" ||
              scheduleType === "Once" ||
              scheduleType === "Recurring") && (
              <label>
                Time Zone:
                <input
                  type="text"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                />
              </label>
            )}

            {(scheduleType === "Once" || scheduleType === "Recurring") && (
              <label>
                Start At:
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  required
                />
              </label>
            )}

            {scheduleType === "Recurring" && (
              <>
                <label>
                  End At:
                  <input
                    type="datetime-local"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Frequency (in minutes):
                  <input
                    type="number"
                    value={frequencyInMinutes}
                    onChange={(e) => setFrequencyInMinutes(e.target.value)}
                    required
                  />
                </label>
              </>
            )}
          </div>

          {/* Application Details Section */}
          <div style={{ flex: 1 }}>
            <h2>📦 Application Details</h2>
            <label style={{ gap: "10px" }}>
              Application Name :
              <select
                value={applicationName}
                onChange={(e) => {
                  const selectedName = e.target.value;
                  setApplicationName(selectedName);

                  // Auto-populate ApplicationType
                  const selectedApp = applicationList.find(
                    (app) => app.ApplicationName === selectedName
                  );
                  if (selectedApp) {
                    setApplicationType(selectedApp.ApplicationType || "");
                    setTenantID(selectedApp.TenantID || "");
                  } else {
                    setApplicationType("");
                    setTenantID("");
                  }
                }}
                // required
              >
                <option value="">-- Select Application Name --</option>
                {applicationList.map((app) => (
                  <option key={app.ApplicationName} value={app.ApplicationName}>
                    {app.ApplicationName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              ApplicationType:
              <input type="text" value={applicationType} readOnly />
            </label>
            <label>
              Tenant:
              <input type="text" value={tenantID} readOnly />
            </label>

            <label>
              Job Request Body (Optional):
              <textarea
                value={jobRequestBody}
                onChange={(e) => setJobRequestBody(e.target.value)}
                placeholder='{"Key": "Value"}'
                rows={4}
                style={{ width: "100%" }}
              />
            </label>

            <label style={{ gap: "10px" }}>
              Api Name:
              <select
                value={apiName}
                onChange={(e) => setApiName(e.target.value)}
                required
              >
                <option value="">-- Select api --</option>
                {apiNames.map((api, index) => (
                  <option key={index} value={api}>
                    {api}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <button type="submit" style={{ marginTop: "20px" }}>
          Schedule Job
        </button>
      </form>
    </div>
  );
};

export default JobAndApplicationDetailForm;