import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants/url";
import { toast } from "react-toastify";
import Modal from "react-modal";

const BookScreen = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState(books);
  const [authors, setAuthors] = useState([]);
  const [geners, setGeneres] = useState([]);
  const [selectedAuthor, setSelectedAuthors] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [modalIsOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
  });

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "400px",
    },
  };

  const fetchBooks = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/books`);
      setBooks(data.books);
      setFilteredBooks(data.books);
      const author = [...new Set(data.books.map((book) => book.author))];
      const genere = [...new Set(data.books.map((book) => book.genre))];
      setAuthors(author);
      setGeneres(genere);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch books");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(lowerSearch) ||
          book.author.toLowerCase().includes(lowerSearch)
      );
    }
    if (selectedAuthor) {
      filtered = filtered.filter((book) => book.author === selectedAuthor);
    }

    if (selectedGenre) {
      filtered = filtered.filter((book) => book.genre === selectedGenre);
    }
    setFilteredBooks(filtered);
  }, [search, selectedAuthor, selectedGenre, books]);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(`${BASE_URL}/books`, formData, config);
      setIsOpen(false);
      fetchBooks();
      setFormData({ title: "", author: "", genre: "", description: "" });
      toast.success(data.message);
      closeModal();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="p-6 max-w-5xl mx-auto bg-white rounded-md">
        <h1 className="font-bold text-2xl mb-2">All Books</h1>
        <input
          placeholder="search by title or author"
          className="border px-4 py-2 rounded w-full mb-4"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
        />
        <div className="flex gap-10 justify-end mb-4">
          <div className="">
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthors(e.target.value)}
              className="px-4 py-2 border rounded-md shadow"
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 border rounded-md shadow"
            >
              <option value="">All Generes</option>
              {geners.map((gener) => (
                <option key={gener} value={gener}>
                  {gener}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-blue-900 rounded-md py-2 px-4 text-white hover:bg-blue-700 cursor-pointer "
            onClick={() => setIsOpen(true)}
          >
            Create Book
          </button>
        </div>
        {books.length === 0 ? (
          <p>No Books Found.</p>
        ) : (
          <ul>
            {filteredBooks.map((book) => (
              <a href={`/book/${book._id}`}>
                <li key={book._id} className="p-4  shadow-lg rounded mb-4">
                  <h2 className="text-lg font-semibold">{book.title}</h2>
                  <p>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p>
                    <strong>Genre:</strong> {book.genre}
                  </p>
                  <p>{book.description}</p>
                </li>
              </a>
            ))}
          </ul>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="text-white float-right px-4 rounded-md py-2 mb-2 bg-red-500"
        >
          Close
        </button>

        <form onSubmit={submitHandler}>
          <input
            className="w-full border px-4 py-2 rounded-sm mb-4 mt-4"
            placeholder="Enter book title"
            type="text"
            name="title"
            onChange={changeHandler}
            value={formData.title}
          />
          <input
            className="w-full border px-4 py-2 rounded-sm mb-4 mt-4"
            placeholder="Enter genre"
            type="text"
            name="genre"
            onChange={changeHandler}
            value={formData.genre}
          />
          <input
            className="w-full border px-4 py-2 rounded-sm mb-4 mt-4"
            placeholder="Enter author name"
            type="text"
            onChange={changeHandler}
            name="author"
            value={formData.author}
          />
          <textarea
            className="w-full border px-4 py-2 rounded-sm mb-4 mt-4"
            placeholder="Enter book description"
            type="text"
            name="description"
            onChange={changeHandler}
            value={formData.description}
          />

          <button
            className="mb-4  w-full bg-blue-900 rounded-md py-2 text-white hover:bg-blue-700 cursor-pointer "
            type="submit"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BookScreen;
