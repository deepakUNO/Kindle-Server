import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Book } from './schemas/book.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>
    ) { }
    async findAll(): Promise<Book[]> {
        const books = await this.bookModel.find();
        return books;
    }

    async getAllBooksWithPaginationAndSearch(page: number = 1, limit: number = 10, searchTerm: string = ''): Promise<Book[]> {
        // ensure numeric values (in case controller passes strings)
        const pageNum = Number(page) > 0 ? Number(page) : 1;
        const limitNum = Number(limit) > 0 ? Number(limit) : 10;
        const skip = (pageNum - 1) * limitNum;

        // escape regex special chars in the search term to avoid accidental regex injection
        const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const q = (searchTerm && searchTerm.trim().length > 0)
            ? {
                $or: [
                    { title: { $regex: escapeRegex(searchTerm), $options: 'i' } },
                    { author: { $regex: escapeRegex(searchTerm), $options: 'i' } },
                    { description: { $regex: escapeRegex(searchTerm), $options: 'i' } },
                    { category: { $regex: escapeRegex(searchTerm), $options: 'i' } },
                ]
            }
            : {};

        return this.bookModel.find(q).skip(skip).limit(limitNum).exec();
    }

    async create(book: CreateBookDto): Promise<Book> {
        const newBook = new this.bookModel(book);
        try {
            return await newBook.save();
        } catch (err) {
            // convert Mongoose validation errors to HTTP 400
            if (err?.name === 'ValidationError' || err?.name === 'MongoServerError') {
                throw new BadRequestException(err.message);
            }
            throw err;
        }
    }

    async findBookById(id: string): Promise<Book | null> {
        const book = await this.bookModel.findById(id);
        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    }

    async updateBookById(id: string, book: Partial<Book>): Promise<Book | null> {
        const updatedBook = await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true
        });
        if (!updatedBook) {
            throw new NotFoundException('Book not found');
        }
        return updatedBook;
    }
    async deleteBookById(id: string): Promise<Book | null> {
        const deletedBook = await this.bookModel.findByIdAndDelete(id);
        if (!deletedBook) {
            throw new NotFoundException('Book not found');
        }
        return deletedBook;
    }
}
