import { Singleton } from "./singleton";

@Singleton
export class Logger  {
  public info(message: string, ...meta: any[]): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...meta);
  }

  public error(message: string, ...meta: any[]): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...meta);
  }

  public warn(message: string, ...meta: any[]): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...meta);
  }

  public debug(message: string, ...meta: any[]): void {
    console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...meta);
  }
}