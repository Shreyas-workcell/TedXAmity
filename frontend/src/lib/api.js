const rawBackendUrl = process.env.REACT_APP_BACKEND_URL?.trim();

export const BACKEND_URL = (rawBackendUrl || 'http://localhost:8000').replace(/\/$/, '');
