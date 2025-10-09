import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Book } from './schemas/book.schema';
import mongoose, { Model, mongo } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
        private userService: UserService,
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
    async findBooksByAuthor(authorId: string | mongoose.Types.ObjectId): Promise<Book[]> {
        const idStr = typeof authorId === 'string' ? authorId : authorId?.toString();
        if (!mongoose.Types.ObjectId.isValid(idStr)) {
            throw new BadRequestException('Invalid author ID');
        }
        const objId = new mongoose.Types.ObjectId(idStr);
        return this.bookModel.find({ author: objId }).exec();
    }

    async create(book: CreateBookDto): Promise<Book> {
        const newBook = new this.bookModel(book);
        try {
            const saved = await newBook.save();
            // if author is provided, add this book id to the author's authorOfBooks array
            try {
                const authorId = (book as any).author;
                
                if (authorId) {
                    await this.userService.addBookToAuthor(authorId.toString(), saved._id.toString());
                }
            } catch (e) {
                // non-fatal: if updating the user fails, we still return the created book
                console.warn('Failed to add book to author profile:', e?.message ?? e);
            }
            return saved;
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
    async deleteBookById(id: string, requestingUserId?: string): Promise<{ deletedBook: Book | null; message: string }> {
        const book = await this.findBookById(id);
        if (!book) {
            throw new NotFoundException('Book not found');
        }

        // enforce that only the author can delete
        if (requestingUserId) {
            const bookAuthorId = (book.author as any)?._id ? (book.author as any)._id.toString() : book.author?.toString();
            if (bookAuthorId !== requestingUserId) {
                throw new ForbiddenException('Only the author can delete this book');
            }
        }

        const deletedBook = await this.bookModel.findByIdAndDelete(id);

        if (!deletedBook) {
            throw new NotFoundException('Book not found');
        }

        // remove book reference from author's authorOfBooks
        try {
            const authorId = (deletedBook.author as any)?._id ? (deletedBook.author as any)._id : deletedBook.author;
            if (authorId) {
                await this.userService.removeBookFromAuthors(deletedBook._id.toString(), authorId as any);
            }
        } catch (e) {
            console.warn('Failed to remove book from author profile:', e?.message ?? e);
        }

        return { deletedBook, message: 'Book successfully deleted' };
    }
}
