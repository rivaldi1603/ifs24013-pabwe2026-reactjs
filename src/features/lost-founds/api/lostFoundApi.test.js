import { describe, it, expect, vi, beforeEach } from 'vitest';
import lostFoundApi from './lostFoundApi';
import apiHelper from '../../../helpers/apiHelper';

vi.mock('../../../helpers/apiHelper');

describe('lostFoundApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getLostFounds', () => {
    it('should return data on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: { lost_founds: ['item1'] } }),
      });
      const response = await lostFoundApi.getLostFounds({ status: 'lost', is_completed: '0', is_me: '1' });
      expect(response).toEqual(['item1']);
    });
    it('should handle missing data gracefully', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: {} }),
      });
      const response = await lostFoundApi.getLostFounds({});
      expect(response).toEqual([]);
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.getLostFounds()).rejects.toThrow('fail');
    });
  });

  describe('getLostFoundById', () => {
    it('should return data on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: { lost_found: 'item1' } }),
      });
      const response = await lostFoundApi.getLostFoundById('1');
      expect(response).toEqual('item1');
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.getLostFoundById('1')).rejects.toThrow('fail');
    });
  });

  describe('postLostFound', () => {
    it('should return data on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'success', data: 'item1' }),
      });
      const response = await lostFoundApi.postLostFound({ title: 't', description: 'd', status: 'lost' });
      expect(response).toEqual({ message: 'success', data: 'item1' });
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.postLostFound({ title: 't', description: 'd', status: 'lost' })).rejects.toThrow('fail');
    });
  });

  describe('putLostFound', () => {
    it('should return message on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'success' }),
      });
      const response = await lostFoundApi.putLostFound('1', { title: 't', description: 'd', status: 'lost', is_completed: false });
      expect(response).toEqual('success');
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.putLostFound('1', { title: 't', description: 'd', status: 'lost', is_completed: true })).rejects.toThrow('fail');
    });
  });

  describe('postLostFoundCover', () => {
    it('should return message on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'success' }),
      });
      const response = await lostFoundApi.postLostFoundCover('1', new File([''], 'cover.png'));
      expect(response).toEqual('success');
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.postLostFoundCover('1', new File([''], 'cover.png'))).rejects.toThrow('fail');
    });
  });

  describe('deleteLostFound', () => {
    it('should return message on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, message: 'success' }),
      });
      const response = await lostFoundApi.deleteLostFound('1');
      expect(response).toEqual('success');
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.deleteLostFound('1')).rejects.toThrow('fail');
    });
  });

  describe('getStatsDaily', () => {
    it('should return data on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: 'stats' }),
      });
      const response = await lostFoundApi.getStatsDaily({ end_date: '2022-01-01', total_data: '7' });
      expect(response).toEqual('stats');
    });
    it('should handle no params', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: 'stats' }),
      });
      const response = await lostFoundApi.getStatsDaily();
      expect(response).toEqual('stats');
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.getStatsDaily()).rejects.toThrow('fail');
    });
  });

  describe('getStatsMonthly', () => {
    it('should return data on success', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: 'stats' }),
      });
      const response = await lostFoundApi.getStatsMonthly({ end_date: '2022-01-01', total_data: '12' });
      expect(response).toEqual('stats');
    });
    it('should handle no params', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: true, data: 'stats' }),
      });
      const response = await lostFoundApi.getStatsMonthly();
      expect(response).toEqual('stats');
    });
    it('should throw error on fail', async () => {
      apiHelper.fetchWithAuth.mockResolvedValue({
        json: () => Promise.resolve({ success: false, message: 'fail' }),
      });
      await expect(lostFoundApi.getStatsMonthly()).rejects.toThrow('fail');
    });
  });
});
