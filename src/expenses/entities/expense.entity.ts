import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: String,
    enum: ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'],
    default: 'Other',
  })
  category: 'Food' | 'Transport' | 'Entertainment' | 'Bills' | 'Other';

  @Prop({ type: Date, default: () => new Date() })
  date: Date;

  @Prop({ type: Boolean, default: false })
  isRecurring: boolean;

  @Prop({
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    required: false,
  })
  recurrenceFrequency?: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

  @Prop({ type: Date, required: false })
  recurrenceEndDate?: Date;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
