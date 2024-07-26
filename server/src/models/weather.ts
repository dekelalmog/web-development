export interface Weather {
    time: string[];
    temperature: { [key: string]: number };
}