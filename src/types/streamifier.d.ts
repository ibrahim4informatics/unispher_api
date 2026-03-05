declare module "streamifier" {
    import { Readable } from "stream";

    export function createReadStream(
        buffer: Buffer,
        options?: any
    ): Readable;
}