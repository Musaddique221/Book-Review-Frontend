import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { toast } from "react-toastify";

const SingleBookScreen = () => {
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({ rating: "", comment: "" });
  const [editReviewId, setEditReviewId] = useState(null);
  const [editData, setEditData] = useState({ rating: "", comment: "" });

  console.log(reviews, "14");

  const { id } = useParams();
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const fetchBook = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/books/${id}`);
      setBook(data.singleBook);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/reviews/${id}/reviews`);
      setReviews(data.reviews);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/reviews/${id}/reviews`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review submitted");
      setFormData({ rating: "", comment: "" });
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleEdit = async (reviewId) => {
    try {
      await axios.put(`${BASE_URL}/reviews/${reviewId}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review updated");
      setEditReviewId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`${BASE_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted");
      fetchReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id]);

  return (
    <div className="max-w-3xl mt-20 mx-auto p-4 shadow-md">
      <h1 className="font-bold text-2xl mb-4">Book Details</h1>
      <div className="mb-6">
        <p>
          <span className="font-bold">Title:</span> {book.title}
        </p>
        <p>
          <span className="font-bold">Author:</span> {book.author}
        </p>
        <p>
          <span className="font-bold">Genre:</span> {book.genre}
        </p>
        <p>
          <span className="font-bold">Description:</span> {book.description}
        </p>
      </div>

      <div className="border-t pt-4 mt-6">
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="italic">No reviews yet.</p>
        ) : (
          <ul className="space-y-3">
            {reviews &&
              reviews.map((review) => (
                <li key={review._id} className="border rounded p-3 shadow-sm">
                  <p className="font-medium">{review.user?.name}</p>
                  {editReviewId === review._id ? (
                    <>
                      <select
                        value={editData.rating}
                        onChange={(e) =>
                          setEditData({ ...editData, rating: e.target.value })
                        }
                        className="border p-2 w-full mb-2"
                      >
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r} Star
                          </option>
                        ))}
                      </select>
                      <textarea
                        value={editData.comment}
                        onChange={(e) =>
                          setEditData({ ...editData, comment: e.target.value })
                        }
                        className="border p-2 w-full mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => handleEdit(review._id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                          onClick={() => setEditReviewId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>⭐ {review.rating}</p>
                      <p>{review.comment}</p>
                      <div className="flex gap-3 mt-2">
                        <button
                          className="text-blue-600 font-medium"
                          onClick={() => {
                            setEditReviewId(review._id);
                            setEditData({
                              rating: review.rating,
                              comment: review.comment,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 font-medium"
                          onClick={() => handleDelete(review._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ul>
        )}
      </div>

      <form onSubmit={submitHandler} className="mt-6 border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">Write a Review</h2>
        <select
          name="rating"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
          className="border p-2 w-full mb-3"
          required
        >
          <option value="">Select Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star
            </option>
          ))}
        </select>
        <textarea
          name="comment"
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          placeholder="Write your review"
          className="border p-2 w-full mb-3"
          rows="3"
          required
        />
        <button
          type="submit"
          className="bg-blue-800 text-white px-4 py-2 rounded text-white hover:bg-blue-700 cursor-pointer w-full"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default SingleBookScreen;
