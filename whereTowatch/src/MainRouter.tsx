import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import App from "./App";
import CreateAdmin from "./components/CreateAdmin";

const MainRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" Component={Login} />
        <Route path="/" Component={App} />
        <Route path="/create" Component={CreateAdmin} />
      </Routes>
    </Router>
  );
};

export default MainRouter;
