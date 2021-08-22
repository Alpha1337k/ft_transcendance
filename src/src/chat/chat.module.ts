import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { ChatController } from "./chat.controller";


@Module({
	imports: [
		DatabaseModule
	],
	controllers: [
		ChatController
	]
})
export class ChatModule {}