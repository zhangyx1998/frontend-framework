/* eslint-env node, browser */
export class Request {
    get URL() {
        const attempts = [
            () => new URL(this.path, location.origin),
            () => new URL(this.path, location.href),
        ];
        for (const fn of attempts) {
            try {
                return fn();
            } catch (e) {
                continue;
            }
        }
        throw new Error(`Invalid path: ${this.path}`);
    }
    /**
     * Custom API Constructor
     * @param {string} path Relative or absolute path
     * @param {{method?: string, ...others}} parameters
     * @param {string | undefined} contentType
     */
    constructor(path, params = {}, contentType) {
        // Validate path
        if (typeof path !== 'string' && !(path instanceof URL)) {
            throw new TypeError(`Invalid type: ${typeof path} (${path})`);
        }
        // Set path record
        this.path = path ?? location.url;
        // Set parameters
        if (typeof params === 'string') params = { method: params };
        else if (typeof params !== 'object') throw new TypeError(`Invalid type: ${typeof params} (${params})`);
        this.params = {
            method: 'GET',
            // Above can be overwritten by params
            ...params
        };
        // Optionally Set Content-Type
        if (contentType && typeof contentType === 'string') {
            this.#setHeader('Content-Type', contentType);
        }
    }
    /**
     *
     * @param {*} key
     * @param {*} value
     */
    #setHeader(key, value) {
        this.params.headers ??= {};
        this.params.headers[key] = value;
    }
    /**
     * Invoke the API
     * @param {Any} body
     * @returns {Promise<Response>}
     */
    async request(body = undefined) {
        body ??= this.params.body ?? undefined;
        this.response = await fetch(this.URL, {
            ...this.params,
            body,
        });
        return this.response;
    }
    /**
     * Generate an error instance for cached response
     * @returns {Error}
     */
    get error() {
        const { status = '0', statusText = 'Unknown Error' } = this.response;
        return new class extends Error {
            constructor(code, message) {
                super(message);
                this.code = code;
            }
            toString() {
                return `Request Error: ${this.code}/${this.message ?? 'Unknown Error'}`;
            }
        }(status, statusText);
    }
}

export class TextRequest extends Request {
    constructor(path, params = {}) {
        super(path, params, 'text/plain');
    }
    /**
     * @param {string} body
     */
    async request(body) {
        if (!body) throw new TypeError('body is required');
        return await super.request(String(body));
    }
}

export class JSONRequest extends Request {
    constructor(path, params = {}) {
        super(path, params, 'application/json');
    }
    /**
     * @param {Object} body
     */
    async request(body = {}) {
        return await super.request(JSON.stringify(body));
    }
}
