import type { IncomingMessage, ServerResponse } from 'http'

import { useBody } from 'h3'
import { getPullRequests } from '../github'
import { writeFileSync } from 'fs'


export default async (req: IncomingMessage, res: ServerResponse) => {
    const query = await useBody(req)
    if(typeof query.q !== 'string') {
        res.statusCode = 400;
        return 'query need to be a string'
    }
    const prs = await getPullRequests(query.q)

    return prs;  
}
