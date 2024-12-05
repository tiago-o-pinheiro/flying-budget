import { ExpensesService } from '@expenses/expenses.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private readonly expenseService: ExpensesService) {}

  @Cron('0 0 * * *')
  async handleRecurringExpenses() {
    console.log('Running recurring expense handler');
    await this.expenseService.processRecurringExpenses();
  }
}
