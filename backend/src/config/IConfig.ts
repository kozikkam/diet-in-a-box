export interface IConfig {
    PORT: number;
    DB_URL: string;
    JWT_SECRET: string;
    API_PREFIX: string;
    PRODUCT_INTEGRATIONS_URL: string;

    loadConfiguration(): void;
}
