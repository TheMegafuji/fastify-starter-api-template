import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("players")
export class PlayerEntity {
    @PrimaryGeneratedColumn({ type: "int" })
    id: number;

    @Column({ type: "text", unique: true })
    discordId: string;

    @Column({ type: "text", unique: true })
    name: string;

    @Column({ type: "int" })
    exp: number;

    @Column({ type: "int", default: 0 })
    gold: number;

    @Column({ type: "text", unique: true })
    email: string;

    @Column({ type: "text" })
    password: string;

    constructor() {
        if (!this.id) {
            this.id = 0;
        }
    }

    get level(): number {
        return Math.floor(this.exp / 100) + 1;
    }
}
