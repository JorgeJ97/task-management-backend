import type { ApiResponse, PaginatedResponse } from "../dto/task.dto";

export class ApiResponseFactory {
  static success(data:any, message = 'Success', statusCode = 200): ApiResponse {
    return {
      success: true,
      message,
      data,
      statusCode
    };
  }

  static error(message = 'Error', statusCode = 500, error:string): ApiResponse {
    return {
      success: false,
      message,
      error,
      statusCode
    };
  }

  static paginated(data:any , pagination:any, message = 'Success', statusCode= 200) : PaginatedResponse {
    return {
      success: true,
      message,
      data,
      statusCode,
      pagination
    };
  }
}