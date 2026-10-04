import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useInput from './useInput';

describe('useInput hook', () => {
  it('should return initial value correctly', () => {
    const { result } = renderHook(() => useInput('initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('should update value correctly on change', () => {
    const { result } = renderHook(() => useInput(''));
    
    act(() => {
      // Simulate input event
      result.current[1]({ target: { value: 'new value' } });
    });
    
    expect(result.current[0]).toBe('new value');
  });

  it('should allow direct setting of value', () => {
    const { result } = renderHook(() => useInput(''));
    
    act(() => {
      // Direct setter
      result.current[2]('direct set');
    });
    
    expect(result.current[0]).toBe('direct set');
  });
});
