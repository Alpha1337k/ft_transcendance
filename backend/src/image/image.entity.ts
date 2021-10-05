import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class ImageEntity
{
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    image: string;
}