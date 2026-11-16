export declare class CreateReminderDto {
    userId: string;
    source: string;
    destination: string;
    sourceCode?: string;
    destinationCode?: string;
    startDate: string;
    endDate?: string;
    targetPrice?: number;
    discountThreshold?: number;
}
