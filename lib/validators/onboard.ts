import { z } from 'zod';

export const Step1Schema = z.object({
  given_name: z.string().min(1, 'Required'),
  middle_name: z.string().optional(),
  family_name: z.string().min(1, 'Required'),
  company: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const Step2Schema = z.object({
  goal: z.string().min(1, 'Please select a goal'),
});

export const Step3Schema = z.object({
  title: z.string().min(1, 'Workspace name is required'),
});
