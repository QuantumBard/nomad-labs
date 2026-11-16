import { IsString, IsOptional, IsNumber, IsISO8601, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchFlightsDto {
  @ApiProperty({ example: 'JFK', description: 'Origin airport code' })
  @IsString()
  origin: string;

  @ApiProperty({ example: 'LHR', description: 'Destination airport code' })
  @IsString()
  destination: string;

  @ApiProperty({ example: '2026-02-15', description: 'Departure date (YYYY-MM-DD)' })
  @IsISO8601()
  departureDate: string;

  @ApiProperty({ example: '2026-02-22', description: 'Return date (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsISO8601()
  returnDate?: string;

  @ApiProperty({ example: 1, description: 'Number of adults', required: false })
  @IsOptional()
  @IsNumber()
  adults?: number;

  @ApiProperty({ example: 'USD', description: 'Currency code', required: false })
  @IsOptional()
  @IsString()
  @IsIn(['USD', 'EUR', 'GBP', 'JPY'])
  currency?: string;
}
