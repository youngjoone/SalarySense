import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Handshake, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { severanceCalculationSchema, type SeveranceCalculation, type SeveranceResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, parseCurrency } from "@/lib/calculations";
import { useToast } from "@/hooks/use-toast";

export default function SeveranceCalculator() {
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const { toast } = useToast();

  const form = useForm<SeveranceCalculation>({
    resolver: zodResolver(severanceCalculationSchema),
    defaultValues: {
      workYears: 0,
      workMonths: 0,
      averageWage: 0,
      severanceType: "lump-sum",
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: SeveranceCalculation) => {
      const response = await apiRequest("POST", "/api/calculate-severance", data);
      return response.json() as Promise<SeveranceResult>;
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "계산 완료",
        description: "퇴직금 계산이 완료되었습니다.",
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

  const onSubmit = (data: SeveranceCalculation) => {
    calculateMutation.mutate(data);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">퇴직금 계산 정보</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <FormLabel>근무 기간</FormLabel>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <FormField
                    control={form.control}
                    name="workYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">년</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="3"
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
                    name="workMonths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-gray-600">개월</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="6"
                            min="0"
                            max="11"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="averageWage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>평균임금 (최근 3개월)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="4,500,000"
                          value={field.value ? formatCurrency(field.value) : ''}
                          onChange={(e) => {
                            const numericValue = parseCurrency(e.target.value);
                            field.onChange(numericValue);
                          }}
                          className="pr-12"
                        />
                        <span className="absolute right-3 top-3 text-gray-500 text-sm">원/월</span>
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500 mt-1">최근 3개월간 받은 임금의 평균을 입력하세요</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severanceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>퇴직금 제도</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lump-sum" id="lump-sum" />
                          <Label htmlFor="lump-sum" className="text-sm">퇴직금 일시지급</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pension" id="pension" />
                          <Label htmlFor="pension" className="text-sm">퇴직연금 (DC/DB)</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-success hover:bg-green-700"
                disabled={calculateMutation.isPending}
              >
                <Handshake className="w-4 h-4 mr-2" />
                {calculateMutation.isPending ? "계산 중..." : "퇴직금 계산하기"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">퇴직금 계산 결과</h3>
          
          {result ? (
            <>
              {/* Summary Card */}
              <div className="bg-gradient-to-r from-success to-green-600 rounded-lg p-6 text-white mb-6">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2">예상 퇴직금</p>
                  <p className="text-3xl font-bold">{formatCurrency(result.severanceAmount)} 원</p>
                  <p className="text-sm opacity-90 mt-2">
                    근무기간: {result.workPeriodYears}년
                  </p>
                </div>
              </div>

              {/* Calculation Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">계산 공식</h4>
                  <p className="text-sm text-gray-600 mb-2">퇴직금 = 평균임금 × 30일 × 근속년수</p>
                  <p className="text-sm text-gray-600">{result.calculationBasis}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">일평균임금</span>
                    <span className="font-medium">{formatCurrency(result.dailyWage)} 원</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">30일분 임금</span>
                    <span className="font-medium">{formatCurrency(result.dailyWage * 30)} 원</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">근속년수</span>
                    <span className="font-medium">{result.workPeriodYears} 년</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    알아두세요
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 계속근로기간이 1년 이상인 경우에만 퇴직금이 지급됩니다</li>
                    <li>• 퇴직소득세가 별도로 부과될 수 있습니다</li>
                    <li>• 실제 지급액은 회사 규정에 따라 달라질 수 있습니다</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Handshake className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                퇴직금 계산 정보를 입력하고 계산하기 버튼을 눌러주세요.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
