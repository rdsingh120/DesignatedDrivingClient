import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { submitRating } from "../features/ratings/ratingsSlice";
import StarRating from "../components/StarRating";

export default function RateTripPage() {

  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    await dispatch(
      submitRating({
        tripId,
        stars,
        comment
      })
    );

    navigate("/rider/trips");
  };

  return (
    <div style={{ padding: 30 }}>

      <h2>Rate your trip</h2>

      <StarRating value={stars} onChange={setStars} />

      <textarea
        placeholder="Leave a comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          width: "100%",
          marginTop: 15,
          padding: 10,
          minHeight: 100
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 20,
          padding: "10px 20px"
        }}
      >
        Submit Rating
      </button>

    </div>
  );
}