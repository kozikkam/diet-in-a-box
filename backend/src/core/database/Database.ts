import { injectable } from "inversify";
import { Connection, createConnection } from "mongoose";
import { IConfig } from "../../config/IConfig";
import { ILogger } from "../logger/ILogger";
import { IDatabase } from "./IDatabase";

@injectable()
class Database implements IDatabase {

    private _connection: Connection;

    constructor(
        private readonly _config: IConfig,
        private readonly _logger: ILogger,
    ) { }

    public async getConnection(): Promise<Connection> {
        if (!this._connection) {
            this._connection = await this.connect();
        }
        return this._connection;
    }

    private async connect(): Promise<Connection> {
        try {
            const connection: Connection = await createConnection(
                this._config.DB_URL,
                {
                    keepAlive: true,
                    reconnectTries: Number.MAX_VALUE,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            connection.on("error", (error) => {
                this.handleError(error);
            });

            return connection;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: string): void {
        this._logger.error(`Error connecting to database: ${JSON.stringify(error)}`);
    }
}

let dbInstance: Database;

export default (
    config: IConfig,
    logger: ILogger,
) => {
    if (!dbInstance) {
        dbInstance = new Database(config, logger);
    }
    return dbInstance;
};
