import { Controller, Get, Param, Res } from "@nestjs/common";
import { ImageService } from "./image.service";

@Controller('img')
export class ImageController {
    constructor (private imageService: ImageService) {}

    @Get(':id')
    async getImage(@Param() params, @Res() res) {
        const img =  await this.imageService.getImg(params.id as number);
        const buffer = Buffer.from(img, 'base64');
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(buffer);
    }
}