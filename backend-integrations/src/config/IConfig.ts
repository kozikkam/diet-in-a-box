export interface IConfig {
    PORT: number;
    EDAMAM_ID: string;
    EDAMAM_KEY: string;
    NUTRITIONIX_ID: string;
    NUTRITIONIX_KEY: string;

    loadConfiguration(): void;
}
