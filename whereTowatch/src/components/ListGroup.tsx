import { useState } from "react";

interface Props {
  items: string[];
  heading: string;
  // onSelectItem: (item: string) => void;
}

function ListGroup({ items, heading }: Props) {
  //const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <>
      <h5>{heading}</h5>
      {items.length === 0 && <p>No item found</p>}
      <ul className="list-group list-group-flush">
        {items.map((item, index) => (
          <li
            className={
              // selectedIndex === index
              //   ? "list-group-item active"
              //   :
              "list-group-item"
            }
            key={index}
            // onClick={() => {
            //   setSelectedIndex(index);
            //   onSelectItem(item);
            // }}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}
export default ListGroup;
