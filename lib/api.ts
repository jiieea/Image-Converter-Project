export const convertImage = async (file: File, format: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/convert?file=${format}`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Conversion failed: ${data.message}`);
        }

        return data.url; // download link
    } catch (err) {
        throw err;
    }


}