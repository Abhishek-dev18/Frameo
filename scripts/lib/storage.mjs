// Uploads a rendered MP4 to Cloudflare R2 and returns a public URL.
// Instagram downloads the video from this URL, so the bucket must be public.
import fs from "node:fs";
import path from "node:path";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {env} from "./env.mjs";

export async function uploadVideo(file) {
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
    credentials: {accessKeyId: env("R2_ACCESS_KEY_ID"), secretAccessKey: env("R2_SECRET_ACCESS_KEY")},
  });
  const key = `videos/${Date.now()}-${path.basename(file)}`;
  await client.send(
    new PutObjectCommand({Bucket: env("R2_BUCKET"), Key: key, Body: fs.readFileSync(file), ContentType: "video/mp4"}),
  );
  return `${env("R2_PUBLIC_URL").replace(/\/$/, "")}/${key}`;
}
