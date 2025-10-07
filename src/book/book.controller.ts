import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import mongoose, { Mongoose } from 'mongoose';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { CurrentUser } from 'src/user/current-user.decorator';
import { User } from 'src/user/schemas/user.schema';

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
    @UseGuards(JwtAuthGuard)
    async createBook(@Body() book: CreateBookDto, @CurrentUser() user: User): Promise<Book> {
        const payload = { ...book, author: (user as any)._id };
        return this.bookService.create(payload as any);
    }
    @Get('id/:id')
    async getBookById(@Param('id') id: string): Promise<Book | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid book ID', 400);
        }
        return this.bookService.findBookById(id);
    }

    @Get('author')
    async getBooksByAuthor(@Param('authorId') authorId: string): Promise<Book[]> {
        console.log('Author ID:', authorId); // Debugging line
        // if (!mongoose.Types.ObjectId.isValid(authorId)) {
        //     throw new HttpException('Invalid author ID', 400);
        // }
        return this.bookService.findBooksByAuthor(authorId);
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
