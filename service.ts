import { Logger, FileTypes } from "@medusajs/framework/types"
import { AbstractFileProviderService } from "@medusajs/framework/utils"
import HandradiClient from "./HandradiClient/Client.js"

type InjectedDependencies = {
    logger: Logger
}

type Options = {
    baseUrl: string
    externalUrl: string
    apiKey: string
    clientId: string
}

class HandradiFileProviderService extends AbstractFileProviderService {
    protected logger_: Logger
    protected options_: Options
    static identifier = "handradi-file"
    // assuming you're initializing a client
    protected client

    constructor (
        { logger }: InjectedDependencies,
        options: Options
    ) {
        super()

        this.logger_ = logger
        this.options_ = options

        this.client = new HandradiClient(options)
    }

    async upload(
        file: FileTypes.ProviderUploadFileDTO
    ): Promise<FileTypes.ProviderFileResultDTO> {      
        let fileUrlAndKey
        try {
            fileUrlAndKey = await this.client.upload(file)
            this.logger_.info(`Handradi: upload -> ${fileUrlAndKey.key} : ${fileUrlAndKey.url}`)
        } catch (error) {
            this.logger_.error(error)
            throw error
        }
      
        return fileUrlAndKey
    }

    async delete(
        files: FileTypes.ProviderDeleteFileDTO | FileTypes.ProviderDeleteFileDTO[]
    ): Promise<void> {
        const fileArray = Array.isArray(files) ? files : [files]
        this.logger_.info(`Handradi: delete files -> ${fileArray}`)
        for (const file of fileArray) {
            this.logger_.info(`Handradi: delete file -> ${file.fileKey}`)
            await this.client.delete(file.fileKey)
        }
    }

    async getAsBuffer(file: FileTypes.ProviderDeleteFileDTO): Promise<Buffer> {
        this.logger_.info(`Handradi: buffer -> ${file.fileKey}`)
        return this.client.get(file.fileKey).stream
    }

    async getDownloadStream(
        file: FileTypes.ProviderGetFileDTO
    ): Promise<Readable> {
        this.logger_.info(`Handradi: stream -> ${file.fileKey}`)
        return this.client.get(file.fileKey).stream
    }

    
    async getPresignedDownloadUrl(
        file: FileTypes.ProviderGetFileDTO
    ): Promise<string> {
        this.logger_.info(`Handradi: presigned url -> ${file.fileKey}`)
        let url = this.client.get(file.fileKey).url
        return url
    }

    async getPresignedUploadUrl(
        file: FileTypes.ProviderGetPresignedUploadUrlDTO
    ): Promise<FileTypes.ProviderFileResultDTO> {
        return this.client.getPresignedUploadUrl(file)
    } 

}

export default HandradiFileProviderService