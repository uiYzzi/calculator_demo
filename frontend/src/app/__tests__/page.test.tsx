import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CalculatorPage from '../page'

describe('Calculator Page', () => {
  it('renders calculator components', () => {
    render(<CalculatorPage />)
    
    expect(screen.getByText('计算器')).toBeInTheDocument()
    
    expect(screen.getByPlaceholderText('数字1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('数字2')).toBeInTheDocument()
    
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.getByText('×')).toBeInTheDocument()
    expect(screen.getByText('÷')).toBeInTheDocument()
    
    expect(screen.getByText('计算')).toBeInTheDocument()
  })
  
  it('performs basic calculation', async () => {
    render(<CalculatorPage />)
    
    const num1Input = screen.getByPlaceholderText('数字1')
    const num2Input = screen.getByPlaceholderText('数字2')
    
    fireEvent.change(num1Input, { target: { value: '1' } })
    fireEvent.change(num2Input, { target: { value: '2' } })
    
    const calculateButton = screen.getByText('计算')
    fireEvent.click(calculateButton)
    
    await waitFor(() => {
      const resultElement = screen.getByTestId('result')
      expect(resultElement).toHaveTextContent('结果: 3')
    })
  })
  
  it('handles division by zero', async () => {
    render(<CalculatorPage />)
    
    const num1Input = screen.getByPlaceholderText('数字1')
    const num2Input = screen.getByPlaceholderText('数字2')
    const operatorSelect = screen.getByRole('combobox')
    
    fireEvent.change(num1Input, { target: { value: '1' } })
    fireEvent.change(num2Input, { target: { value: '0' } })
    fireEvent.change(operatorSelect, { target: { value: '/' } })
    
    const calculateButton = screen.getByText('计算')
    fireEvent.click(calculateButton)
    
    await waitFor(() => {
      const errorElement = screen.getByTestId('error')
      expect(errorElement).toHaveTextContent('除数不能为0')
    })
  })
}) 