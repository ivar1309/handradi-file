import { Logger, FileTypes } from "@medusajs/framework/types"
import { AbstractFileProviderService } from "@medusajs/framework/utils"
import { HandradiClient } from "./HandradiClient/Client.js"

type InjectedDependencies = {
    logger: Logger
}

type Options = {
    baseUrl: string
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
        for (const file of fileArray) {
            this.client.delete(file.fileKey)
        }
    }

    async getAsBuffer(file: FileTypes.ProviderDeleteFileDTO): Promise<Buffer> {
        return this.client.get(file.fileKey).stream
    }

    async getDownloadStream(
        file: FileTypes.ProviderGetFileDTO
    ): Promise<Readable> {
        return this.client.get(file.fileKey).stream
    }

    
    async getPresignedDownloadUrl(
        file: FileTypes.ProviderGetFileDTO
    ): Promise<string> {
        return this.client.get(file.fileKey).url
    }
}

export default HandradiFileProviderService