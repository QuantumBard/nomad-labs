"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemindersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reminders_service_1 = require("./reminders.service");
const create_reminder_dto_1 = require("./dto/create-reminder.dto");
let RemindersController = class RemindersController {
    constructor(remindersService) {
        this.remindersService = remindersService;
    }
    async getUserReminders(userId) {
        return this.remindersService.getUserReminders(userId);
    }
    async createReminder(createDto) {
        return this.remindersService.createReminder(createDto);
    }
    async deleteReminder(id, userId) {
        return this.remindersService.deleteReminder(id, userId);
    }
    async checkReminderPrice(id) {
        return this.remindersService.checkReminderPrice(id);
    }
};
exports.RemindersController = RemindersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reminders for a user' }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "getUserReminders", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new flight price reminder' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reminder_dto_1.CreateReminderDto]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "createReminder", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a reminder' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "deleteReminder", null);
__decorate([
    (0, common_1.Post)(':id/check'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually check reminder price' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RemindersController.prototype, "checkReminderPrice", null);
exports.RemindersController = RemindersController = __decorate([
    (0, swagger_1.ApiTags)('Reminders'),
    (0, common_1.Controller)('reminders'),
    __metadata("design:paramtypes", [reminders_service_1.RemindersService])
], RemindersController);
//# sourceMappingURL=reminders.controller.js.map