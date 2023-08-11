import React, { useEffect } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';

const Popup = () => {
  const [isContentstackSite, setIsContentstackSite] = React.useState(false);
  const [contentType, setContentType] = React.useState('');
  const [entryUid, setEntryUid] = React.useState('');

  const [data, setData] = React.useState(null);

  const fetchEntry = async () => {
    try {
      const response = await fetch(
        // 'https://alpha-nodeappapi.golfbreaks.com/api/Online/OnlineContent/'
        `http://localhost:9000/api/Automation/GenerateInterfaces/?uid=${entryUid}&contentType=${contentType}`
      );

      if (!response.ok) {
        alert(`HTTP status ${response.status}`);
        throw new Error(`HTTP status ${response.status}`);
      } else {
        // Use response.json() to parse the JSON data
        const data = await response.json();
        alert(JSON.stringify(data)); // Convert data to string for alert
        setData(data); // Assuming you have a state variable named `data`
        setData(data); // Assuming you have a state variable named `data`
      }
    } catch (error) {
      alert(`Error fetching entry! ${error}`);
    }
  };

  useEffect(() => {
    checkCSContentType();
  }, []);

  const checkCSContentType = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs && tabs.length > 0) {
        const tabUrl = tabs[0].url;

        if (tabUrl.includes('contentstack')) {
          setIsContentstackSite(true);
        } else {
          setIsContentstackSite(false);
        }

        // Extract content type using regular expression
        const contentTypeMatch = tabUrl.match(/\/content-type\/([^/]+)\/?/);

        const contentType = contentTypeMatch ? contentTypeMatch[1] : null;
        setContentType(contentType);
        // alert(`Content Type:' ${contentType}`);

        // Extract entry UID using regular expression
        const entryUidMatch = tabUrl.match(/\/entry\/([^/]+)\/?/);
        const entryUid = entryUidMatch ? entryUidMatch[1] : null;
        setEntryUid(entryUid);
        // alert(`Entry UID: ${entryUid}`);
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>ContentStack Interface Generator</h3>
        <img src={logo} className="App-logo" alt="logo" />

        {/* <button onClick={checkCSContentType}>Check if CS site</button> */}
        {isContentstackSite ? (
          <>
            <div style={{ marginTop: 16 }}>
              <b>Content Type: </b> <span>{contentType}</span>
            </div>
            <div style={{ marginTop: 4 }}>
              <b>Entry UID: </b> <span>{entryUid}</span>
            </div>
          </>
        ) : (
          <div style={{ marginTop: 16 }}>
            <b>Not a Contentstack site</b>
          </div>
        )}

        {isContentstackSite && contentType && entryUid && (
          <button style={{ marginTop: 16 }} onClick={fetchEntry}>
            Generate Typescript Interface
          </button>
        )}
        {/* <div>{JSON.stringify(data)}</div> */}
      </header>
    </div>
  );
};

export default Popup;
