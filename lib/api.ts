
export const convertImage = async (file: File, format: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert?format=${format}`, {
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