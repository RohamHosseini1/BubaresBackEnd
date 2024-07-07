import { HttpStatus } from '@nestjs/common'
import { HttpException } from '@nestjs/common'

export class HandleException extends HttpException {
  constructor(
    public readonly message: string,
    private readonly statusCode?: HttpStatus,
    private readonly metadata?: object,
  ) {
    super(
      {
        message,
        statusCode: statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        metadata: metadata || {},
      },
      statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    )

    if (process.env.NODE_ENV === 'development') {
      console.log('An Error Ocurred:>>--------------------------------------------------')
      console.error(metadata)
      console.log('--------------------------------------------------')
    }
  }
}
