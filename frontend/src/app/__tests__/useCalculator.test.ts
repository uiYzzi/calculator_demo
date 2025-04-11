import '@testing-library/jest-dom'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from '../useCalculator'

// Mock the client module
jest.mock('../../gen/calculator_pb', () => ({
  Calculator: {
    add: jest.fn(),
    subtract: jest.fn(),
    multiply: jest.fn(),
    divide: jest.fn(),
  }
}))

describe('useCalculator', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
    // Reset global client
    ;(global as any).client = undefined
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCalculator())
    
    expect(result.current.left).toBe('')
    expect(result.current.right).toBe('')
    expect(result.current.operator).toBe('+')
    expect(result.current.result).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  it('should update input values', () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.setLeft('1')
      result.current.setRight('2')
      result.current.setOperator('*')
    })
    
    expect(result.current.left).toBe('1')
    expect(result.current.right).toBe('2')
    expect(result.current.operator).toBe('*')
  })

  it('should handle empty input error', async () => {
    const { result } = renderHook(() => useCalculator())
    
    await act(async () => {
      await result.current.handleCalculate()
    })
    
    expect(result.current.error).toBe('请输入两个数字')
  })

  it('should handle invalid number error', async () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.setLeft('abc')
      result.current.setRight('def')
    })
    
    await act(async () => {
      await result.current.handleCalculate()
    })
    
    expect(result.current.error).toBe('请输入有效的数字')
  })

  it('should handle calculation success', async () => {
    const { result } = renderHook(() => useCalculator())
    
    // Mock the client response
    const mockResponse = { result: 3 }
    ;(global as any).client = {
      add: jest.fn().mockResolvedValue(mockResponse)
    }
    
    act(() => {
      result.current.setLeft('1')
      result.current.setRight('2')
      result.current.setOperator('+')
    })
    
    await act(async () => {
      await result.current.handleCalculate()
    })
    
    expect(result.current.result).toBe(3)
    expect(result.current.error).toBe(null)
  })

  it('should handle division by zero error', async () => {
    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.setLeft('1')
      result.current.setRight('0')
      result.current.setOperator('/')
    })
    
    await act(async () => {
      await result.current.handleCalculate()
    })
    
    expect(result.current.error).toBe('除数不能为0')
    expect(result.current.result).toBe(null)
  })

  it('should handle network error', async () => {
    // Set up global client before rendering hook
    const mockError = new Error('网络错误')
    ;(global as any).client = {
      add: jest.fn().mockRejectedValue(mockError),
      subtract: jest.fn().mockRejectedValue(mockError),
      multiply: jest.fn().mockRejectedValue(mockError),
      divide: jest.fn().mockRejectedValue(mockError)
    }

    const { result } = renderHook(() => useCalculator())
    
    act(() => {
      result.current.setLeft('1')
      result.current.setRight('2')
      result.current.setOperator('+')
    })
    
    await act(async () => {
      await result.current.handleCalculate()
    })
    
    expect(result.current.error).toBe('计算错误: 网络错误')
    expect(result.current.result).toBe(null)
  })
})