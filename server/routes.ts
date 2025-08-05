import type { Express } from "express";
import { createServer, type Server } from "http";
import { 
  salaryCalculationSchema, 
  severanceCalculationSchema, 
  leaveCalculationSchema,
  type SalaryResult,
  type SeveranceResult,
  type LeaveResult 
} from "@shared/schema";

// Korean tax rates and thresholds for 2024
const TAX_BRACKETS = [
  { min: 0, max: 14000000, rate: 0.06 },
  { min: 14000000, max: 50000000, rate: 0.15 },
  { min: 50000000, max: 88000000, rate: 0.24 },
  { min: 88000000, max: 150000000, rate: 0.35 },
  { min: 150000000, max: 300000000, rate: 0.38 },
  { min: 300000000, max: 500000000, rate: 0.40 },
  { min: 500000000, max: 1000000000, rate: 0.42 },
  { min: 1000000000, max: Infinity, rate: 0.45 }
];

function calculateIncomeTax(taxableIncome: number, dependents: number): number {
  // Basic deduction
  const basicDeduction = 1500000;
  // Dependent deduction (1.5M per person)
  const dependentDeduction = dependents * 1500000;
  
  const adjustedIncome = Math.max(0, taxableIncome - basicDeduction - dependentDeduction);
  
  let tax = 0;
  let remainingIncome = adjustedIncome;
  
  for (const bracket of TAX_BRACKETS) {
    if (remainingIncome <= 0) break;
    
    const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableAtThisBracket * bracket.rate;
    remainingIncome -= taxableAtThisBracket;
  }
  
  return Math.round(tax);
}

function calculateSalary(data: any): SalaryResult {
  const { annualSalary, dependents, mealAllowance = 0, transportAllowance = 0 } = data;
  
  const grossMonthlySalary = Math.round(annualSalary / 12);
  const nonTaxableAllowances = mealAllowance + transportAllowance;
  const taxableIncome = grossMonthlySalary - nonTaxableAllowances;
  
  // Calculate deductions
  const incomeTax = Math.round(calculateIncomeTax(annualSalary, dependents) / 12);
  const localTax = Math.round(incomeTax * 0.1); // 10% of income tax
  
  // Social insurance (based on total monthly salary)
  const nationalPension = Math.round(Math.min(grossMonthlySalary, 5530000) * 0.045); // 4.5% up to ceiling
  const healthInsurance = Math.round(grossMonthlySalary * 0.03545); // 3.545%
  const longTermCare = Math.round(healthInsurance * 0.1227); // 12.27% of health insurance
  const employmentInsurance = Math.round(grossMonthlySalary * 0.009); // 0.9%
  
  const totalDeductions = incomeTax + localTax + nationalPension + healthInsurance + longTermCare + employmentInsurance;
  const netMonthlySalary = grossMonthlySalary - totalDeductions;
  const netPercentage = Math.round((netMonthlySalary / grossMonthlySalary) * 1000) / 10;
  
  return {
    grossMonthlySalary,
    netMonthlySalary,
    incomeTax,
    localTax,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    totalDeductions,
    netPercentage
  };
}

function calculateSeverance(data: any): SeveranceResult {
  const { workYears, workMonths, averageWage } = data;
  
  const workPeriodYears = workYears + (workMonths / 12);
  const dailyWage = Math.round(averageWage / 30);
  const severanceAmount = Math.round(dailyWage * 30 * workPeriodYears);
  
  return {
    severanceAmount,
    dailyWage,
    workPeriodYears,
    calculationBasis: `${averageWage}원 × 30일 × ${workPeriodYears}년`
  };
}

function calculateLeave(data: any): LeaveResult {
  const { dailyWage, totalLeave, usedLeave } = data;
  
  const remainingDays = Math.max(0, totalLeave - usedLeave);
  const leaveAllowance = remainingDays * dailyWage;
  
  return {
    leaveAllowance,
    remainingDays,
    totalDays: totalLeave,
    usedDays: usedLeave,
    dailyWage
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/calculate-salary", (req, res) => {
    try {
      const data = salaryCalculationSchema.parse(req.body);
      const result = calculateSalary(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.post("/api/calculate-severance", (req, res) => {
    try {
      const data = severanceCalculationSchema.parse(req.body);
      const result = calculateSeverance(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.post("/api/calculate-leave", (req, res) => {
    try {
      const data = leaveCalculationSchema.parse(req.body);
      const result = calculateLeave(data);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
