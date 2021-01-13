import React, {useState, useEffect } from "react";
import "./App.scss";
import LoadingOverlay from 'react-loading-overlay';

function App() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const submit = () => {
	setSuccess();
	setError();
    fetch("http://localhost:3002/count", {
      method: "POST",
      body: JSON.stringify(count),
    }).then(
	res => res.status === 200 ? setSuccess((success) => true) : setError((error) => true)
	)
  };
  async function getData() {
	 const  response = await fetch("http://localhost:3002/getCount", {
	   method: "GET",
	   });
	 const result = await response;
	 result.status === 200 ? result.json().then((json) => setCount((count) => json.data)) : setCount((count) => 0)
	 setLoading((loading) => false);
  };
  useEffect(() => {
      getData()
	},[]);
  return (
  <div className="app" data-testid="app">
	  <LoadingOverlay 
	  active={loading}
	  spinner
	  text='Getting the initial count...'
	  >
		  <div className="container">
			<div className="counter">
			  <div 
				className="btn"
				data-testid="decrement"
				onClick={() => setCount((count) => count - 1)}
			  >
				-
			  </div>
			  <span>{count}</span>
			  <div
				className="btn"
				data-testid="increment"
				onClick={() => setCount((count) => count + 1)}
			  >
				+
			  </div>
			</div>
			<button type="submit" disabled={count < -10 || count > 20 ? true : false} onClick={submit}>
			  click me
			</button>
			{error && (
			  <span className="error">
				There was an error submitted your count!
			  </span>
			)}
			{success && <span className="success">Count submitted</span>}
		  </div>
	  </LoadingOverlay>
    </div>
  );
}

export default App;
