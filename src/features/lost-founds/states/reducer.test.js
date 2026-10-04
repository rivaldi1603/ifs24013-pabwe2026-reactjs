import { describe, it, expect } from 'vitest';
import {
  lostFoundsReducer,
  lostFoundReducer,
  isLostFoundReducer,
  isLostFoundAddReducer,
  isLostFoundAddedReducer,
  isLostFoundChangeReducer,
  isLostFoundChangedReducer,
  isLostFoundChangeCoverReducer,
  isLostFoundChangedCoverReducer,
  isLostFoundDeleteReducer,
  isLostFoundDeletedReducer,
  lostFoundStatsReducer,
} from './reducer';
import { ActionType } from './action';

describe('lostFoundReducers', () => {
  it('lostFoundsReducer', () => {
    expect(lostFoundsReducer(undefined, {})).toEqual([]);
    expect(lostFoundsReducer([], { type: ActionType.SET_LOST_FOUNDS, payload: { lostFounds: ['item'] } })).toEqual(['item']);
  });
  it('lostFoundReducer', () => {
    expect(lostFoundReducer(undefined, {})).toBeNull();
    expect(lostFoundReducer(null, { type: ActionType.SET_LOST_FOUND, payload: { lostFound: 'item' } })).toEqual('item');
  });
  it('isLostFoundReducer', () => {
    expect(isLostFoundReducer(undefined, {})).toBe(false);
    expect(isLostFoundReducer(false, { type: ActionType.SET_IS_LOST_FOUND, payload: { isLostFound: true } })).toBe(true);
  });
  it('isLostFoundAddReducer', () => {
    expect(isLostFoundAddReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddReducer(false, { type: ActionType.SET_IS_LOST_FOUND_ADD, payload: { isLostFoundAdd: true } })).toBe(true);
  });
  it('isLostFoundAddedReducer', () => {
    expect(isLostFoundAddedReducer(undefined, {})).toBe(false);
    expect(isLostFoundAddedReducer(false, { type: ActionType.SET_IS_LOST_FOUND_ADDED, payload: { isLostFoundAdded: true } })).toBe(true);
  });
  it('isLostFoundChangeReducer', () => {
    expect(isLostFoundChangeReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGE, payload: { isLostFoundChange: true } })).toBe(true);
  });
  it('isLostFoundChangedReducer', () => {
    expect(isLostFoundChangedReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGED, payload: { isLostFoundChanged: true } })).toBe(true);
  });
  it('isLostFoundChangeCoverReducer', () => {
    expect(isLostFoundChangeCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangeCoverReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER, payload: { isLostFoundChangeCover: true } })).toBe(true);
  });
  it('isLostFoundChangedCoverReducer', () => {
    expect(isLostFoundChangedCoverReducer(undefined, {})).toBe(false);
    expect(isLostFoundChangedCoverReducer(false, { type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER, payload: { isLostFoundChangedCover: true } })).toBe(true);
  });
  it('isLostFoundDeleteReducer', () => {
    expect(isLostFoundDeleteReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeleteReducer(false, { type: ActionType.SET_IS_LOST_FOUND_DELETE, payload: { isLostFoundDelete: true } })).toBe(true);
  });
  it('isLostFoundDeletedReducer', () => {
    expect(isLostFoundDeletedReducer(undefined, {})).toBe(false);
    expect(isLostFoundDeletedReducer(false, { type: ActionType.SET_IS_LOST_FOUND_DELETED, payload: { isLostFoundDeleted: true } })).toBe(true);
  });
  it('lostFoundStatsReducer', () => {
    expect(lostFoundStatsReducer(undefined, {})).toEqual({ daily: null, monthly: null });
    expect(lostFoundStatsReducer({ daily: null, monthly: null }, { type: ActionType.SET_LOST_FOUND_STATS, payload: { lostFoundStats: { daily: [], monthly: [] } } })).toEqual({ daily: [], monthly: [] });
  });
});
