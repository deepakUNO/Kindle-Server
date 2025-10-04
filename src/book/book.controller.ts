import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import mongoose from 'mongoose';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService) { }
    @Get()
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAll();
    }
    @Get('search')
    async getAllBooksWithPaginationAndSearch(@Query('page') page: number, @Query('limit') limit: number, @Query('searchTerm') searchTerm: string): Promise<Book[]> {
        return this.bookService.getAllBooksWithPaginationAndSearch(page, limit, searchTerm);
    }

    @Post()
    async createBook(@Body() book: CreateBookDto): Promise<Book> {
        return this.bookService.create(book);
    }
    @Get('id/:id')
    async getBookById(@Param('id') id: string): Promise<Book | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid book ID', 400);
        }
        return this.bookService.findBookById(id);
    }

    @Patch(':id')
    async updateBookById(@Param('id') id: string, @Body() book: Partial<Book>): Promise<Book | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid book ID', 400);
        }
        return this.bookService.updateBookById(id, book);
    }
    @Delete(':id')
    async deleteBookById(@Param('id') id: string): Promise<Book | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid book ID', 400);
        }
        return this.bookService.deleteBookById(id);
    }
}
