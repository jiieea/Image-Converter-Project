import {useAuthStore} from '@/app/hooks/useAuthStore'; // adjust path to match your project

interface authPayload {
    email: string,
    password: string,
}

// Builds an Authorization header only when a token exists — guests still
// hit these endpoints fine, they just won't get the auth-guard's unlimited pass.
// Uses getState() (not the hook) because these are plain functions, not
// components — see api-client.ts discussion for why that distinction matters.
const authHeader = (): HeadersInit => {
    const token = useAuthStore.getState().token;
    return token ? {authorization: `Bearer ${token}`} : {};
};

const COMPRESS_FILES = async (formData: FormData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compression/multi-file`, {
        method: 'POST',
        headers: authHeader(),
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
        headers: authHeader(),
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
        headers: authHeader(),
        body: formData,
    });
    if (!response.ok) {
        const json = await response.json();
        throw new Error(json.message);
    }
    const data = await response.json();
    return data.url;
}
const COMPRESS = async (formData: FormData) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/compression`, {
        method: 'POST',
        headers: authHeader(),
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
    try {
        let url: string;
        files.length > 1 ?
            url = await COMPRESS_FILES(formData)
            :
            url = await COMPRESS(formData);

        return url;
    } catch (e: unknown) {
        if (e instanceof Error) {
            throw new Error('Compression failed =' + e.message);
        }
        throw e;
    }
}


export const signUpRequest = async (payload: authPayload): Promise<any> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message ? data.message : data.error);
    }
    return response.json();
}


export const signInRequest = async (payload: authPayload): Promise<any> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message ? res.message : res.error);
    }
    return response.json();
}


export const logoutReq = async (token: string) => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
        }
    });
    if (!data.ok) {
        const res = await data.json();
        throw new Error(res.message ? res.message : res.error);
    }
    const res = await data.json();
    return res;
}