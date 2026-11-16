import {
  IsString,
  IsOptional,
  IsNumber,
  IsISO8601,
  IsUUID,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateReminderDto {
  @ApiProperty({ description: "User ID" })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: "New York", description: "Source city" })
  @IsString()
  source: string;

  @ApiProperty({ example: "London", description: "Destination city" })
  @IsString()
  destination: string;

  @ApiProperty({
    example: "JFK",
    description: "Source airport code",
    required: false,
  })
  @IsOptional()
  @IsString()
  sourceCode?: string;

  @ApiProperty({
    example: "LHR",
    description: "Destination airport code",
    required: false,
  })
  @IsOptional()
  @IsString()
  destinationCode?: string;

  @ApiProperty({
    example: "2026-02-15",
    description: "Start date (YYYY-MM-DD)",
  })
  @IsISO8601()
  startDate: string;

  @ApiProperty({
    example: "2026-02-22",
    description: "End date (YYYY-MM-DD)",
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiProperty({
    example: 350,
    description: "Target price (optional, auto-calculated if omitted)",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  targetPrice?: number;

  @ApiProperty({
    example: 20,
    description: "Discount threshold % below average (default: 20)",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(90)
  discountThreshold?: number;
}
