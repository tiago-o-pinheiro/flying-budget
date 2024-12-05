import { Optional } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';

export class Preferences {
  @Prop({ type: String, enum: ['EUR', 'USD', 'BRL'], default: 'EUR' })
  @Optional()
  currency?: 'EUR' | 'USD' | 'BRL';

  @Prop({ type: Boolean, default: false })
  @Optional()
  darkMode?: boolean;

  @Prop({ type: String, enum: ['en', 'pt', 'es'], default: 'es' })
  @Optional()
  language?: 'en' | 'pt' | 'es';
}
