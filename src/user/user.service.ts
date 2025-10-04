import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginUserDto } from './dto/loginUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ) { }
    async register(user: CreateUserDto): Promise<User> {
        const { password } = user;
        const saltRounds = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, saltRounds);
        try {
            const newUser = new this.userModel(user);
            // sign a JWT and attach to user (will be used to validate sessions)
            const JWT_SECRET = process.env.JWT_SECRET ?? 'change_this_secret';
            const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
            const token = jwt.sign({ sub: newUser._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            newUser.authToken = token;
            return await newUser.save();
        } catch (error) {
            if (error.name === 'validationError' || error.name === 'MongoServerError') {
                throw new BadRequestException(error.message);
            }
            throw error
        }
    }
    async signIn(user: loginUserDto): Promise<User> {
        const { email, password } = user;
        const existingUser = await this.userModel.findOne({ email });
        if (!existingUser) {
            throw new BadRequestException('Invalid email or password');
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Invalid email or password');
        }
        // create a new JWT for this session and persist it (overwrites previous token)
        const JWT_SECRET = process.env.JWT_SECRET ?? 'change_this_secret';
        const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '1h';
        const token = jwt.sign({ sub: existingUser._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        existingUser.authToken = token;
        await existingUser.save();
        return existingUser;
    }

    // validate a JWT and ensure it matches the stored token on the user
    async validateAuthToken(authToken: string): Promise<User> {
        if (!authToken) {
            throw new BadRequestException('Token not provided');
        }
        try {
            const decoded: any = jwt.verify(authToken, process.env.JWT_SECRET ?? 'change_this_secret');
            const userId = decoded.sub;
            const user = await this.userModel.findById(userId);
            if (!user) throw new BadRequestException('User not found');
            if (user.authToken !== authToken) throw new BadRequestException('Token is no longer valid');
            return user;
        } catch (error) {
            throw new BadRequestException(error.message ?? 'Invalid token');
        }
    }

    // convenience method kept for API parity
    async myProfile(authToken: string): Promise<User | null> {
        return this.validateAuthToken(authToken);
    }
}
