import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getUrl, shortenUrl } from "./database.ts";

const router = new Router();

router.post("/shorten", async (context) => {
  try {
    const body = context.request.body({ type: "json" });
    const data = await body.value;
    
    if (!data || !data.url) {
      context.response.status = 400;
      context.response.body = { error: "No URL provided." };
      return;
    }
    
    const hash = await shortenUrl(data.url);
    context.response.body = { hash };
  } catch (err) {
    context.response.status = 500;
    context.response.body = { error: "Internal Server Error" };
  }
});

router.get("/:urlhash", async (context) => {
  if (context.params.urlhash === "shorten") {
    context.response.status = 404;
    return;
  }

  if (!context.params.urlhash) {
    context.response.status = 400;
    context.response.body = { error: "No URL provided." };
    return;
  }
  
  const url = await getUrl(context.params.urlhash);
  
  if (!url) {
    context.response.status = 404;
    context.response.body = { error: "Invalid URL." };
    return;
  }
  
  context.response.redirect(url);
});

const app = new Application();

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 200;
    return;
  }

  await next();
});

app.use(async (ctx, next) => {
  const path = ctx.request.url.pathname;
  if (["/", "/styles.css", "/script.js", "/skull.png", "/background.jpeg"].includes(path)) {
    await ctx.send({ root: "./public/", index: "index.html" });
  } else {
    await next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
