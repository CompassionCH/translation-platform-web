
// Retrieve data from session storage
// WARNING: This is a security issue, we should NOT store a plain text password in session storage
// But well, anyway :)
export const STORAGE_KEY = 'translation-platform-store';

// Error messages taken from oddo API
export const RPC_FAULT_CODE_CLIENT_ERROR = 1
export const RPC_FAULT_CODE_APPLICATION_ERROR = 1
export const RPC_FAULT_CODE_WARNING = 2
export const RPC_FAULT_CODE_ACCESS_DENIED = 3
export const RPC_FAULT_CODE_ACCESS_ERROR = 4