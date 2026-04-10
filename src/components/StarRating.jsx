import { useState } from "react";

export default function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[1,2,3,4,5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: 28,
            cursor: "pointer",
            color: star <= (hover || value) ? "#f5b50a" : "#ccc"
          }}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
        >
          ★
        </span>
      ))}
    </div>
  );
}