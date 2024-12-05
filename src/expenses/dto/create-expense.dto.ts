import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsString()
  description: string;

  @IsEnum(['Food', 'Transport', 'Entertainment', 'Bills', 'Other'])
  category: 'Food' | 'Transport' | 'Entertainment' | 'Bills' | 'Other';

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(['Daily', 'Weekly', 'Monthly', 'Yearly'])
  recurrenceFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

  @IsOptional()
  @IsDate()
  recurrenceEndDate?: Date;
}
