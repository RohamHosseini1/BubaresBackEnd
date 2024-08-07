import { Injectable } from '@nestjs/common'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'
import { HandleException } from 'helpers/handle.exception'

const PUBLIC_BUCKET_NAME = 'bubares'
const FACADE_MODELS_FOLDER_NAME = '/facade-models/'
const FACADE_THUMBNAIL_FOLDER_NAME = '/facade-thumbnails/'
const BLOG_IMAGE_FOLDER_NAME = '/blog-images/'

@Injectable()
export class S3ClientService {
  private s3Client: S3Client

  constructor() {
    this.s3Client = new S3Client({
      region: 'default',
      endpoint: process.env.LIARA_ENDPOINT,
      credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY,
        secretAccessKey: process.env.LIARA_SECRET_KEY,
      },
    })
  }

  async uploadObject(file: string, key: string) {
    const params = {
      Body: file,
      Bucket: process.env.LIARA_BUCKET_NAME,
      Key: key,
    }

    try {
      await this.s3Client.send(new PutObjectCommand(params))
    } catch (_) {
      try {
        await this.s3Client.send(new PutObjectCommand(params))
      } catch (err) {
        throw new HandleException('Failed to upload data to bucket.', 500, err)
      }
    }
  }

  async deleteObject(key: string) {
    const params = {
      Bucket: PUBLIC_BUCKET_NAME,
      Key: key,
    }

    try {
    } catch (err) {
      try {
        await this.s3Client.send(new DeleteObjectCommand(params))
      } catch (error) {
        throw new HandleException('Could not delete the object.', 500, err)
      }
    }

    return {
      status: 'SUCCESS',
      deletedFile: key,
    }
  }

  async getUploadBlogImageUrl() {
    const imageKey = BLOG_IMAGE_FOLDER_NAME + uuidv4() + '.png'

    const uploadUrl = await getSignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: PUBLIC_BUCKET_NAME,
        Key: imageKey,
        ContentType: 'image/png',
      }),
      {
        expiresIn: 3600, // in seconds
      },
    )

    return {
      uploadUrl,
      key: imageKey,
      allowedFile: {
        extension: '.png',
        contentType: 'image/png',
      },
      expiresInSeconds: 3600,
    }
  }

  async getUploadFacadeDataUrl() {
    const modelKey = FACADE_MODELS_FOLDER_NAME + uuidv4() + '.glb'
    const thumbnailKey = FACADE_THUMBNAIL_FOLDER_NAME + uuidv4() + '.png'

    const modelUploadUrl = await getSignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: PUBLIC_BUCKET_NAME,
        Key: modelKey,
        ContentType: 'model/gltf-binary',
      }),
      {
        expiresIn: 3600, // in seconds
      },
    )

    const thumbnailUploadUrl = await getSignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: PUBLIC_BUCKET_NAME,
        Key: thumbnailKey,
        ContentType: 'image/png',
      }),
      {
        expiresIn: 3600, // in seconds
      },
    )

    return {
      model: {
        uploadUrl: modelUploadUrl,
        key: modelKey,
        allowedFile: {
          extension: '.glb',
          contentType: 'model/gltf-binary',
        },
        expiresInSeconds: 3600,
      },
      thumbnail: {
        uploadUrl: thumbnailUploadUrl,
        key: thumbnailKey,
        allowedFile: {
          extension: '.png',
          contentType: 'image/png',
        },
        expiresInSeconds: 3600,
      },
    }
  }

  async deleteFacadeData(input: { key: string; type?: 'MODEL' | 'THUMBNAIL' }, validateInput = true) {
    if (validateInput && input.type) {
      if (input.type === 'MODEL' && !input.key.startsWith(FACADE_MODELS_FOLDER_NAME))
        throw new HandleException(`Key must start with ${FACADE_MODELS_FOLDER_NAME}...`, 400)

      if (input.type === 'THUMBNAIL' && !input.key.startsWith(FACADE_THUMBNAIL_FOLDER_NAME))
        throw new HandleException(`Key must start with ${FACADE_THUMBNAIL_FOLDER_NAME}...`, 400)

      // remove bucket name
      const finalFolderName = input.type === 'MODEL' ? FACADE_MODELS_FOLDER_NAME : FACADE_THUMBNAIL_FOLDER_NAME
      let keyUuid = input.key.replace(finalFolderName, '')

      // remove extension
      const lastDotIndex = keyUuid.lastIndexOf('.')
      if (lastDotIndex !== -1) keyUuid = keyUuid.substring(0, lastDotIndex)

      // check if valid uuid
      if (keyUuid.length !== 36) throw new HandleException(`Invalid UUID key, must be 36 chars.`, 400)
    }

    const params = {
      Bucket: PUBLIC_BUCKET_NAME,
      Key: input.key,
    }

    try {
      await this.s3Client.send(new DeleteObjectCommand(params))
    } catch (err) {
      throw new HandleException('Could not delete the model.', 400, err)
    }

    return {
      status: 'SUCCESS',
      deletedFile: input.key,
    }
  }
}
