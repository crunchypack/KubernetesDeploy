import React from "react";
import { Form } from "react-bootstrap";

interface DynamicFieldProps {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
}

const DynamicField: React.FC<DynamicFieldProps> = ({
  items,
  onChange,
  label,
}) => {
  const handleAdd = (e: any) => {
    e.preventDefault();
    onChange([...items, ""]);
  };

  const handleChange = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    onChange(updatedItems);
  };

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      {items.map((item, index) => (
        <div key={index}>
          <Form.Control
            type="text"
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        </div>
      ))}
      <button className="btn btn-primary" onClick={handleAdd}>
        Add {label}
      </button>
    </Form.Group>
  );
};

export default DynamicField;
