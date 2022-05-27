# Content API Local Proxy

A local proxy to CAPI that handles authentication.

**FOR LOCAL USE ONLY**

See [documentation for the Content API](https://open-platform.theguardian.com/documentation/) for relevant endpoints, and how to query and filter the response from CAPI.

## Running
💻 Clone repo `git clone git@github.com:guardian/content-api-local-proxy.git`

🔌 Run `./script/setup`

📝 Fill in `.env` – see the template in `.env.example`. API keys can be acquired at `https://bonobo.capi.gutools.co.uk/register/developer`.

🎭 [For preview] Make sure you have up-to-date AWS credentials for the 'Content API' account.

🔌 Run `./script/start`

🌍 Open `https://capi-proxy.local.dev-gutools.co.uk` in your browser

## Developing
🔌 Run `./script/start-dev` to watch for changes and reload the server

🌍 Open `https://capi-proxy.local.dev-gutools.co.uk` in your browser
