import { NextRequest, NextResponse } from 'next/server';
import { databaseConnection } from '@/lib/dbConnect';
import User from '@/models/user.model';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token } = body;
        console.log(`TOKEN: `, token);

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        await databaseConnection();

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        }).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid token detail' },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json(
            {
                message: 'Email verified successfully',
                success: true,
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to verify user' },
            { status: 500 }
        );
    }
}
