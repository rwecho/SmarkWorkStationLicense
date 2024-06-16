import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { publicEncrypt } from 'crypto'
import crypto from 'crypto'
import { License } from '@/types/license'
import dayjs from 'dayjs'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, context: {}) {
  try {
    const licenses = (await prisma.licenses.findMany()) as License[]

    // order by created time desc
    licenses.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return new Response(JSON.stringify(licenses), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error)

    return new Response(error.message, { status: 500 })
  }
}

function generateLicense(fingerprint: string, expireDays: number) {
  const publicKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC/LwpBnNUAAHcfDD/TbWpycjXBTtxuAEaWeLPZM5L7GPVRNcAHRJkUTOk64RG1nUwtLTZRTGZybzkBLnd3PpTdhQnNnn4ooE/fVsr2EdcNBYb8XeCR5jyM7ZHvg0f3kvywu0x4IwA45ukegUDaJPVe0G6X26e5IoNIG3k3zqK70QIDAQAB
-----END PUBLIC KEY-----`

  const activateTime = new Date()
  const expirationTime = dayjs(activateTime).add(expireDays, 'day')
  const licenseInfo = {
    Fingerprint: fingerprint,
    ActivationTime: activateTime.toISOString(),
    ExpirationTime: expirationTime.toISOString(),
    Salt: crypto.randomUUID(),
  }

  const data = Buffer.from(JSON.stringify(licenseInfo), `utf-8`)
  const chunkSize = 117
  let encryptedData: Buffer = Buffer.alloc(0)
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.subarray(i, i + chunkSize)
    const encrypted = publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      chunk
    )
    encryptedData = Buffer.concat([encryptedData, encrypted])
  }
  return encryptedData.toString('base64')
}

export async function POST(request: NextRequest, context: {}) {
  try {
    const input = await request.json()

    console.log('input', input)

    if (!input.fingerprint) {
      return new Response('电脑指纹不能为空', { status: 400 })
    }
    const licenseCode = generateLicense(input.fingerprint, input.expireDays)
    const license = await prisma.licenses.create({
      data: {
        ...input,
        license: licenseCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    return new Response(JSON.stringify(license), {
      headers: { 'content-type': 'application/json' },
    })
  } catch (error: any) {
    console.error(error)

    return new Response(error.message, { status: 500 })
  }
}
