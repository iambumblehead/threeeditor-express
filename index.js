var express = require('express'),
    morgan = require('morgan'),
    winston = require('winston'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    serveIndex = require('serve-index'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    errorhandler = require('errorhandler'),
    expressWinston = require('express-winston'),
    methodOverride = require('method-override'),
    http = require('http'),
    app;

app = express();
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('.html', function (fpath, data, fn) {
  console.log('fpath is ', fpath);
  require('fs').readFile(fpath, 'utf-8', fn);          
});

app.use(methodOverride());

app.use(expressWinston.logger({
  transports : [
    new winston.transports.File({ 
      json: true, 
      colorize: true, 
      maxsize : 104857600, // 100mb
      maxFiles : 10,
      filename: './log_err.log'
    })]
}));

app.use(expressWinston.logger({
  transports : [
    new winston.transports.File({ 
      json: true, 
      colorize: true, 
      maxsize : 104857600, // 100mb
      maxFiles : 10,
      filename: './log_req.log'
    })]
}));

app.use(compression());
app.use('/', express.static(__dirname + '/node_modules/three.js/'));
app.use('/', serveIndex(__dirname + '/node_modules/three.js/', { icons : true }));

app.set('views', __dirname + './node_modules/three.js/');
app.set('view options', {
  layout : false
});

app.use(errorhandler({
  dumpExceptions : true, 
  showStack : true
}));

http.createServer(app).listen(9876);

console.log('[...] http://:name::porthttp'
            .replace(/:name/gi, 'localhost')
            .replace(/:porthttp/, 9876));
