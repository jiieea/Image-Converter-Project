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

const CONVERT_IMAGE = async (formData: FormData, format: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert?format=${format}`, {
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

const CONVERT_PDF = async (formData: FormData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert/pdf`, {
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
export const convertImage = async (files: File[], format?: string): Promise<string> => {
    const formData = new FormData();
    if (files.length > 1) {
        files.forEach((file) => {
            formData.append('files', file);
        });
    } else {
        formData.append('file', files[0])
    }

    try {
        let url: string;
        if (files.length > 1) {
            url = await CONVERT_PDF(formData);
        } else {
            url = await CONVERT_IMAGE(formData, format!)
        }
        return url;
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

