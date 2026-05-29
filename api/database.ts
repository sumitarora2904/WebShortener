import {
  MongoClient,
  ObjectId,
} from "https://deno.land/x/mongo@v0.31.2/mod.ts";

import config from "../env.ts";

const client = new MongoClient();

const MONGO_URL = new URL(config.MONGO_URL);
if (!MONGO_URL.searchParams.has("authMechanism")) {
  MONGO_URL.searchParams.set("authMechanism", "SCRAM-SHA-1");
}

await client.connect(MONGO_URL.href);

const db = client.database("SelfShortener");

interface UrlSchema {
  _id: ObjectId;
  hash: string;
  url: string;
}

const urls = db.collection<UrlSchema>("URLS");

await urls.createIndexes({
  indexes: [
    { name: "hash_idx", key: { hash: 1 }, unique: true },
    { name: "url_idx", key: { url: 1 }, unique: true },
  ],
});

async function checkIfUrlExists(url: string) {
  return await urls.findOne({ url });
}

function generateHash() {
  return crypto.randomUUID().slice(0, 6);
}

export async function shortenUrl(url: string): Promise<string> {
  const existing = await checkIfUrlExists(url);

  if (existing) return existing.hash;

  let hash = generateHash();

  while (await urls.findOne({ hash })) {
    hash = generateHash();
  }

  await urls.insertOne({ url, hash });

  return hash;
}

export async function getUrl(hash: string) {
  const doc = await urls.findOne({ hash });
  return doc?.url;
}
