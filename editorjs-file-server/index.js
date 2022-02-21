import Koa from "koa";
import serve from "koa-static";
import Router from "@koa/router";
import cors from "@koa/cors";
import koaBody from "koa-body";
import path from "path";

const UPLOADS_DIR = "uploads";
const PORT = 8080;
const FIELD_NAME = "file";

const app = new Koa();
const router = new Router();
const parseBody = koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.resolve(UPLOADS_DIR),
    keepExtensions: true,
    hash: false,
  },
});

router.post("/uploadFile", (ctx) => {
  const file = ctx.request.files[FIELD_NAME];
  const parsedFilepath = path.parse(file.path);
  const url = `http://localhost:${PORT}/${parsedFilepath.base}`;

  ctx.body = {
    success: 1,
    file: {
      url,
      name: file.name,
      size: file.size,
      title: file.name,
    },
  };
});

router.post("/fetchUrl", (ctx) => {
  ctx.body = {
    success: 1,
    file: {
      url: ctx.request.body.url,
    },
  };
});

app.use(parseBody);
app.use(cors());
app.use(serve(UPLOADS_DIR));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
