import { NextRequest, NextResponse } from 'next/server';
import { databaseConnection } from '@/lib/dbConnect';
import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        await databaseConnection();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    message: 'User does not exist',
                },
                { status: 404 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json(
                {
                    message: 'Invalid credentials',
                },
                { status: 400 }
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.TOKEN_SECRET!,
            { expiresIn: '1d' }
        );

        const response = NextResponse.json({
            message: 'Logged In Success',
            success: true,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || 'Failed to login',
            },
            { status: 500 }
        );
    }
}
