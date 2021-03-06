/*  * -*  *- *- *- *- *- *- * * ** -* -* -* - *- *- *-* - ** - *- - * *-   */
/*  *       _                                 _                        +\  */
/*   -     | |_ ___ ___ ___ ___ ___ ___ ___ _| |___ ___ ___ ___       +    */
/*   +     |  _|  _| .'|   |_ -|  _| -_|   | . | -_|   |  _| -_|       /*  */
/*  *      |_| |_| |__,|_|_|___|___|___|_|_|___|___|_|_|___|___|         + */
/*  -       ~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~--~        *  */
/*  *       Oscar Kruithof   |   okruitho    |   Alpha_1337k           *-  */
/*  -*      Robijn van Houts |   rvan-hou    |   robijnvh             -+   */
/*  * /   Jonas Bennink Bolt |   jbennink    |   JonasDBB            /-    */
/*  /       Tim van Citters  |   tvan-cit    |   Tjobo-Hero           *    */
/*   +      Rene Braaksma    |   rbraaksm    |   rbraaksm              -   */
/*    *.                                                              ._   */
/*   *.   chat.service.ts          | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChatEntity, ChatMessage } from './chat.entity';

export class IncomingChatMessage {
	userid: number;
	chatid: string;
	message: string;
}

@Injectable()
export class ChatService {
	constructor(
		@Inject('CHAT_REPOSITORY')
		private ChatRepository: Repository<ChatEntity>
	) {}

	async getChat(id: string): Promise<string> {
		let chat: ChatEntity = await this.ChatRepository.findOne({ chatid: id });
		if (chat == undefined || chat == null) {
			console.log('no chat found! creating new one');
			let newchat = new ChatEntity();
			newchat.chatid = id;
			newchat.private = true;
			newchat.usernames = ['John', 'Jeff'];
			this.ChatRepository.save(newchat).then(() => {
				console.log('----- saved a chat!');
			});
			chat = newchat;
		}
		console.log("Chat messages:", chat);
		let messages: string = '';
		for (let i = 0; chat.messages != null && i < chat.messages.length; i++) {
			messages += `<div class="chatmessagebox">
							<h5>${chat.messages[i].sender}</h5>
							<p>${chat.messages[i].message}</p>
						</div>`;
		}
		return `
				<div class="chat-window">
				<div class="chat-head">
					<h4>${chat.usernames[0]}</h4>
					<div>
					<a onclick="minimizeChat(this)">_</a>
					<a onclick="removeChat(this)">X</a>
					</div>
				</div>
				<div class="messagebox">
					${messages}
				</div>
				<div class="dialogbox">
					<input type="text" name="messagesend" autocomplete="off" id="mshh">
					<button onclick="messagesend()">Send</button>
				</div>
			</div>
				`;
	}

	async getChatMessages(id:string): Promise<string> {
		let chat: ChatEntity = await this.ChatRepository.findOne({ chatid: id });
		let messages: string = '';
		if (chat === null || chat === undefined)
		{
			let newchat = new ChatEntity();
			newchat.chatid = id;
			newchat.private = true;
			newchat.usernames = ['John', 'Jeff'];
			this.ChatRepository.save(newchat).then(() => {
				console.log('gcm ----- saved a chat!');
			});
			return '';			
		}
		if (chat.messages === null || chat.messages === undefined)
			return '';
		return JSON.stringify(chat.messages);
	}

	async getAllChats() {
		return JSON.stringify(await this.ChatRepository.find());
	}

	async addMessage(msg: IncomingChatMessage) {
		const chat: ChatEntity = await this.ChatRepository.findOne({
			chatid: msg.chatid,
		});
		const newmsg: ChatMessage = new ChatMessage(msg.message, chat);

		await this.ChatRepository.manager.save(newmsg);
		console.log(chat);

		return newmsg;
	}
}
