import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from '../schemas/book.schema';

export class BookResponseDto {
    @ApiProperty({ example: '64b8f9a0e4b0c1a234567890' })
    readonly _id: string;

    @ApiProperty({ example: 'The Great Gatsby' })
    readonly title: string;

    @ApiProperty({ example: '68e4db1bd021522309fb7c8c' })
    readonly author: string;

    @ApiPropertyOptional({ example: 'A classic novel' })
    readonly description?: string;

    @ApiPropertyOptional({ example: 19.99 })
    readonly price?: number;

    @ApiProperty({ enum: Category })
    readonly category: Category;

    @ApiPropertyOptional({ example: 'http://example.com/thumbnail.jpg' })
    readonly thumbnailUrl?: string;

    @ApiPropertyOptional({ example: 4.5 })
    readonly rating?: number;

    @ApiPropertyOptional({ example: 10 })
    readonly ratingsCount?: number;

    @ApiPropertyOptional({ example: 123 })
    readonly purchaseCount?: number;

    @ApiPropertyOptional({ example: 5 })
    readonly reviewCount?: number;

    @ApiProperty({ type: String, format: 'date-time' })
    readonly createdAt: string;

    @ApiProperty({ type: String, format: 'date-time' })
    readonly updatedAt: string;
}
