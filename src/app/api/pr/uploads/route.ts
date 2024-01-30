import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { AxiosError } from 'axios';

export const POST = async (req: NextResponse) => {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;
        if (!file) {
            return NextResponse.json({ message: 'image not found', success: false });
        }
        const byteData = await file.arrayBuffer();
        const buffer = Buffer.from(byteData);

        const path = `./public/uploads/${file.name}`;

        await writeFile(path, buffer);

        return NextResponse.json({ url: file.name });
    } catch (error) {
        return new NextResponse(JSON.stringify({ message: (error as AxiosError).message }));
    }
};
