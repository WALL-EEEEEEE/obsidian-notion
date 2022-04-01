import {requestUrl}  from "obsidian"
import { isNullOrUndefined } from "util"

export interface Database {
    id: string
    title: string
    properties: {}
}

export interface Page {
}

export class Notion  {
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
    construct_database_from_list(databases: {id: string, title: {plain_text: string}[], properties: {}}[]): Database[] {
        let dbs: Database[] = []
        for( const database of databases) {
            if ( database.title == undefined || database.title == null || database.title.length < 1) {
                continue
            }
            const db_title = (database.title[0]).plain_text || ''
            console.log(db_title)
            dbs.push({title: db_title, id: database.id, properties: database.properties})
        }
        return dbs
    }

    construct_page_from_list(pages: []): Page {
        return
    }

	async getAllDatabase(): Promise<Database[]> {
        const param = {filter: {property: `object`, value:`database`}}
		const RequestUrlParams = {url:'https://api.notion.com/v1/search', method:'POST', body: JSON.stringify(param), contentType: 'application/json', headers: this.header};
		const response = await requestUrl(RequestUrlParams)
        const resp_data = response.json
        if (resp_data == undefined || resp_data == null) {
            return []
        }
        const databases_list = resp_data.results || []
        if (!databases_list) {
            return databases_list
        }
        return this.construct_database_from_list(databases_list)
	}
	async getAllPage(): Promise<Page> {
		const param = {filter: {property: `object`, value:`page`}}
		const RequestUrlParams = {url:'https://api.notion.com/v1/search', method:'POST', body: JSON.stringify(param), contentType: 'application/json', headers: this.header};
		const response = await requestUrl(RequestUrlParams)
        return
		//console.log(response)
	}

}

