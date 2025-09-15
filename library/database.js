// lib/database.js
import { put, head, del } from '@vercel/blob';

const DB_FILENAME = 'db.json';

// 读取数据库文件
export async function readDb() {
    try {
        await head(DB_FILENAME);
        const response = await fetch(
            `${process.env.BLOB_URL}/${DB_FILENAME}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
                },
            }
        );
        if (!response.ok) {
            if (response.status === 404) {
                console.log('Database file not found, returning initial state.');
                return { users: [] };
            }
            throw new Error(`Failed to fetch DB: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error.status === 404) {
            console.log('Database file not found, returning initial state.');
            return { users: [] };
        }
        console.error("Error reading from Vercel Blob:", error);
        throw error;
    }
}

// 写入数据库文件
export async function writeDb(data) {
    const content = JSON.stringify(data, null, 2);
    try {
        const blob = await put(DB_FILENAME, content, {
            access: 'public',
            contentType: 'application/json',
            addRandomSuffix: false,
        });
        console.log('Database updated successfully:', blob.url);
    } catch (error) {
        console.error("Error writing to Vercel Blob:", error);
        throw error;
    }
}