import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Preferences } from './preferences.entity';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop({ default: () => ['100'] })
  roles: string[];

  @Prop({
    type: Preferences,
    default: () => ({
      currency: 'EUR',
      darkMode: false,
      language: 'es',
    }),
  })
  preferences: Preferences;
}

export const UserSchema = SchemaFactory.createForClass(User);
