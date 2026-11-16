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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReminderDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateReminderDto {
}
exports.CreateReminderDto = CreateReminderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User ID" }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "New York", description: "Source city" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "source", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "London", description: "Destination city" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "JFK",
        description: "Source airport code",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "sourceCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "LHR",
        description: "Destination airport code",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "destinationCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2026-02-15",
        description: "Start date (YYYY-MM-DD)",
    }),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2026-02-22",
        description: "End date (YYYY-MM-DD)",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], CreateReminderDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 350,
        description: "Target price (optional, auto-calculated if omitted)",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateReminderDto.prototype, "targetPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 20,
        description: "Discount threshold % below average (default: 20)",
        required: false,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], CreateReminderDto.prototype, "discountThreshold", void 0);
//# sourceMappingURL=create-reminder.dto.js.map