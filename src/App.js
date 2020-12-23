import './App.css';
import React from "react";

// endpoints url
const BASE_ENDPOINT = "https://us-central1-phone-access-code.cloudfunctions.net/app";
const GET_ACCESS_CODE_ENDPOINT = "/getAccessCode";
const VERIFY_ACCESS_ENDPOINT = "/verifyAccessCode";

function App(props) {
  // states
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [accessCode, setAccessCode] = React.useState('');
  const [isVerified, setIsVerified] = React.useState(props.isVerified);

  // action handler functions
  // updating state based on the change of phone number input
  // button only enable when the length is reasonable (10) and only contains digits
  const onChangePhoneNumber = event => {
    setPhoneNumber(event.target.value);
    let isnum = /^\d+$/.test(event.target.value);
    if (event.target.value.length === 10 && isnum) {
      document.getElementById("submit_phone_number_btn").disabled = false;
    } else {
      document.getElementById("submit_phone_number_btn").disabled = true;
      document.getElementById("submit_access_code_btn").disabled = true;
    }
  };
  // updating state based on the change of access code input
  // button only enable when the length is reasonable (6) and only contains digits
  const onChangeAccessCode = event => {
    setAccessCode(event.target.value);
    let isnum = /^\d+$/.test(event.target.value);
    if (event.target.value.length === 6 && isnum) {
      document.getElementById("submit_access_code_btn").disabled = false;
    } else {
      document.getElementById("submit_access_code_btn").disabled = true;
    }
  };
  const onClickReturn = event => {
    setIsVerified(!isVerified);
  };
  // handle api calling
  const getAccessCode = event => {
    event.preventDefault();

    const formatedPhoneNumber = "+1" + phoneNumber;
    const reqJSON = {"phoneNumber": formatedPhoneNumber};
    fetch(BASE_ENDPOINT + GET_ACCESS_CODE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqJSON)})
      .then(response => response.text())
      .then(result => document.getElementById("message").textContent = result)
      .catch(err => {
        console.error(err.message);
      });
  }

  const verifyAccess = event => {
    event.preventDefault();

    const formatedPhoneNumber = "+1" + phoneNumber;
    const reqJSON = {"phoneNumber": formatedPhoneNumber, "accessCode": accessCode};
    fetch(BASE_ENDPOINT + VERIFY_ACCESS_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reqJSON)})
      .then(response => response.json())
      .then(result => {
        const isSuccess = result['isSuccess'];
        if (isSuccess) { // valid access code
          setIsVerified(isSuccess);
        } else { // invalid access code
          document.getElementById("message").textContent = "Invalid access code";
        }
      })
      .catch(err => {
        console.error(err.message);
      });
      document.getElementById("message").textContent = "Verifying ...";
  }

  // if is not verified, show 2 input fields
  if (!isVerified) {
    return (
      <div className="container">
        <div className="card-panel">
          <form onSubmit={getAccessCode} className="mt-3">
            <div className="row">
                <label htmlFor="phone_number_input">Please enter your phone number: </label>
                <div className="input-field col s12">
                  <input id="phone_number_input" type="text" onChange={onChangePhoneNumber} placeholder="10 digits"/>
                  <button id="submit_phone_number_btn" type="submit" className="btn btn-primary col s12 m-1" disabled={true}>Send access code</button>
                </div>
            </div>
            
          </form>
          <form onSubmit={verifyAccess} className="mt-3">
            <div className="row">
              <label htmlFor="access_code_input">Access code: </label>
              <div className="input-field col s12">
                <input id="access_code_input" type="text" onChange={onChangeAccessCode} placeholder="6 digits"/>
                <button id="submit_access_code_btn" type="submit" className="btn btn-primary col s12 m-1" disabled={true}>Verfiy</button>
              </div>
            </div>
          </form>
          <div id="message" className="center-align">
          </div>
        </div>
      </div>
      
    );
  } else {
    return (
      <div className="App">
        <div>Verified</div>
        <button type="submit" onClick={onClickReturn}>Return</button>
      </div>
    );
  }
  
}

export default App;
