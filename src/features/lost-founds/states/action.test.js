import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ActionType,
  setLostFoundsActionCreator,
  setLostFoundActionCreator,
  setIsLostFoundActionCreator,
  setIsLostFoundAddActionCreator,
  setIsLostFoundAddedActionCreator,
  setIsLostFoundChangeActionCreator,
  setIsLostFoundChangedActionCreator,
  setIsLostFoundChangeCoverActionCreator,
  setIsLostFoundChangedCoverActionCreator,
  setIsLostFoundDeleteActionCreator,
  setIsLostFoundDeletedActionCreator,
  setLostFoundStatsActionCreator,
  asyncSetLostFounds,
  asyncSetLostFoundById,
  asyncPostLostFound,
  asyncPutLostFound,
  asyncPostLostFoundCover,
  asyncDeleteLostFound,
  asyncSetLostFoundStats,
} from './action';
import lostFoundApi from '../api/lostFoundApi';
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper';

vi.mock('../api/lostFoundApi');
vi.mock('../../../helpers/toolsHelper', () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

describe('LostFound Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Action Creators', () => {
    it('setLostFoundsActionCreator', () => {
      expect(setLostFoundsActionCreator([{ id: 1 }])).toEqual({
        type: ActionType.SET_LOST_FOUNDS,
        payload: { lostFounds: [{ id: 1 }] },
      });
    });
    it('setLostFoundActionCreator', () => {
      expect(setLostFoundActionCreator({ id: 1 })).toEqual({
        type: ActionType.SET_LOST_FOUND,
        payload: { lostFound: { id: 1 } },
      });
    });
    it('setIsLostFoundActionCreator', () => {
      expect(setIsLostFoundActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND,
        payload: { isLostFound: true },
      });
    });
    it('setIsLostFoundAddActionCreator', () => {
      expect(setIsLostFoundAddActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_ADD,
        payload: { isLostFoundAdd: true },
      });
    });
    it('setIsLostFoundAddedActionCreator', () => {
      expect(setIsLostFoundAddedActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_ADDED,
        payload: { isLostFoundAdded: true },
      });
    });
    it('setIsLostFoundChangeActionCreator', () => {
      expect(setIsLostFoundChangeActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_CHANGE,
        payload: { isLostFoundChange: true },
      });
    });
    it('setIsLostFoundChangedActionCreator', () => {
      expect(setIsLostFoundChangedActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_CHANGED,
        payload: { isLostFoundChanged: true },
      });
    });
    it('setIsLostFoundChangeCoverActionCreator', () => {
      expect(setIsLostFoundChangeCoverActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
        payload: { isLostFoundChangeCover: true },
      });
    });
    it('setIsLostFoundChangedCoverActionCreator', () => {
      expect(setIsLostFoundChangedCoverActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
        payload: { isLostFoundChangedCover: true },
      });
    });
    it('setIsLostFoundDeleteActionCreator', () => {
      expect(setIsLostFoundDeleteActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_DELETE,
        payload: { isLostFoundDelete: true },
      });
    });
    it('setIsLostFoundDeletedActionCreator', () => {
      expect(setIsLostFoundDeletedActionCreator(true)).toEqual({
        type: ActionType.SET_IS_LOST_FOUND_DELETED,
        payload: { isLostFoundDeleted: true },
      });
    });
    it('setLostFoundStatsActionCreator', () => {
      expect(setLostFoundStatsActionCreator({ daily: [] })).toEqual({
        type: ActionType.SET_LOST_FOUND_STATS,
        payload: { lostFoundStats: { daily: [] } },
      });
    });
  });

  describe('Thunks', () => {
    it('asyncSetLostFounds success', async () => {
      const dispatch = vi.fn();
      lostFoundApi.getLostFounds.mockResolvedValue([{ id: 1 }]);
      await asyncSetLostFounds()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator([{ id: 1 }]));
    });
    it('asyncSetLostFounds failure', async () => {
      const dispatch = vi.fn();
      lostFoundApi.getLostFounds.mockRejectedValue(new Error('err'));
      await asyncSetLostFounds()(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setLostFoundsActionCreator([]));
    });

    it('asyncSetLostFoundById success', async () => {
      const dispatch = vi.fn();
      lostFoundApi.getLostFoundById.mockResolvedValue({ id: 1 });
      await asyncSetLostFoundById(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundActionCreator(false));
      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator({ id: 1 }));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundActionCreator(true));
    });
    it('asyncSetLostFoundById failure', async () => {
      const dispatch = vi.fn();
      lostFoundApi.getLostFoundById.mockRejectedValue(new Error('err'));
      await asyncSetLostFoundById(1)(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setLostFoundActionCreator(null));
    });

    it('asyncPostLostFound success', async () => {
      const dispatch = vi.fn();
      lostFoundApi.postLostFound.mockResolvedValue({ message: 'ok' });
      await asyncPostLostFound({ title: 't', description: 'd', status: 's' })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddActionCreator(true));
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddActionCreator(false));
    });
    it('asyncPostLostFound failure', async () => {
      const dispatch = vi.fn();
      lostFoundApi.postLostFound.mockRejectedValue(new Error('err'));
      await asyncPostLostFound({ title: 't', description: 'd', status: 's' })(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundAddedActionCreator(false));
    });

    it('asyncPutLostFound success', async () => {
      const dispatch = vi.fn();
      lostFoundApi.putLostFound.mockResolvedValue('ok');
      await asyncPutLostFound(1, { title: 't', description: 'd', status: 's', is_completed: true })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeActionCreator(true));
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeActionCreator(false));
    });
    it('asyncPutLostFound failure', async () => {
      const dispatch = vi.fn();
      lostFoundApi.putLostFound.mockRejectedValue(new Error('err'));
      await asyncPutLostFound(1, { title: 't' })(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedActionCreator(false));
    });

    it('asyncPostLostFoundCover success', async () => {
      const dispatch = vi.fn();
      lostFoundApi.postLostFoundCover.mockResolvedValue('ok');
      await asyncPostLostFoundCover(1, 'cover')(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeCoverActionCreator(true));
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangeCoverActionCreator(false));
    });
    it('asyncPostLostFoundCover failure', async () => {
      const dispatch = vi.fn();
      lostFoundApi.postLostFoundCover.mockRejectedValue(new Error('err'));
      await asyncPostLostFoundCover(1, 'cover')(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundChangedCoverActionCreator(false));
    });

    it('asyncDeleteLostFound success', async () => {
      const dispatch = vi.fn();
      lostFoundApi.deleteLostFound.mockResolvedValue('ok');
      await asyncDeleteLostFound(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeleteActionCreator(true));
      expect(showSuccessDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(true));
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeleteActionCreator(false));
    });
    it('asyncDeleteLostFound failure', async () => {
      const dispatch = vi.fn();
      lostFoundApi.deleteLostFound.mockRejectedValue(new Error('err'));
      await asyncDeleteLostFound(1)(dispatch);
      expect(showErrorDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(setIsLostFoundDeletedActionCreator(false));
    });

    it('asyncSetLostFoundStats success', async () => {
      const dispatch = vi.fn();
      lostFoundApi.getStatsDaily.mockResolvedValue(['d']);
      lostFoundApi.getStatsMonthly.mockResolvedValue(['m']);
      await asyncSetLostFoundStats()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setLostFoundStatsActionCreator({ daily: ['d'], monthly: ['m'] }));
    });
    it('asyncSetLostFoundStats failure', async () => {
      const dispatch = vi.fn();
      lostFoundApi.getStatsDaily.mockRejectedValue(new Error('err'));
      lostFoundApi.getStatsMonthly.mockResolvedValue(['m']); // One failure makes Promise.all fail
      await asyncSetLostFoundStats()(dispatch);
      expect(dispatch).toHaveBeenCalledWith(setLostFoundStatsActionCreator({ daily: null, monthly: null }));
    });
  });
});
