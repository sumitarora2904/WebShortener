import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getUrl, shortenUrl } from "./database.ts";

const router = new Router();

router.post("/shorten", async (context) => {
  const data = await context.request.body().value;
  if (!data || !data.url) {
    return context.response.body = { "error": "No URL provided." };
  }
  const hash = await shortenUrl(data.url);
  context.response.body = { hash };
});

router.get("/:urlhash", async (context) => {
  if (!context.params.urlhash) {
    return context.response.body = { "error": "No URL provided." };
  }
  const url = await getUrl(context.params.urlhash);
  if (!url) {
    return context.response.body = { "error": "Invalid URL." };
  }
  context.response.redirect(url);
});

const app = new Application();

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  await next();
});

app.use(async (ctx, next) => {
  if (["/", "/styles.css", "/script.js"].includes(ctx.request.url.pathname)) {
    await ctx.send({root: './public/', index: 'index.html'});
  }
  else {
    await next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("error", (e) => console.log(e));

console.log("> Started listeneing on PORT 8000!");

await app.listen({ port: 8000 });
