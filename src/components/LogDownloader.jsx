import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LogDownloder.css';

const LogDownloader = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolder, setExpandedFolder] = useState(null);
  const [folderFiles, setFolderFiles] = useState({});
  const apiUrl = window._env_.API_BASE_URL;
  const user = import.meta.env.VITE_SCHEDULAR_API_USER || "grcuser";
  const pass = import.meta.env.VITE_SCHEDULAR_API_PWD || "crave@123";
    const token = btoa(`${user}:${pass}`);
  const authHeader = { Authorization: `Basic ${token}` };
  const getFolders = async () => {
    try {
      const token = btoa(`${user}:${pass}`);
      const response = await axios.get(`${apiUrl}/jobschedular/logs/folders`, {
        headers: {
          'Authorization': `Basic ${token}`
        }
      });
      setFolders(response.data);
    } catch (error) {
      console.error('❌ Fetch error:', error);
    }
  };

  useEffect(() => {
    console.log('Fetching folders using URL:', `${apiUrl}/jobschedular/logs/folders`);
    getFolders();
  }, []);
  const handleFolderToggle = async (folder) => {
    if (expandedFolder === folder) {
      setExpandedFolder(null); // collapse
    } else {
      setExpandedFolder(folder);
      if (!folderFiles[folder]) {
        try {
          const res = await axios.get(`${apiUrl}/jobschedular/logs/files/${folder}`, {
            headers: authHeader,
          });
          setFolderFiles((prev) => ({ ...prev, [folder]: res.data }));
        } catch (err) {
          console.error('❌ Error fetching files:', err);
        }
      }
    }
  };

  const downloadFile = async (folder, file) => {
    try {
      const res = await axios.get(`${apiUrl}/jobschedular/logs/download/${folder}/${file}`, {
        headers: authHeader,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('❌ File download error:', err);
    }
  };
  const handleFolderDownload = async (folder) => {
    const token = btoa(`${user}:${pass}`);
    const downloadUrl = `${apiUrl}/jobschedular/logs/zip/${folder}`;

    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download folder zip");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${folder}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading folder zip:", error);
      alert("Folder download failed.");
    }
  };

  const handleAllDownload = async () => {
    const token = btoa(`${user}:${pass}`);
    const downloadUrl = `${apiUrl}/jobschedular/logs/zip-all`;

    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Authorization: `Basic ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download all logs zip");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `all-logs.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading all logs zip:", error);
      alert("Download all logs failed.");
    }
  };
  return (
    <div className="log-container">
      <h2 className="log-title">Access Hub Applications Log</h2>

      <table className="log-table">
        <thead>
          <tr>
            <th className="log-table-header-left">Application</th>
            <th className="log-table-header-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {folders.map((folder) => (
            <React.Fragment key={folder}>
              <tr className="log-folder-row">
                <td className="log-folder-cell clickable" onClick={() => handleFolderToggle(folder)}>
                  {expandedFolder === folder ? '▼' : '▶'} {folder}
                </td>
                <td className="log-action-cell">
                  <button className="log-button-purple" onClick={() => handleFolderDownload(folder)}>
                    Download ZIP
                  </button>
                </td>
              </tr>

              {expandedFolder === folder && folderFiles[folder] && (
                <tr>
                  <td colSpan={2}>
                    <ul className="log-file-list">
                      {folderFiles[folder].map((file) => (
                        <li key={file} className="log-file-item">
                          <span>{file}</span>
                          <button
                            className="log-button-small"
                            onClick={() => downloadFile(folder, file)}
                          >
                            Download
                          </button>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="log-download-all-wrapper">
        <button className="log-download-all" onClick={handleAllDownload}>
          Download All Logs as ZIP
        </button>
      </div>
    </div>
  );
};

export default LogDownloader;
