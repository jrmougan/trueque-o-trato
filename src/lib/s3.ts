import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3"

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT!,
  region: process.env.S3_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true, // Required for MinIO
})

const BUCKET = process.env.S3_BUCKET ?? "trueque-images"
const PUBLIC_URL = process.env.S3_PUBLIC_URL ?? `${process.env.S3_ENDPOINT}/${BUCKET}`

/**
 * Upload a file buffer to S3/MinIO.
 * Returns the public URL of the uploaded object.
 */
export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return `${PUBLIC_URL}/${key}`
}

/**
 * Delete a file from S3/MinIO by its key.
 */
export async function deleteFile(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  )
}

/**
 * Extract the S3 object key from a public URL.
 */
export function getKeyFromUrl(url: string): string | null {
  if (!url.startsWith(PUBLIC_URL)) return null
  return url.slice(PUBLIC_URL.length + 1) // +1 for the trailing /
}
