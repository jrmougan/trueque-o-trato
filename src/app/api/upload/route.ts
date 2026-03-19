import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadFile } from "@/lib/s3"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"]
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_FILES = 5

export async function POST(request: Request) {
  // 1. Auth check
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 })
  }

  // 2. Parse multipart form data
  const formData = await request.formData()
  const files = formData.getAll("files") as File[]

  if (files.length === 0) {
    return NextResponse.json(
      { error: "No se enviaron archivos." },
      { status: 400 }
    )
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Maximo ${MAX_FILES} imagenes permitidas.` },
      { status: 400 }
    )
  }

  // 3. Validate each file
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Tipo de archivo no permitido: ${file.type}. Usa JPEG, PNG, WebP o AVIF.`,
        },
        { status: 400 }
      )
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `El archivo "${file.name}" excede el limite de 5 MB.` },
        { status: 400 }
      )
    }
  }

  // 4. Upload each file to S3/MinIO
  try {
    const urls: string[] = []

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1]
      const key = `items/${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const url = await uploadFile(buffer, key, file.type)
      urls.push(url)
    }

    return NextResponse.json({ urls })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Error al subir las imagenes. Intenta de nuevo." },
      { status: 500 }
    )
  }
}
