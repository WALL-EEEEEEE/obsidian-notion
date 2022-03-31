import {requestUrl}  from "obsidian"

export default class Notion  {
    token: string
    header: { "Authorization": string,  "Notion-Version": string} =  {
        "Authorization": "",
        "Notion-Version": ""
    }

    constructor(token: string, version = "2022-02-22") {
        const auth_token = `Bearer ${token}`;
        this.header["Authorization"] = auth_token
        this.header["Notion-Version"]  = version
    }

	async getAllDatabase() {
        const param = {filter: {property: `object`, value:`database`}}
		const RequestUrlParams = {url:'https://api.notion.com/v1/search', method:'POST', body: JSON.stringify(param), contentType: 'application/json', headers: this.header};
		const response = await requestUrl(RequestUrlParams)
		console.log(response)
	}
	async getAllPage() {
		const param = {filter: {property: `object`, value:`page`}}
		const RequestUrlParams = {url:'https://api.notion.com/v1/search', method:'POST', body: JSON.stringify(param), contentType: 'application/json', headers: this.header};
		const response = await requestUrl(RequestUrlParams)
		console.log(response)
	}

}
