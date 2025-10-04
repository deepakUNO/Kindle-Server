import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { mongo } from "mongoose";

@Schema({
    timestamps: true,
})
export class User {
    @Prop({ required: true })
    userName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;
    @Prop()
    age: number;

    @Prop()
    address: string;

    @Prop()
    authorOfBooks: mongoose.Types.ObjectId[];

    @Prop()
    authToken: string;
}


export const UserSchema = SchemaFactory.createForClass(User);