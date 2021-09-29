process.env.NODE_ENV = "test";
const request = require("supertest");
const db = require("../../db");
const Book = require("../../models/book");
const app = require("../../app");

const book = {
    isbn: "0691161518",
    amazon_url: "http://a.co/eobPtX2",
    author: "Matthew Lane",
    language: "english",
    pages: 264,
    publisher: "Princeton University Press",
    title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    year: 2017
};

beforeEach(async () => {
    await db.query(`DELETE FROM books`);
    await Book.create(book);
});

afterAll(async () => {
    await db.end();
});

describe("get", () => {
    test("all", async () => {
        const resp = await request(app).get("/books");
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            books: expect.arrayContaining([
                expect.objectContaining({
                    isbn: book.isbn,
                    amazon_url: book.amazon_url,
                    pages: book.pages,
                    year: book.year
                })
            ])
        }));
    });
    test("one by isbn", async () => {
        const resp = await request(app).get(`/books/${book.isbn}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            book: expect.objectContaining({
                isbn: book.isbn,
                amazon_url: book.amazon_url,
                pages: book.pages,
                year: book.year
            })
        }));
    });
    test("invalid isbn", async () => {
        const resp = await request(app).get(`/books/agkljags`);
        expect(resp.statusCode).toBe(404);
    });
});

describe("post", () => {
    test("new", async () => {
        const data = {
            isbn: "06932656118",
            amazon_url: "http://a.co/aobDtX2",
            author: "Davis Smith",
            language: "english",
            pages: 204,
            publisher: "Penguin Press",
            title: "How to human in 60 simple steps",
            year: 2014
        };
        const resp = await request(app).post("/books").send(data);
        expect(resp.statusCode).toBe(201);
        expect(resp.body).toEqual(expect.objectContaining({
            book: expect.objectContaining({
                isbn: data.isbn,
                amazon_url: data.amazon_url,
                pages: data.pages,
                year: data.year
            })
        }));
    });
    test("invalid data", async () => {
        const data = {
            isbn: "06932656118",
            amazon_url: "http://a.co/aobDtX2",
            author: "Davis Smith",
            language: true,
            pages: "akgjag",
            publisher: "Penguin Press",
            title: 32698,
            year: 2014
        };
        const resp = await request(app).post("/books").send(data);
        expect(resp.statusCode).toBe(400);
    });
    test("missing data", async () => {
        const data = {
            isbn: "06932656118",
            title: "How to human in 60 simple steps",
            year: 2014
        };
        const resp = await request(app).post("/books").send(data);
        expect(resp.statusCode).toBe(400);
    });
    test("no data", async () => {
        const resp = await request(app).post("/books");
        expect(resp.statusCode).toBe(400);
    });
});

describe("put", () => {
    test("update", async () => {
        const data = {
            amazon_url: "http://a.co/aobDtX2",
            author: "Davis Smith",
            language: "english",
            pages: 204,
            publisher: "Penguin Press",
            title: "How to human in 60 simple steps",
            year: 2014
        };
        const resp = await request(app).put(`/books/${book.isbn}`).send(data);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            book: expect.objectContaining({
                isbn: book.isbn,
                amazon_url: data.amazon_url,
                pages: data.pages,
                year: data.year
            })
        }));
    });
    test("invalid isbn", async () => {
        const data = {
            amazon_url: "http://a.co/aobDtX2",
            author: "Davis Smith",
            language: "english",
            pages: 204,
            publisher: "Penguin Press",
            title: "How to human in 60 simple steps",
            year: 2014
        };
        const resp = await request(app).put(`/books/agkljags`).send(data);
        expect(resp.statusCode).toBe(404);
    });
    test("invalid data", async () => {
        const data = {
            amazon_url: "http://a.co/aobDtX2",
            author: "Davis Smith",
            language: null,
            pages: false,
            publisher: "Penguin Press",
            title: 329.32,
            year: "aojg;g"
        };
        const resp = await request(app).put(`/books/${book.isbn}`).send(data);
        expect(resp.statusCode).toBe(400);
    });
    test("missing data", async () => {
        const data = {
            amazon_url: "http://a.co/aobDtX2",
            title: "How to human in 60 simple steps",
            year: 2014
        };
        const resp = await request(app).put(`/books/${book.isbn}`).send(data);
        expect(resp.statusCode).toBe(400);
    });
    test("no data", async () => {
        const resp = await request(app).put(`/books/${book.isbn}`);
        expect(resp.statusCode).toBe(400);
    });
});

describe("delete", () => {
    test("one by isbn", async () => {
        const resp = await request(app).delete(`/books/${book.isbn}`);
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual(expect.objectContaining({
            message: expect.any(String)
        }));
    });
    test("invalid isbn", async () => {
        const resp = await request(app).delete(`/books/agkljags`);
        expect(resp.statusCode).toBe(404);
    });
});
