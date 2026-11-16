import { RemindersService } from "./reminders.service";
export declare class RemindersProcessor {
    private readonly remindersService;
    private readonly logger;
    constructor(remindersService: RemindersService);
    processReminders(): Promise<void>;
    expireOldReminders(): Promise<void>;
}
