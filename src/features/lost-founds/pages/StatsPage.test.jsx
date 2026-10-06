import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import StatsPage from './StatsPage';

vi.mock('../api/lostFoundApi', () => ({
  default: {
    getStatsDaily: vi.fn().mockResolvedValue([
      { date: '2026-10-01', lost: 5, found: 2, total: 7 },
    ]),
    getStatsMonthly: vi.fn().mockResolvedValue([
      { month: 'Oktober', total_lost: 10, total_found: 4, total: 14 },
    ]),
  },
}));

describe('StatsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading states when data is null', () => {
    renderWithProviders(<StatsPage />, {
      preloadedState: {
        lostFoundStats: { daily: null, monthly: null },
      },
    });
    
    expect(screen.getByText('Memuat data Statistik Harian...')).toBeInTheDocument();
    expect(screen.getByText('Memuat data Statistik Bulanan...')).toBeInTheDocument();
  });

  it('renders stats tables with data', () => {
    renderWithProviders(<StatsPage />, {
      preloadedState: {
        lostFoundStats: {
          daily: [
            { date: '2026-10-01', lost: 5, found: 2, total: 7 },
          ],
          monthly: [
            { month: 'Oktober', total_lost: 10, total_found: 4, total: 14 },
          ],
        },
      },
    });

    // Check headings
    expect(screen.getByText('Statistik Harian')).toBeInTheDocument();
    expect(screen.getByText('Statistik Bulanan')).toBeInTheDocument();

    // Check daily data
    expect(screen.getByText('2026-10-01')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    // Check monthly data
    expect(screen.getByText('Oktober')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders empty message when array is empty', () => {
    renderWithProviders(<StatsPage />, {
      preloadedState: {
        lostFoundStats: {
          daily: [],
          monthly: [],
        },
      },
    });

    expect(screen.getByText('Belum ada data statistik harian.')).toBeInTheDocument();
    expect(screen.getByText('Belum ada data statistik bulanan.')).toBeInTheDocument();
  });

  it('renders fallback when data is an object instead of array', () => {
    renderWithProviders(<StatsPage />, {
      preloadedState: {
        lostFoundStats: {
          daily: { error: 'Unknown format' },
          monthly: { error: 'Unknown format' },
        },
      },
    });

    expect(screen.getAllByText(/Unknown format/)).toHaveLength(2);
  });

  it('handles variations of data fields and fallbacks', () => {
    renderWithProviders(<StatsPage />, {
      preloadedState: {
        lostFoundStats: {
          daily: [
            { period: 'Q1', lost: 5, found: 3 },
            { },
            { total_lost: 2, total_found: 4 }
          ],
          monthly: null,
        },
      },
    });

    expect(screen.getByText('Q1')).toBeInTheDocument();
    expect(screen.getByText('Periode 2')).toBeInTheDocument();
    expect(screen.getByText('Periode 3')).toBeInTheDocument();
  });
});
