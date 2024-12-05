import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private readonly expenseModel: Model<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    try {
      const newExpense = await this.expenseModel.create(createExpenseDto);
      return newExpense;
    } catch (error) {
      throw new NotFoundException('Expense creation failed');
    }
  }

  async findAll(userId: string): Promise<Expense[]> {
    try {
      const expenses = await this.expenseModel
        .find({ userId })
        .sort({ date: -1 })
        .select('-__v');
      if (!expenses || expenses.length === 0) {
        throw new NotFoundException('No expenses found for this user');
      }
      return expenses;
    } catch (error) {
      throw new NotFoundException('No expenses found for this user');
    }
  }

  async findOne(id: string): Promise<Expense> {
    try {
      const expense = await this.expenseModel.findById(id).select('-__v');
      if (!expense) throw new NotFoundException('Expense not found');
      return expense;
    } catch (error) {
      throw new NotFoundException('Expense not found');
    }
  }

  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    try {
      const updatedExpense = await this.expenseModel
        .findByIdAndUpdate(id, { $set: updateExpenseDto }, { new: true })
        .select('-__v');
      if (!updatedExpense) throw new NotFoundException('Expense not found');
      return updatedExpense;
    } catch (error) {
      throw new NotFoundException('Expense not found or update failed');
    }
  }

  async remove(id: string): Promise<Expense> {
    try {
      const result = await this.expenseModel
        .findByIdAndDelete(id)
        .select('-__v');
      if (!result) throw new NotFoundException('Expense not found');
      return result;
    } catch (error) {
      throw new NotFoundException('Expense not found');
    }
  }

  async processRecurringExpenses() {
    const recurringExpenses = await this.expenseModel.find({
      isRecurring: true,
      $or: [
        { recurrenceEndDate: { $exists: false } },
        { recurrenceEndDate: { $gte: new Date() } },
      ],
    });

    for (const expense of recurringExpenses) {
      const nextDate = this.calculateNextDate(
        expense.date,
        expense.recurrenceFrequency,
      );
      if (nextDate <= new Date()) {
        await this.create({
          ...expense.toObject(),
          date: nextDate,
        });
      }
    }
  }

  private calculateNextDate(date: Date, frequency: string): Date {
    const newDate = new Date(date);
    switch (frequency) {
      case 'Daily':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'Weekly':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'Monthly':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'Yearly':
        newDate.setFullYear(newDate.getFullYear() + 1);
        break;
    }
    return newDate;
  }
}
