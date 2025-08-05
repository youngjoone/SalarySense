import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CalendarCheck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { leaveCalculationSchema, type LeaveCalculation, type LeaveResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, parseCurrency } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

export default function LeaveCalculator() {
  const [result, setResult] = useState<LeaveResult | null>(null);
  const { toast } = useToast();

  const form = useForm<LeaveCalculation>({
    resolver: zodResolver(leaveCalculationSchema),
    defaultValues: {
      dailyWage: 0,
      totalLeave: 0,
      usedLeave: 0,
      resignationDate: "",
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: LeaveCalculation) => {
      const response = await apiRequest("POST", "/api/calculate-leave", data);
      return response.json() as Promise<LeaveResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "계산 완료",
        description: "연차수당 계산이 완료되었습니다.",
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

  const onSubmit = (data: LeaveCalculation) => {
    calculateMutation.mutate(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">연차수당 계산 정보</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="dailyWage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>일급여</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="150,000"
                          value={field.value ? formatCurrency(field.value) : ''}
                          onChange={(e) => {
                            const numericValue = parseCurrency(e.target.value);
                            field.onChange(numericValue);
                          }}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-3 text-gray-500 text-sm">원/일</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">월급여 ÷ 월 근무일수 (보통 22일)</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>연간 연차일수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="15"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usedLeave"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>사용한 연차일수</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="8"
                        min="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resignationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>퇴사 예정일</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-warning hover:bg-orange-600"
                disabled={calculateMutation.isPending}
              >
                <CalendarCheck className="w-4 h-4 mr-2" />
                {calculateMutation.isPending ? "계산 중..." : "연차수당 계산하기"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">연차수당 계산 결과</h3>
          
          {result ? (
            <>
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-warning to-orange-600 rounded-lg p-6 text-white mb-6">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2">연차수당</p>
                  <p className="text-3xl font-bold">{formatCurrency(result.leaveAllowance)} 원</p>
                  <p className="text-sm opacity-90 mt-2">
                    미사용 연차: {result.remainingDays}일
                  </p>
                </div>
              </div>

              {/* Calculation Details */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">연간 총 연차일수</span>
                    <span className="font-medium">{result.totalDays} 일</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">사용한 연차일수</span>
                    <span className="font-medium text-red-600">-{result.usedDays} 일</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-gray-200">
                    <span className="text-gray-600">미사용 연차일수</span>
                    <span className="font-medium text-success">{result.remainingDays} 일</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">일급여</span>
                    <span className="font-medium">{formatCurrency(result.dailyWage)} 원</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">계산 공식</h4>
                  <p className="text-sm text-gray-600">연차수당 = 미사용 연차일수 × 일급여</p>
                  <p className="text-sm text-gray-600">
                    = {result.remainingDays}일 × {formatCurrency(result.dailyWage)}원 = {formatCurrency(result.leaveAllowance)}원
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    연차수당 지급 기준
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• 근로기준법에 따라 미사용 연차에 대한 수당 지급 의무</li>
                    <li>• 퇴사일 기준으로 계산됩니다</li>
                    <li>• 회사 규정에 따라 지급 방식이 달라질 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <CalendarCheck className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                연차수당 계산 정보를 입력하고 계산하기 버튼을 눌러주세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
