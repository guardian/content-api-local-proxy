import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import querystring from 'querystring';
import fetch from 'node-fetch';

import { sign } from './IAMSigner';
import { LIVE_CAPI_HOST, LIVE_CAPI_API_KEY, IAM_PREVIEW_CAPI_HOST } from './config';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/live/*', (req, res, next) => {
    const capiPath = req.url.replace('/live', '');
    const [path, qs] = capiPath.split('?');
    const apiKey = {
        'api-key': LIVE_CAPI_API_KEY
    };

    const qsWithKey = qs ? { ...querystring.parse(qs), ...apiKey} : apiKey;

    const capiUrl = new URL(`https://${LIVE_CAPI_HOST}${path}?${querystring.stringify(qsWithKey)}`);

    fetch(capiUrl, {})
        .then(_ => _.json())
        .then(({ response }) => {
            res.send(response);
        });
});

app.get('/preview/*', (req, res, next) => {
    const capiPath = req.url.replace('/preview', '');
    const capiUrl = new URL(`https://${IAM_PREVIEW_CAPI_HOST}${capiPath}`);
    const headers = {
        ...sign(capiUrl),
        Accept: 'application/json'
    };

    fetch(capiUrl, { headers })
        .then(_ => _.json())
        .then(({ response }) => {
            res.send(response);
        });
});

export default app;
