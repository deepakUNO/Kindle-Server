import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Skip logging for preflight
        if (req.method === 'OPTIONS') return next();

        const { method, originalUrl, query, params } = req;

        // Log request after body-parsers have run
        console.log(`Incoming Request: ${method} ${originalUrl}`);
        console.log('Params:', params);
        console.log('Query:', query);
        console.log('Body:', req.body);

        // capture response body by wrapping write/end once
        const chunks: Buffer[] = [];
        const oldWrite = res.write;
        const oldEnd = res.end;

        // @ts-ignore - keep the original signatures
        res.write = function (chunk: any, ...args: any[]) {
            try {
                if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            } catch (e) {
                /* ignore */
            }
            return oldWrite.apply(res, [chunk, ...args]);
        };

        // @ts-ignore
        res.end = function (chunk: any, ...args: any[]) {
            try {
                if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            } catch (e) {
                /* ignore */
            }

            const body = Buffer.concat(chunks).toString('utf8');
            // log once when response is finished
            console.log(`Response for ${method} ${originalUrl} - status ${res.statusCode}:`, tryParseJson(body));

            // restore and call original end
            res.write = oldWrite;
            res.end = oldEnd;
            return oldEnd.apply(res, [chunk, ...args]);
        };

        next();
    }
}

function tryParseJson(text: string) {
    if (!text) return text;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}
