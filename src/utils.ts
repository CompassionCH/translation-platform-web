// Dummy string trim
export function trimEndSlash(string: string) {
    const charToRemove = '/';
    while(string.charAt(string.length-1)==charToRemove) {
        string = string.substring(0,string.length-1);
    }

    return string;
}

export function getWebPath(path: string) {
    return trimEndSlash(import.meta.env.VITE_WEB_URL) + path;
}