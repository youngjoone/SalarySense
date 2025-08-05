import { z } from "zod";

export const salaryCalculationSchema = z.object({
  annualSalary: z.number().min(0),
  dependents: z.number().min(0).max(10),
  mealAllowance: z.number().min(0).optional().default(0),
  transportAllowance: z.number().min(0).optional().default(0),
});

export const severanceCalculationSchema = z.object({
  workYears: z.number().min(0),
  workMonths: z.number().min(0).max(11),
  averageWage: z.number().min(0),
  severanceType: z.enum(["lump-sum", "pension"]),
});

export const leaveCalculationSchema = z.object({
  dailyWage: z.number().min(0),
  totalLeave: z.number().min(0),
  usedLeave: z.number().min(0),
  resignationDate: z.string(),
});

export type SalaryCalculation = z.infer<typeof salaryCalculationSchema>;
export type SeveranceCalculation = z.infer<typeof severanceCalculationSchema>;
export type LeaveCalculation = z.infer<typeof leaveCalculationSchema>;

export interface SalaryResult {
  grossMonthlySalary: number;
  netMonthlySalary: number;
  incomeTax: number;
  localTax: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  totalDeductions: number;
  netPercentage: number;
}

export interface SeveranceResult {
  severanceAmount: number;
  dailyWage: number;
  workPeriodYears: number;
  calculationBasis: string;
}

export interface LeaveResult {
  leaveAllowance: number;
  remainingDays: number;
  totalDays: number;
  usedDays: number;
  dailyWage: number;
}
