class HandradiClient {
    constructor(options) {
        this.baseUrl = options.baseUrl
        this.externalUrl = options.externalUrl
        this.apiKey = options.apiKey
        this.clientId = options.clientId
    }

    async upload(file) {
        const url = new URL(this.baseUrl + "/upload")
        url.searchParams.set("client", this.clientId)
        url.searchParams.set("filename", file.filename)

        const resp = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "x-api-key": this.apiKey,
            },
            body: Buffer.from(file.content, "binary"),
        })

        if (!resp.ok) {
            throw new Error(`Upload failed: ${resp.status} ${await resp.text()}`)
        }

        return {
            url: `${this.externalUrl}/download?client=${this.clientId}&filename=${encodeURIComponent(file.filename)}`,
            key: file.filename
        }
    }

    async delete(fileKey) {
        const url = new URL(this.baseUrl + "/delete")
        url.searchParams.set("client", this.clientId)
        url.searchParams.set("filename", fileKey)

        const resp = await fetch(url.toString(), {
            method: "DELETE",
            headers: {
                "x-api-key": this.apiKey,
            },
        })

        if (!resp.ok) {
            throw new Error(`Delete failed: ${resp.status} ${await resp.text()}`)
        }
        return {}
    }

    async get(fileKey) {
        const url = new URL(this.baseUrl + "/download")
        url.searchParams.set("client", this.clientId)
        url.searchParams.set("filename", fileKey)

        const resp = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "x-api-key": this.apiKey,
            },
        })

        if (!resp.ok) {
            throw new Error(`Get failed: ${resp.status} ${await resp.text()}`)
        }

        return {
            stream: resp.body,
            buffer: resp.arrayBuffer(),
            url: url.toString(),
        }
    }

    async getPresignedUploadUrl(file) {
        const url = new URL(this.baseUrl + "/presignurl")
        url.searchParams.set("client", this.clientId)
        url.searchParams.set("filename", file.filename)

        const resp = await fetch(url.toString(), {
            method: "GET",
            headers: {
                "x-api-key": this.apiKey,
            },
        })

        if (!resp.ok) {
            throw new Error(`Get failed: ${resp.status} ${await resp.text()}`)
        }

        let value = await resp.json()

        return {
            url: `${this.baseUrl}${value.url}`,
            key: file.filename
        }        
    }
}   

export default HandradiClient
