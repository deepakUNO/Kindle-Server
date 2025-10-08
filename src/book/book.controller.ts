import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
import { Book } from './schemas/book.schema';
import mongoose, { Mongoose } from 'mongoose';
import { JwtAuthGuard } from 'src/user/jwt-auth.guard';
import { CurrentUser } from 'src/user/current-user.decorator';
import { User } from 'src/user/schemas/user.schema';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('books')
@Controller('books')
export class BookController {
    constructor(private bookService: BookService) { }
    @Get()
    @ApiOperation({ summary: 'Get all books' })
    @ApiResponse({ status: 200, description: 'List of books' })
    async getAllBooks(): Promise<Book[]> {
        return this.bookService.findAll();
    }
    @Get('search')
    @ApiOperation({ summary: 'Search books with pagination' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Results per page' })
    @ApiQuery({ name: 'searchTerm', required: false, type: String, description: 'Search text' })
    async getAllBooksWithPaginationAndSearch(
        @Query('page') page?: number,
        @Query('limit') limit?: number,
        @Query('searchTerm') searchTerm?: string,
    ): Promise<Book[]> {
        return this.bookService.getAllBooksWithPaginationAndSearch(page, limit, searchTerm);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a book' })
    @ApiResponse({ status: 201, description: 'Book created' })
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
    @ApiOperation({ summary: 'Get books by author' })
    // treat authorId as a plain string in Swagger/UI so it only asks for an id value
    @ApiQuery({ name: 'authorId', required: true, type: String, description: 'Author id (Mongo ObjectId) as string' })
    async getBooksByAuthor(@Query('authorId') authorId: string): Promise<Book[]> {
        // strip accidental surrounding quotes (e.g. "%2268...%22") and validate
        const cleaned = authorId?.replace(/^"|"$/g, '');
        console.log('Author ID:', cleaned);
        if (!mongoose.Types.ObjectId.isValid(cleaned)) {
            throw new HttpException('Invalid author ID', 400);
        }
        return this.bookService.findBooksByAuthor(cleaned);
    }

    @Patch(':id')
    async updateBookById(@Param('id') id: string, @Body() book: Partial<Book>): Promise<Book | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid book ID', 400);
        }
        return this.bookService.updateBookById(id, book);
    }
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteBookById(@Param('id') id: string, @CurrentUser() user: User): Promise<{ deletedBook: Book | null; message: string }> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new HttpException('Invalid book ID', 400);
        }
        return this.bookService.deleteBookById(id, (user as any)._id?.toString());
    }
}
