import dotenv from 'dotenv';

dotenv.config();

export const {
    PORT,
    LIVE_CAPI_HOST,
    LIVE_CAPI_API_KEY,
    IAM_PREVIEW_CAPI_HOST
} = process.env;
