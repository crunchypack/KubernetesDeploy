import { useEffect, useState } from "react";
import ListGroup from "./ListGroup";
import { IPoster } from "./Interfaces";

interface Props {
  title: string;
  genre: string[];
  starring: string[];
  available: string[];
  director: string[];
  year: number;
  length: number;
  url: string;
  desc: string;
}

export default function Movie(props: Props) {
  const [poster, setPoster] = useState<IPoster | undefined>(undefined);
  useEffect(() => {
    fetchImageUrl(props.title, props.year);
  }, [props.title, props.year]);
  const fetchImageUrl = (title: string, year: number) => {
    fetch("https://omdbapi.com/?t=" + title + "&apikey=b95aa511&y=" + year)
      .then((res) => res.json())
      .then((data) => setPoster(data));
  };
  return (
    <div className="col">
      <div className="card">
        <img
          src={poster?.Poster}
          className="card-img-top"
          style={{ width: "95%" }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {props.title} ({props.year})
          </h5>
          <p className="card-text">{props.desc}</p>
          <ListGroup items={props.genre} heading=""></ListGroup>
          <ListGroup items={props.starring} heading="Cast"></ListGroup>
          <ListGroup items={props.available} heading="Watch on"></ListGroup>

          <ListGroup items={props.director} heading="Directed by"></ListGroup>
          <p>Runtime: {props.length} minutes</p>
          <p>
            <a
              className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
              href={props.url}
              target="_blank"
            >
              IMDB
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
