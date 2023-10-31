import React, { useState } from "react";
interface Props {
  onSearch: (search: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const [input, setInput] = useState("");
  const handleSearch = (e: any) => {
    e.preventDefault();
    onSearch(input);
  };
  return (
    <form onSubmit={handleSearch}>
      <div className="input-group">
        <span className="input-group-text" id="addon-wrapping">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          aria-label="search"
          aria-describedby="addon-wrapping"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></input>
      </div>
    </form>
  );
}
