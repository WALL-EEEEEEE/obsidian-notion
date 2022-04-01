import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, SuggestModal} from 'obsidian';
import { addIcon } from 'obsidian';
import { Notion, Database, Page }  from "notion";


// Remember to rename these classes and interfaces!

interface NotionSettings {
	token: string;
}

const DEFAULT_SETTINGS: NotionSettings = {
	token: ''
}


export default class NotionPlugin extends Plugin {
	settings: NotionSettings;
	notion: Notion;

	async onload() {
		console.log("Load Notion.")
		await this.loadSettings();
		await this.initNotion()
		addIcon('Notion', `<svg width="100%" height="100%" viewBox="0 0 25 20" role="img" xmlns="http://www.w3.org/2000/svg"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"/></svg>`);
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('Notion', 'Notion', async (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new DatabaseSelectModal(this.app, this.notion).open()
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Notion');

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new NotionSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}


	async saveSettings() {
		await this.saveData(this.settings);
	}

	async initNotion() {
		if (this.notion)
		   return 
		this.notion = new Notion(this.settings.token)
	}
}

class DatabaseSelectModal extends SuggestModal<Database>{
	notion: Notion

	getSuggestions(query: string): Database[] | Promise<Database[]> {
		return this.notion.getAllDatabase()
	}
	renderSuggestion(value: Database, el: HTMLElement) {
		el.appendText(value.title)
	}
	onChooseSuggestion(item: Database, evt: MouseEvent | KeyboardEvent) {
		throw new Error('Method not implemented.');
	}
	constructor(app: App, notion: Notion) {
		super(app);
		this.notion = notion
	}

}

class PageSelectModal extends SuggestModal<Page> {
	getSuggestions(query: string): Page[] | Promise<Page[]> {
		throw new Error('Method not implemented.');
	}
	renderSuggestion(value: Page, el: HTMLElement) {
		throw new Error('Method not implemented.');
	}
	onChooseSuggestion(item: Page, evt: MouseEvent | KeyboardEvent) {
		throw new Error('Method not implemented.');
	}
	constructor(app: App) {
		super(app);
	}
}

class NotionSettingTab extends PluginSettingTab {
	plugin: NotionPlugin;

	constructor(app: App, plugin: NotionPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('token')
			.setDesc('token of your Notion account')
			.addText(text => text
				.setPlaceholder('Enter your notion token')
				.setValue(this.plugin.settings.token)
				.onChange(async (value) => {
					this.plugin.settings.token = value;
					await this.plugin.saveSettings();
				}));
	}
}
