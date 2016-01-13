import createServer from 'example/createServer';
import { initializeStore, createApp } from 'example/app';
import routes from 'example/routes';
import WebpackConfig from 'example/webpack.config';

createServer(false, routes, initializeStore, createApp, WebpackConfig);
