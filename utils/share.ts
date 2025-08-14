
// Helper function to convert a Blob to a Base64 string
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the data URL prefix 'data:*/*;base64,'
            resolve(base64String.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

// Helper function to convert a Base64 string to a Uint8Array
const base64ToUint8Array = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

/**
 * Compresses a JavaScript object into a URL-safe Base64 string.
 * @param data The object to compress.
 * @returns A promise that resolves to the compressed, encoded string.
 */
export const compressAndEncode = async (data: object): Promise<string> => {
    try {
        const jsonString = JSON.stringify(data);
        const stream = new Blob([jsonString], { type: 'application/json' }).stream();
        const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
        const compressedBlob = await new Response(compressedStream).blob();
        const base64String = await blobToBase64(compressedBlob);
        // Make it URL-safe
        return encodeURIComponent(base64String);
    } catch (error) {
        console.error('Compression failed:', error);
        throw error;
    }
};

/**
 * Decompresses a URL-safe Base64 string back into a JavaScript object.
 * @param encodedData The compressed, encoded string.
 * @returns A promise that resolves to the decompressed object, or null on failure.
 */
export const decodeAndDecompress = async (encodedData: string): Promise<any | null> => {
    try {
        const base64String = decodeURIComponent(encodedData);
        const uint8Array = base64ToUint8Array(base64String);
        const stream = new Blob([uint8Array]).stream();
        const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
        const decompressedBlob = await new Response(decompressedStream).blob();
        const jsonString = await decompressedBlob.text();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Decompression failed:', error);
        return null;
    }
};
