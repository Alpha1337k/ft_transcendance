import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ChatEntity, ChatMessage } from "./chat.entity";

export class IncomingChatMessage {
	userid: number;
	chatid: string;
	message: string;
}

@Injectable()
export class ChatService {
	constructor(
		@Inject('CHAT_REPOSITORY')
		private ChatRepository: Repository<ChatEntity>,
	) {}

	async getChat(id : string): Promise<string>
	{
		console.log("id:", id);
		let chat : ChatEntity = await this.ChatRepository.findOne({chatid : id});
		if (chat == undefined || chat == null)
		{
			console.log("no chat found! creating new one");
			let newchat = new ChatEntity();
			newchat.chatid = id;
			this.ChatRepository.save(newchat).then(() => {console.log("----- saved a chat!")});
			chat = newchat;
		}
		return `
				<div class="chat-window">
				<div class="chat-head">
					<h4>${chat.chatid}</h4>
					<div>
					<a onclick="minimizeChat(this)">_</a>
					<a onclick="removeChat(this)">X</a>
					</div>
				</div>
				<div class="messagebox">
					this is the beginning of your chat!
				</div>
				<hr>
				<div class="dialogbox">
					<input type="text" name="messagesend" id="mshh">
					<button onclick="messagesend()">Send</button>
				</div>
			</div>
				`
	}

	async getAllChats()
	{
		return JSON.stringify(await this.ChatRepository.find());
	}

	async addMessage(msg : IncomingChatMessage)
	{
		let chat : ChatEntity = await this.ChatRepository.findOne({chatid : msg.chatid});
		let newmsg : ChatMessage = new ChatMessage(msg.message, msg.userid);
		if (chat.messages != null)
		{
		chat.messages.push(newmsg);
		this.ChatRepository.save(chat);
		}
		return newmsg;
	}
}