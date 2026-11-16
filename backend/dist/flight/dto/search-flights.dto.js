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
exports.SearchFlightsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SearchFlightsDto {
}
exports.SearchFlightsDto = SearchFlightsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'JFK', description: 'Origin airport code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "origin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'LHR', description: 'Destination airport code' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "destination", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-15', description: 'Departure date (YYYY-MM-DD)' }),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "departureDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-02-22', description: 'Return date (YYYY-MM-DD)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)(),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "returnDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Number of adults', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SearchFlightsDto.prototype, "adults", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'USD', description: 'Currency code', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['USD', 'EUR', 'GBP', 'JPY']),
    __metadata("design:type", String)
], SearchFlightsDto.prototype, "currency", void 0);
//# sourceMappingURL=search-flights.dto.js.map