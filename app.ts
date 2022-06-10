import express from 'express';
import router from './routers';
import path from 'path'
import favicon from 'serve-favicon';
const port = 8888;

const app = express();

// 设置 favicon.ico
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
// 设置静态文件路径
app.use(express.static('public'));

app.use('/', router);

app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
);
