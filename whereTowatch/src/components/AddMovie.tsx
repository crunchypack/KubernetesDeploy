import React, { useEffect, useState } from "react";
import { IMovie } from "./Interfaces";
import Button from "./Button";
import { Modal, Form } from "react-bootstrap";
import DynamicField from "./DynamicField";

interface Props {
  addMovie: (movie: IMovie) => void;
  toggleShow: () => void;
  show: boolean;
}
function AddMovie({ addMovie, toggleShow, show }: Props) {
  const [showModal, setShowModal] = useState(show);
  const [movie, setMovie] = useState<IMovie>({
    title: "",
    genre: [],
    starring: [],
    available: [],
    director: [],
    year: 0,
    length: 0,
    url: "",
    desc: "",
  });
  const clearFields = () => {
    // Clear the form fields
    setMovie({
      title: "",
      genre: [],
      starring: [],
      available: [],
      director: [],
      year: 0,
      length: 0,
      url: "",
      desc: "",
    });
    toggleShow();
  };
  const handleAdd = (e: any) => {
    e.preventDefault();
    // Call the addMovie function to add the movie
    addMovie(movie);

    clearFields();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  return (
    <>
      <Button color="primary" onClick={toggleShow}>
        Add Movie
      </Button>
      <Modal
        show={show}
        onHide={clearFields}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdd}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                required
                type="text"
                name="title"
                value={movie.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text-area"
                name="desc"
                value={movie.desc}
                onChange={handleChange}
              />
            </Form.Group>
            <DynamicField
              items={movie.genre}
              onChange={(newItems) => setMovie({ ...movie, genre: newItems })}
              label="Genre"
            />
            <DynamicField
              items={movie.starring}
              onChange={(newItems) =>
                setMovie({ ...movie, starring: newItems })
              }
              label="Actor"
            />
            <DynamicField
              items={movie.available}
              onChange={(newItems) =>
                setMovie({ ...movie, available: newItems })
              }
              label="Streaming service"
            />
            <DynamicField
              items={movie.director}
              onChange={(newItems) =>
                setMovie({ ...movie, director: newItems })
              }
              label="Director"
            />
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Control
                required
                type="number"
                name="year"
                value={movie.year}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>length</Form.Label>
              <Form.Control
                type="number"
                name="length"
                value={movie.length}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>IMDB Url</Form.Label>
              <Form.Control
                type="text"
                name="url"
                value={movie.url}
                onChange={handleChange}
              />
            </Form.Group>
            <Button color="secondary" onClick={clearFields}>
              Clear and close
            </Button>
            <button className=" btn btn-primary" type="submit">
              Save Changes
            </button>
          </Form>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}

export default AddMovie;
