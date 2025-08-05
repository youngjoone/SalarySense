import { useState } from "react";
import { Calculator, Handshake, CalendarCheck, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SalaryCalculator from "@/components/SalaryCalculator";
import SeveranceCalculator from "@/components/SeveranceCalculator";
import LeaveCalculator from "@/components/LeaveCalculator";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<"salary" | "severance" | "leave">("salary");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: "salary", label: "실급여 계산기", icon: Calculator },
    { id: "severance", label: "퇴직금 계산기", icon: Handshake },
    { id: "leave", label: "연차수당 계산기", icon: CalendarCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Calculator className="text-primary text-2xl" />
              <h1 className="text-2xl font-bold text-gray-900">급여계산기</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`text-gray-600 hover:text-primary transition-colors ${
                    activeTab === tab.id ? "text-primary" : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 mt-4 pt-4">
              <nav className="flex flex-col space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left p-2 rounded-md ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:text-primary hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            정확한 급여 계산을 위한 올인원 솔루션
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            실급여, 퇴직금, 연차수당을 정확하게 계산하여 재정 계획을 세우세요. 
            한국 노동법과 세법에 완전히 준수합니다.
          </p>
        </section>

        {/* Calculator Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "salary" && <SalaryCalculator />}
        {activeTab === "severance" && <SeveranceCalculator />}
        {activeTab === "leave" && <LeaveCalculator />}

        {/* Additional Information Section */}
        <section className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">이용 안내</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calculator className="text-primary text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">정확한 계산</h4>
              <p className="text-gray-600 text-sm">
                최신 한국 세법과 노동법을 반영한 정확한 계산 결과를 제공합니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Menu className="text-success text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">모바일 최적화</h4>
              <p className="text-gray-600 text-sm">
                PC와 모바일에서 모두 편리하게 이용할 수 있는 반응형 디자인입니다.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="text-warning text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">결과 저장</h4>
              <p className="text-gray-600 text-sm">
                계산 결과를 인쇄하거나 저장하여 나중에 참고할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Disclaimer */}
      <div className="mt-16 bg-yellow-50 border-l-4 border-yellow-400 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>안내사항:</strong> 본 계산 결과는 참고용이며, 실제 지급되는 금액과 차이가 있을 수 있습니다. 
                정확한 금액은 소속 회사의 급여 담당자나 세무 전문가에게 문의하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <Calculator className="text-primary text-2xl" />
                <h3 className="text-xl font-bold">급여계산기</h3>
              </div>
              <p className="text-gray-400 mb-4">
                직장인을 위한 정확하고 신뢰할 수 있는 급여 계산 서비스를 제공합니다.
              </p>
              <p className="text-sm text-gray-500">© 2024 급여계산기. 모든 권리 보유.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">실급여 계산</button></li>
                <li><button className="hover:text-white transition-colors">퇴직금 계산</button></li>
                <li><button className="hover:text-white transition-colors">연차수당 계산</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button className="hover:text-white transition-colors">이용안내</button></li>
                <li><button className="hover:text-white transition-colors">자주묻는질문</button></li>
                <li><button className="hover:text-white transition-colors">문의하기</button></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
