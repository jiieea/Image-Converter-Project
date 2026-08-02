export const convertImage = async (file: File, format: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/convert?format=${format}`
            , {
                method: 'POST',
                body: formData,
            });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Conversion failed: ${error.message}`);
        }
        const data = await response.json();
        return data.url; // download link
    } catch (err) {
        throw err;
    }
}

export const compressionImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compression`, {
                method: 'POST',
                body: formData,
            }
        );
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Conversion failed: ${error.message}`);
        }
        const data = await response.json();
        return data.fileUrl;
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new Error('Compression failed' + e.message);
        }
        throw e;
    }
}

export const convertPdf = async (files: File[]): Promise<string> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });
    try {
        //     fetch the endpoint
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/convert/pdf`, {
                method: 'POST',
                body: formData,
            }
        );
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to convert , ${error.message}`);
        }

        const data = await response.json();
        return data.url;
    } catch (err: unknown) {
        if (err instanceof Error) {
            throw err.message;
        }
        return 'An unknown error occurred during PDF conversion.';
    }
}