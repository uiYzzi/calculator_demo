"use client";

import { useCalculator } from "./useCalculator";

export default function CalculatorPage() {
  const {
    left,
    setLeft,
    right,
    setRight,
    operator,
    setOperator,
    result,
    error,
    loading,
    handleCalculate,
  } = useCalculator();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-sm w-96 border border-gray-100">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">计算器</h1>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="number"
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all w-4"
              placeholder="数字1"
              disabled={loading}
            />

            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
              disabled={loading}
            >
              <option value="+">+</option>
              <option value="-">-</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>

            <input
              type="number"
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all w-4"
              placeholder="数字2"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleCalculate}
            className={`w-full p-3 rounded-lg ${
              loading
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
            } text-white font-medium transition-all`}
            disabled={loading}
          >
            {loading ? "计算中..." : "计算"}
          </button>

          {error && (
            <div data-testid="error" className="text-red-600 text-center p-3 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {result !== null && !error && (
            <div data-testid="result" className="text-center text-xl font-semibold p-3 bg-blue-50 rounded-lg border border-blue-100 text-blue-700">
              结果: {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
