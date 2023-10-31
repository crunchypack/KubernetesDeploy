import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
interface CreateAdmin {
  email: string;
  pass: string;
  confirm: string;
}
export default function CreateAdmin() {
  const [state, setState] = useState<CreateAdmin>({
    email: "",
    pass: "",
    confirm: "NOTHING",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const handleCreate = (e: any) => {
    e.preventDefault();
    if (validate()) {
      setErrors("");
      const { email, pass } = state;
      fetch("http://localhost:8081/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass }),
        credentials: "include",
      })
        .then((res) => {
          if (res.status != 500) navigate("/login");
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };
  const validate = () => {
    if (state.pass != state.confirm) setErrors("Passwords must match!");
    else return true;
  };
  return (
    <div className="container">
      <h1>Create user</h1>
      <form onSubmit={handleCreate}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            required
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
            required
            onChange={(e) => setState({ ...state, pass: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Repeat password</label>
          <input
            type="password"
            className="form-control"
            required
            onChange={(e) => setState({ ...state, confirm: e.target.value })}
          />
        </div>
        <div className="text-danger">{errors}</div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}
