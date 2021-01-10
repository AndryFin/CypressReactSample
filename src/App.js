import React, {useState, useEffect } from "react";
import "./App.scss";

function App() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const submit = () => {
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
      <div className="container">
        <div className="counter">
          <div 
		    className="btn"
            data-testid="decrement"
            onClick={() => setCount((count) => count - 1)}
		  >
		    -
		  </div>
		  {loading ? <span>wait..</span> : <span>{count}</span>}
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
    </div>
  );
}

export default App;
