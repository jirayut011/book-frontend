import React, { useState, useEffect } from "react";
import axios from "axios";

const uri = "https://fictional-space-tribble-975w5r79q7xph955q-5001.app.github.dev/";

const checkPassword = async () => {
  const password = prompt("Please enter your password:");
  if (password) {
    try {
      const response = await axios.post(`${uri}/check-password`, { password });
      return response.data.isValid;
    } catch (error) {
      console.error("Error checking password:", error);
      return false;
    }
  }
  return false;
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: "", author: "", image_url: "" });
  const [editBook, setEditBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${uri}/books`);
      setBooks(response.data.books);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editBook) {
      setEditBook((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewBook((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateInputs = (book) => {
    if (!book.title || !book.author) {
      alert("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleCreateBook = async () => {
    if (!validateInputs(newBook)) return;

    if (!(await checkPassword())) return;
    try {
      const response = await axios.post(`${uri}/books`, newBook);
      setBooks((prev) => [...prev, response.data]);
      setNewBook({ title: "", author: "", image_url: "" });
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const handleEditBook = (book) => {
    setEditBook({ ...book });
  };

  const handleUpdateBook = async () => {
    if (!validateInputs(editBook)) return;

    if (!(await checkPassword())) return;
    try {
      await axios.put(`${uri}/books/${editBook._id}`, {
        title: editBook.title,
        author: editBook.author,
        image_url: editBook.image_url,
      });
      setBooks((prev) =>
        prev.map((book) => (book._id === editBook._id ? editBook : book))
      );
      setEditBook(null);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!(await checkPassword())) return;

    try {
      await axios.delete(`${uri}/books/${bookId}`);
      setBooks((prev) => prev.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div>
      <h1>Book List</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, i) => (
            <tr key={i + 1}>
              <td>{i + 1}</td>
              <td>
                <img src={book.image_url} alt={book.title} width="100" />
              </td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>
                <button onClick={() => handleEditBook(book)}>Edit</button>
                <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{editBook ? "Edit Book" : "Add New Book"}</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={editBook ? editBook.title : newBook.title}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={editBook ? editBook.author : newBook.author}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="image_url"
        placeholder="Image URL"
        value={editBook ? editBook.image_url : newBook.image_url}
        onChange={handleInputChange}
      />
      <button onClick={editBook ? handleUpdateBook : handleCreateBook}>
        {editBook ? "Update" : "Create"}
      </button>
    </div>
  );
};

export default App;