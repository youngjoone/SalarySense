import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Calculator, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { salaryCalculationSchema, type SalaryCalculation, type SalaryResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, parseCurrency, formatCurrencyInput } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

export default function SalaryCalculator() {
  const [result, setResult] = useState<SalaryResult | null>(null);
  const { toast } = useToast();

  const form = useForm<SalaryCalculation>({
    resolver: zodResolver(salaryCalculationSchema),
    defaultValues: {
      annualSalary: 0,
      dependents: 0,
      mealAllowance: 0,
      transportAllowance: 0,
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: SalaryCalculation) => {
      const response = await apiRequest("POST", "/api/calculate-salary", data);
      return response.json() as Promise<SalaryResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "계산 완료",
        description: "실급여 계산이 완료되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "계산 오류",
        description: "계산 중 오류가 발생했습니다. 입력값을 확인해주세요.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SalaryCalculation) => {
    calculateMutation.mutate(data);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">급여 정보 입력</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="annualSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연봉 (세전)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="50,000,000"
                          value={field.value ? formatCurrency(field.value) : ''}
                          onChange={(e) => {
                            const numericValue = parseCurrency(e.target.value);
                            field.onChange(numericValue);
                          }}
                          className="pr-8"
                        />
                        <span className="absolute right-3 top-3 text-gray-500 text-sm">원</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dependents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>부양가족 수</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="부양가족 수를 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">0명</SelectItem>
                        <SelectItem value="1">1명</SelectItem>
                        <SelectItem value="2">2명</SelectItem>
                        <SelectItem value="3">3명</SelectItem>
                        <SelectItem value="4">4명 이상</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>비과세 항목</FormLabel>
                
                <FormField
                  control={form.control}
                  name="mealAllowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">식대</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="100,000"
                            value={field.value ? formatCurrency(field.value) : ''}
                            onChange={(e) => {
                              const numericValue = parseCurrency(e.target.value);
                              field.onChange(numericValue);
                            }}
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-2 text-gray-500 text-sm">원/월</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transportAllowance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">교통비</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="100,000"
                            value={field.value ? formatCurrency(field.value) : ''}
                            onChange={(e) => {
                              const numericValue = parseCurrency(e.target.value);
                              field.onChange(numericValue);
                            }}
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-2 text-gray-500 text-sm">원/월</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={calculateMutation.isPending}
              >
                <Calculator className="w-4 h-4 mr-2" />
                {calculateMutation.isPending ? "계산 중..." : "실급여 계산하기"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">계산 결과</h3>
          
          {result ? (
            <>
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-primary to-blue-600 rounded-lg p-6 text-white mb-6">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2">월 실급여</p>
                  <p className="text-3xl font-bold">{formatCurrency(result.netMonthlySalary)} 원</p>
                  <p className="text-sm opacity-90 mt-2">
                    연봉 대비 {result.netPercentage}%
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">월 총급여</span>
                  <span className="font-medium">{formatCurrency(result.grossMonthlySalary)} 원</span>
                </div>
                
                <div className="text-sm text-gray-700 font-medium mb-2">공제 항목</div>
                
                <div className="pl-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">소득세</span>
                    <span className="text-red-600">-{formatCurrency(result.incomeTax)} 원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">지방소득세</span>
                    <span className="text-red-600">-{formatCurrency(result.localTax)} 원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">국민연금</span>
                    <span className="text-red-600">-{formatCurrency(result.nationalPension)} 원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">건강보험</span>
                    <span className="text-red-600">-{formatCurrency(result.healthInsurance)} 원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">장기요양보험</span>
                    <span className="text-red-600">-{formatCurrency(result.longTermCare)} 원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">고용보험</span>
                    <span className="text-red-600">-{formatCurrency(result.employmentInsurance)} 원</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t border-gray-200 font-medium">
                  <span>총 공제액</span>
                  <span className="text-red-600">-{formatCurrency(result.totalDeductions)} 원</span>
                </div>
              </div>

              <Button
                onClick={handlePrint}
                variant="outline"
                className="w-full mt-6"
              >
                <Printer className="w-4 h-4 mr-2" />
                결과 인쇄하기
              </Button>
            </>
          ) : (
            <div className="text-center py-12">
              <Calculator className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                급여 정보를 입력하고 계산하기 버튼을 눌러주세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
