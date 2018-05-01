'use strict';

import {handleError} from '../error-handler/index';

function postRoute(app) {
    app.use('/:url(api|auth)/*', (err, req, res, done) => {
        if (res.headersSent) {
            return done(err);
        }
        if (err) return handleError(req, res)(err);

        return done();
    });
}

export {
    postRoute
};
