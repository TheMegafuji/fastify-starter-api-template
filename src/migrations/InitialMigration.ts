import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class InitialMigration implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "players",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "discordId",
                        type: "text",
                        isUnique: true,
                    },
                    {
                        name: "name",
                        type: "text",
                        isUnique: true,
                    },
                    {
                        name: "exp",
                        type: "int",
                    },
                    {
                        name: "gold",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "email",
                        type: "text",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "text",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("players");
    }
}
