const { Hub } = require('../dist');
const fs = require('fs');

const hub = new Hub({
    compress: true,
    useServer: true,
});

const router = hub.app.createRouter('/');

router.createRoute('', ['GET'], (stream, meta) => {
    stream.respond({
        ':status': 200,
    });

    stream.end('Hello world');
});

const server = hub.createServer({
    key: fs.readFileSync('./test/localhost-privkey.pem'),
    cert: fs.readFileSync('./test/localhost-cert.pem'),
});

server.listen(8083, '0.0.0.0', 0, () => console.log('Server listen on 8083'));
