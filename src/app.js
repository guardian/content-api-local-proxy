import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import proxy from 'http-proxy-middleware';
import querystring from 'querystring';

import indexRouter from './routes/index';
import { sign } from './IAMSigner';
import { LIVE_CAPI_HOST, LIVE_CAPI_API_KEY, IAM_PREVIEW_CAPI_HOST } from './config';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/live', proxy({
    target: `https://${LIVE_CAPI_HOST}`,
    changeOrigin: true,
    pathRewrite: (path, req) => {
        const splitPath = path.split('?');
        const hasQs = splitPath.length === 2;

        const apiKey = {
            'api-key': LIVE_CAPI_API_KEY
        };

        const qs = hasQs ? { ...querystring.parse(splitPath[1]), ...apiKey} : apiKey;
        return `${splitPath[0]}?${querystring.stringify(qs)}`.replace('/live', '');
    }
}));

app.use('/preview', proxy({
    target: `https://${IAM_PREVIEW_CAPI_HOST}`,
    changeOrigin: true,
    onProxyReq: function(proxyReq, req, res) {
        const path = req.url.replace('/preview', '');
        const url = new URL(`https://${IAM_PREVIEW_CAPI_HOST}${path}`);

        const signedHeaders = sign(url);
        console.log(signedHeaders);
        const extraHeaders = {
            Accept: 'application/json',
            ...signedHeaders
        };

        Object.entries(extraHeaders).forEach(([key, value]) => proxyReq.setHeader(key, value));
    }
}));

export default app;
