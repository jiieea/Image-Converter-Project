const POSTIMAGES = async (formData: FormData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compression/multi-file`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message);
    }
    const data = await response.json();
    return data.url;
}
const POST = async (formData: FormData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compression`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message);
    }
    const data = await response.json();
    return data.fileUrl;
}
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

export const compressionImage = async (files: File[]): Promise<string> => {
    const formData = new FormData();
    if (files.length > 1) {
        files.forEach((file: File) => formData.append('images', file));
    } else {
        formData.append('image', files[0]);
    }
    console.log('formData images count:', formData.getAll('images').length);
    try {
        let result: string;
        if (files.length > 1) {
            result = await POSTIMAGES(formData)
        } else {
            result = await POST(formData);
        }

        return result;
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new Error('Compression failed =' + e.message);
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