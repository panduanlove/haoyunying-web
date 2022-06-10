import express from 'express';
import router from './routers';
const port = 8888;

const app = express();

app.use('/', router);

app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
);
