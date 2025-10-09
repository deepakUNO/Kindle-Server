import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
export enum Category {
    ADVENTURE = 'Adventure',
    CLASSICS = 'Classics',
    CRIME = 'Crime',
    FANTASY = 'Fantasy',
    HISTORY = 'History',
    HORROR = 'Horror',
    ROMANCE = 'Romance',
    SCI_FI = 'Sci-Fi',
    THRILLER = 'Thriller',
    BIOGRAPHY = 'Biography',
    HEALTH = 'Health',
    COOKING = 'Cooking',
    COMICS = 'Comics',
    DIARY = 'Diary',
    JOURNAL = 'Journal',
    VISIONARY = 'Visionary',
    CHILDREN = 'Children',
    FASHION = 'Fashion',
    ART = 'Art',

}
@Schema({
    timestamps: true,
})
export class Book {
    @Prop({ type: String, required: true })
    title: string;

    // ref should point to the User model name so Mongoose population works
    @Prop({ required: true, ref: 'User' })
    author: mongoose.Types.ObjectId;

    @Prop({ type: String, required: true })
    authorName: string;

    @Prop({ type: String, default: "No description available" })
    description: string;

    @Prop({ type: Number, default: 100 })
    price: number;

    @Prop({ type: String, enum: Category, default: Category.CLASSICS })
    category: Category;
    @Prop({ type: Number, min: 0, max: 5, default: 0 })
    rating?: number;

    @Prop({ type: Number, default: 0 })
    ratingsCount?: number;
    @Prop({ type: Number, default: 0 })
    purchaseCount?: number;

    @Prop({ type: Number, default: 0 })
    reviewCount?: number;

    @Prop({ type: String })
    thumbnailUrl?: string;
};
export const BookSchema = SchemaFactory.createForClass(Book);