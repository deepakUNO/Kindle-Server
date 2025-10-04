import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
export enum Category {
    ADVENTURE = 'Adventure',
    CLASSICS = 'Classics',
    CRIME = 'Crime',
    FANTASY = 'Fantasy'
}
@Schema({
    timestamps: true,
})
export class Book {
    @Prop({ type: String, required: true })
    title: string;

    @Prop({ type: String, default: "Deepak Sharma" })
    author: string;

    @Prop({ type: String, default: "No description available" })
    description: string;

    @Prop({ type: Number, default: 100 })
    price: number;

    @Prop({ type: String, enum: Category, default: Category.CLASSICS })
    category: Category;
};
export const BookSchema = SchemaFactory.createForClass(Book);