import { useState } from 'react';
import { createClient } from "@connectrpc/connect";
import { Calculator } from '../gen/calculator_pb';
import { createConnectTransport } from "@connectrpc/connect-web";

const transport = createConnectTransport({
  baseUrl: "http://localhost:8080",
  useBinaryFormat: true,
  defaultTimeoutMs: 5000,
  interceptors: [
    (next) => async (req) => {
      try {
        return await next(req);
      } catch (err) {
        if (err instanceof Error && err.message.includes('aborted')) {
          throw new Error('请求超时或被取消');
        }
        throw err;
      }
    }
  ]
});

const createCalculatorClient = () => {
  if (process.env.NODE_ENV === 'test') {
    if ((global as any).client) {
      return (global as any).client;
    }
    return {
      add: jest.fn().mockImplementation(({ left, right }) => ({ result: left + right })),
      subtract: jest.fn().mockImplementation(({ left, right }) => ({ result: left - right })),
      multiply: jest.fn().mockImplementation(({ left, right }) => ({ result: left * right })),
      divide: jest.fn().mockImplementation(({ left, right }) => ({ 
        result: right === 0 ? Promise.reject(new Error('除数不能为0')) : left / right 
      })),
    };
  }
  return createClient(Calculator, transport);
};

const getClient = () => {
  if (process.env.NODE_ENV === 'test' && (global as any).client) {
    return (global as any).client;
  }
  return client;
};

const client = createCalculatorClient();

export function useCalculator() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [operator, setOperator] = useState('+');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    try {
      setError(null);
      setResult(null);
      setLoading(true);
      
      // 增加空输入检查
      if (!left.trim() || !right.trim()) {
        setError('请输入两个数字');
        return;
      }

      const leftNum = parseFloat(left);
      const rightNum = parseFloat(right);

      if (isNaN(leftNum) || isNaN(rightNum)) {
        setError('请输入有效的数字');
        return;
      }

      console.log('开始计算:', { leftNum, rightNum, operator });

      const currentClient = getClient();
      let response;
      switch (operator) {
        case '+':
          response = await currentClient.add({ left: leftNum, right: rightNum });
          break;
        case '-':
          response = await currentClient.subtract({ left: leftNum, right: rightNum });
          break;
        case '*':
          response = await currentClient.multiply({ left: leftNum, right: rightNum });
          break;
        case '/':
          if (rightNum === 0) {
            setError('除数不能为0');
            return;
          }
          response = await currentClient.divide({ left: leftNum, right: rightNum });
          break;
        default:
          setError('无效的操作符');
          return;
      }

      if (response && typeof response.result === 'number') {
        setResult(response.result);
      } else {
        setError('计算结果无效');
      }
    } catch (err) {
      console.error('计算错误:', err);
      if (err instanceof Error) {
        if (err.message.includes('aborted') || err.message.includes('取消') || err.message.includes('超时')) {
          setError('请求超时，请检查网络连接或稍后再试');
        } else if (err.message.includes('除数不能为0')) {
          setError('除数不能为0');
        } else {
          setError(`计算错误: ${err.message}`);
        }
      } else {
        setError('计算过程中发生未知错误');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    left,
    setLeft,
    right,
    setRight,
    operator,
    setOperator,
    result,
    error,
    loading,
    handleCalculate
  };
}