import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/helpers/mailer';
import { databaseConnection } from '@/lib/dbConnect';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, email, password } = body;

        // TODO: Validate the data
        console.log(body);

        await databaseConnection();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exist' },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        await sendEmail({ email, emailType: 'VERIFY', userId: user._id });

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully',
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to Signup' },
            { status: 500 }
        );
    }
}
