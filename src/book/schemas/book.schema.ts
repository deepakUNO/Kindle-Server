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

    @Prop({required:true, ref: 'Author' })
    author: mongoose.Types.ObjectId;

    @Prop({ type: String, default: "No description available" })
    description: string;

    @Prop({ type: Number, default: 100 })
    price: number;

    @Prop({ type: String, enum: Category, default: Category.CLASSICS })
    category: Category;
};
export const BookSchema = SchemaFactory.createForClass(Book);