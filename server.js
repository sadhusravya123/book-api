
const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

let library = [
  { id: 101, title: 'Atomic Habits', author: 'James Clear', price: 499 },
  { id: 102, title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 399 },
  { id: 103, title: 'Ikigai', author: 'Hector Garcia', price: 299 }
];

let nextId = 104;

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Library Management API');
});

// Retrieve all books
app.get('/books', (req, res) => {
  res.status(200).json({
    total: library.length,
    books: library
  });
});

// Retrieve a book by ID
app.get('/books/:id', (req, res) => {
  const bookId = Number(req.params.id);
  const result = library.find(item => item.id === bookId);

  if (!result) {
    return res.status(404).json({ error: 'No matching book found' });
  }

  res.json(result);
});

// Add a new book
app.post('/books', (req, res) => {
  const { title, author, price } = req.body;

  if (
    typeof title !== 'string' || !title.trim() ||
    typeof author !== 'string' || !author.trim() ||
    typeof price !== 'number' || price <= 0
  ) {
    return res.status(400).json({
      error: 'Enter a valid title, author and positive numeric price'
    });
  }

  const addedBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    price
  };

  library.push(addedBook);

  res.status(201).json({
    message: 'New book created',
    data: addedBook
  });
});

// Update a book
app.put('/books/:id', (req, res) => {
  const bookId = Number(req.params.id);
  const book = library.find(item => item.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book does not exist' });
  }

  const { title, author, price } = req.body;

  if (
    (title !== undefined && (typeof title !== 'string' || !title.trim())) ||
    (author !== undefined && (typeof author !== 'string' || !author.trim())) ||
    (price !== undefined && (typeof price !== 'number' || price <= 0))
  ) {
    return res.status(400).json({ error: 'Invalid update details' });
  }

  if (title !== undefined) book.title = title.trim();
  if (author !== undefined) book.author = author.trim();
  if (price !== undefined) book.price = price;

  res.json({
    message: 'Book details modified',
    updatedBook: book
  });
});

// Remove a book
app.delete('/books/:id', (req, res) => {
  const bookId = Number(req.params.id);
  const position = library.findIndex(item => item.id === bookId);

  if (position === -1) {
    return res.status(404).json({ error: 'Book does not exist' });
  }

  const removedBook = library.splice(position, 1)[0];

  res.json({
    message: 'Book removed from library',
    deletedBook: removedBook
  });
});

app.listen(PORT, () => {
  console.log(`Library API started at http://localhost:${PORT}`);
});