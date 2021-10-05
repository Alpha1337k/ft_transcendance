import { Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ImageEntity } from "./image.entity";


@Injectable()
export class ImageService {
    constructor (
        @Inject('IMAGE_REPOSITORY')
        private imageRepo: Repository<ImageEntity>,
    ) {}

    async getImg(id: number): Promise<string> {
        const img = await this.imageRepo.findOne(id);
        if (img === undefined || img === null)
            return "";
        return img.image;
    }

    async addImg(img: string): Promise<string> {
        const n = new ImageEntity();

        n.image = img;

        const id = (await this.imageRepo.save(n)).id;

        console.log("Added image", "/img/" + id);

    
        return "/img/" + id;
    }
}