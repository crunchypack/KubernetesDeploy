import { useEffect, useState } from "react";
import "./App.css";
import Movie from "./components/Movie";
import SearchBar from "./components/SearchBar";
import { IMovie } from "./components/Interfaces";
import Button from "./components/Button";
import { useNavigate } from "react-router-dom";
import AddMovie from "./components/AddMovie";
import Alert from "react-bootstrap/Alert";

function App() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [logged, setLogged] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const fetchItems = () => {
    fetch("http://localhost:8081/api/year/-1")
      .then((res) => res.json())
      .then((data: IMovie[]) => setMovies(data));
  };
  const searchData = (search: string) => {
    let searchString =
      search.length > 0
        ? "http://localhost:8081/api/" + search + "/title/1"
        : "http://localhost:8081/api/year/-1";
    fetch(searchString)
      .then((res) => res.json())
      .then((data) => setMovies(data));
  };
  const checkLoggedIn = async () => {
    try {
      const response = await fetch("http://localhost:8081/api/logged", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.status === "true") {
        // User is logged in
        setLogged(true);
      } else if (data.status === "false") {
        //do nothing
      } else {
        //do nothing
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };
  const handleLogOut = () => {
    setLogged(false);
    fetch("http://localhost:8081/api/logout", {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json);
  };
  const handleLogIn = () => {
    navigate("/login");
  };
  const handleCreate = () => {
    navigate("/create");
  };
  const toggleShow = () => {
    setShow(!show);
  };
  const addMovie = (movie: IMovie) => {
    fetch("http://localhost:8081/api", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movie),
    }).then((res) => {
      if (res.status == 200) searchData("");
    });
  };

  useEffect(() => {
    checkLoggedIn();
    fetchItems();
  }, []);

  return (
    <div className="container">
      {logged && (
        <>
          <Button
            color="danger"
            onClick={handleLogOut}
            children="Logout"
          ></Button>
          <AddMovie
            addMovie={addMovie}
            toggleShow={toggleShow}
            show={show}
          ></AddMovie>
        </>
      )}
      {!logged && (
        <>
          <Button color="success" onClick={handleLogIn}>
            Login
          </Button>
          <Button color="secondary" onClick={handleCreate}>
            Create
          </Button>
        </>
      )}
      <SearchBar onSearch={searchData}></SearchBar>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {movies && movies.length > 0 ? (
          movies.map((movie) => (
            <Movie
              title={movie.title}
              genre={movie.genre}
              starring={movie.starring}
              available={movie.available}
              director={movie.director}
              year={movie.year}
              length={movie.length}
              url={movie.url}
              desc={movie.desc}
            ></Movie>
          ))
        ) : (
          <Alert variant="danger">
            <p>No movies found</p>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default App;
