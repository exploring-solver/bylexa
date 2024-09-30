// Config.jsx

export const backendUrl = process.env.EXPO_PUBLIC_API_URL;
export const apiKey = process.env.EXPO_PUBLIC_API_KEY;
export const authDomain = process.env.EXPO_PUBLIC_AUTH_DOMAIN;
export const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;

const Config = {
    backendUrl,
    apiKey,
    authDomain,
    projectId,
};

export default Config;
