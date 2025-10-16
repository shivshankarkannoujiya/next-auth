import { NextRequest, NextResponse } from 'next/server';
import { databaseConnection } from '@/lib/dbConnect';
import User from '@/models/user.model';
import { getDataFromToken } from '@/helpers/getDataFromToken';

export async function GET(request: NextRequest) {
    try {
        await databaseConnection();
        const userId = await getDataFromToken(request);
        const user = await User.findOne({ _id: userId }).select('-password');
        if (!user) {
            return NextResponse.json(
                {
                    error: 'Invalid token',
                    success: false,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: 'User fetched successfully',
                success: true,
                data: user,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                error: 'Failed to fetch user',
                success: false,
            },
            { status: 500 }
        );
    }
}