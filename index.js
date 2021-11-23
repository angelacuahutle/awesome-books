const form = document.querySelector("form");
const booksList = document.querySelector(".books");
const title = document.querySelector(".title");
const author = document.querySelector(".author");

class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
    this.id;
  }

  static books = [];

  static getDataFromLocalStorage() {
    if (!window.localStorage.getItem("booksData")) return;
    const data = JSON.parse(window.localStorage.getItem("booksData"));
    data.myBooks = data.myBooks.map((b) => {
      const book = new Book(b.title, b.author);
      book.id = b.id;
      return book;
    });
    Book.books = data.myBooks;
    return data;
  }

  static setDataInLocalStorage(data) {
    window.localStorage.setItem("booksData", JSON.stringify(data));
  }

  static renderUI() {
    const books = Book.getDataFromLocalStorage();
    booksList.innerHTML = "";
    Book.books.forEach((book) => {
      const bookItem = document.createElement("li");
      bookItem.innerHTML = `
      <p>Title: ${book.title}</p>
      <p>Author: ${book.author}</p>
      <button class="remove-btn" id="${book.id}">Remove</button>`;
      booksList.appendChild(bookItem);
    });

    const removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const bookId = e.target.id;
        books.myBooks = books.myBooks.filter((book) => book.id !== parseInt(bookId));
        Book.setDataInLocalStorage(books);
        Book.renderUI();
      });
    });
  }

  addBook() {
    const books = Book.getDataFromLocalStorage();
    this.id = books.bookCount + 1;
    books.myBooks.push(this);
    books.bookCount += 1;
    Book.setDataInLocalStorage(books);
    Book.renderUI();
    title.value = "";
    author.value = "";
  }

  removeBook(id = this.id) {
    const books = Book.getDataFromLocalStorage();
    books.myBooks = books.myBooks.filter((book) => book.id !== id);
    Book.setDataInLocalStorage(books);
    Book.renderUI();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newBook = new Book(title.value, author.value);
  newBook.addBook();
});

const booksData = Book.getDataFromLocalStorage();
if (!booksData) {
  const dataToBeStored = {
    myBooks: [],
    bookCount: 0,
  };
  Book.setDataInLocalStorage(dataToBeStored);
} else {
  Book.books = booksData;
  Book.renderUI();
}
