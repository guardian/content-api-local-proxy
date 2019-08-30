import { RequestSigner } from 'aws4';
import { SharedIniFileCredentials } from 'aws-sdk';

export function sign(url) {
    const credentials = new SharedIniFileCredentials({ profile: 'capi' });

    const opts = {
        region: 'eu-west-1',
        service: 'execute-api',
        host: url.hostname,
        path: url.pathname + url.search
    };

    const { headers } = new RequestSigner(opts, credentials).sign();
    delete headers['Host']; // to appease Node 6.10

    return headers;
}