const webpackDevMiddleware = require('webpack-dev-middleware');
const stripAnsi = require('strip-ansi');
const webpack = require('webpack');
const makeWebpackConfig = require('./webpack.make');
const webpackConfig = makeWebpackConfig({ DEV: true });
const compiler = webpack(webpackConfig);
const browserSync = require('browser-sync').create();

export default function(app) {
     var config = require("./server/config/environment");

     /**
      * Run Browsersync and use middleware for Hot Module Replacement
      */
     browserSync.init({
          open: false,
          logFileChanges: false,
          proxy: `localhost:${config.port}`,
          ws: true,
          middleware: [
               webpackDevMiddleware(compiler, {
                    noInfo: false,
                    stats: {
                         colors: true,
                         timings: true,
                         chunks: false,
                    },
               }),
          ],
          port: config.browserSyncPort,
          plugins: ['bs-fullscreen-message'],
     });

     /**
      * Reload all devices when bundle is complete
      * or send a fullscreen error message to the browser instead
      */
     compiler.plugin('done', (stats) => {
          console.log('webpack done hook');
          if (stats.hasErrors()/* || stats.hasWarnings()*/) {
               return browserSync.sockets.emit('fullscreen:message', {
                    title: 'Webpack Error:',
                    body: stripAnsi(stats.toString()),
                    timeout: 100000,
               });
          }
          browserSync.reload();
     });
}
