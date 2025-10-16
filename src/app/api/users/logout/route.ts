import { NextResponse } from 'next/server';
import { databaseConnection } from '@/lib/dbConnect';

export async function GET() {
    try {
        await databaseConnection();

        const response = NextResponse.json({
            message: 'Logout Successfully',
            success: true,
        });

        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || 'Logout Failed',
                success: false,
            },
            { status: 500 }
        );
    }
}
