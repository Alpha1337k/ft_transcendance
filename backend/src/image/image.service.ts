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
/*   *.   image.service.ts         | Created: 2021-10-06 17:48:04    ._    */
/*  -     Edited on 2021-10-06 17:48:04 by alpha                      .-   */
/*  -* *- *- * -* -* -* ** - *-* -* * /  -* -*- * /- - -* --*-*++ * -* *   */
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