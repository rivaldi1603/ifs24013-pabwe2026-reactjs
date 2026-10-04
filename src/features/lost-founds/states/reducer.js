import { ActionType } from './action';

function lostFoundsReducer(state = [], action = {}) {
  switch (action.type) {
    case ActionType.SET_LOST_FOUNDS:
      return action.payload.lostFounds;
    default:
      return state;
  }
}

function lostFoundReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_LOST_FOUND:
      return action.payload.lostFound;
    default:
      return state;
  }
}

function isLostFoundReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND:
      return action.payload.isLostFound;
    default:
      return state;
  }
}

function isLostFoundAddReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_ADD:
      return action.payload.isLostFoundAdd;
    default:
      return state;
  }
}

function isLostFoundAddedReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_ADDED:
      return action.payload.isLostFoundAdded;
    default:
      return state;
  }
}

function isLostFoundChangeReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGE:
      return action.payload.isLostFoundChange;
    default:
      return state;
  }
}

function isLostFoundChangedReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGED:
      return action.payload.isLostFoundChanged;
    default:
      return state;
  }
}

function isLostFoundChangeCoverReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGE_COVER:
      return action.payload.isLostFoundChangeCover;
    default:
      return state;
  }
}

function isLostFoundChangedCoverReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_CHANGED_COVER:
      return action.payload.isLostFoundChangedCover;
    default:
      return state;
  }
}

function isLostFoundDeleteReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_DELETE:
      return action.payload.isLostFoundDelete;
    default:
      return state;
  }
}

function isLostFoundDeletedReducer(state = false, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOST_FOUND_DELETED:
      return action.payload.isLostFoundDeleted;
    default:
      return state;
  }
}

function lostFoundStatsReducer(
  state = { daily: null, monthly: null },
  action = {}
) {
  switch (action.type) {
    case ActionType.SET_LOST_FOUND_STATS:
      return action.payload.lostFoundStats;
    default:
      return state;
  }
}

export {
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
};