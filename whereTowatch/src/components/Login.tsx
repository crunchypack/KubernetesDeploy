import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

interface LoginState {
  email: string;
  password: string;
}

const Login = () => {
  const [state, setState] = useState<LoginState>({
    email: "",
    password: "",
  });
  const [error, setErrors] = useState("");
  const navigate = useNavigate();
  const checkLoggedIn = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/logged", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "true") {
        // User is logged in
        navigate("/");
      } else if (data.status === "false") {
        // do nothing
      } else {
        // Error occurred
        console.error("Error checking login status");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    const { email, password } = state;
    console.log({ email, password });

    fetch("http://localhost:8081/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
      .then((response) => {
        if (response.status == 200) navigate("/");
        else if (response.status == 401) setErrors("Wrong email/password!");
      })
      .catch((error) => {
        // Handle any fetch errors here
        console.error(error);
      });
  };
  const handleCreate = () => {
    navigate("/create");
  };
  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            onChange={(e) => setState({ ...state, email: e.target.value })}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setState({ ...state, password: e.target.value })}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <div className="p-2">
        <Button color="secondary" onClick={handleCreate}>
          Create user
        </Button>
      </div>
      <div className="text-danger">{error}</div>
    </div>
  );
};

export default Login;
