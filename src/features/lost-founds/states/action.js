import lostFoundApi from '../api/lostFoundApi';
import { showErrorDialog, showSuccessDialog } from '../../../helpers/toolsHelper';

const ActionType = {
  SET_LOST_FOUNDS: 'SET_LOST_FOUNDS',
  SET_LOST_FOUND: 'SET_LOST_FOUND',
  SET_IS_LOST_FOUND: 'SET_IS_LOST_FOUND',
  SET_IS_LOST_FOUND_ADD: 'SET_IS_LOST_FOUND_ADD',
  SET_IS_LOST_FOUND_ADDED: 'SET_IS_LOST_FOUND_ADDED',
  SET_IS_LOST_FOUND_CHANGE: 'SET_IS_LOST_FOUND_CHANGE',
  SET_IS_LOST_FOUND_CHANGED: 'SET_IS_LOST_FOUND_CHANGED',
  SET_IS_LOST_FOUND_CHANGE_COVER: 'SET_IS_LOST_FOUND_CHANGE_COVER',
  SET_IS_LOST_FOUND_CHANGED_COVER: 'SET_IS_LOST_FOUND_CHANGED_COVER',
  SET_IS_LOST_FOUND_DELETE: 'SET_IS_LOST_FOUND_DELETE',
  SET_IS_LOST_FOUND_DELETED: 'SET_IS_LOST_FOUND_DELETED',
  SET_LOST_FOUND_STATS: 'SET_LOST_FOUND_STATS',
};

function setLostFoundsActionCreator(lostFounds) {
  return {
    type: ActionType.SET_LOST_FOUNDS,
    payload: { lostFounds },
  };
}

function setLostFoundActionCreator(lostFound) {
  return {
    type: ActionType.SET_LOST_FOUND,
    payload: { lostFound },
  };
}

function setIsLostFoundActionCreator(isLostFound) {
  return {
    type: ActionType.SET_IS_LOST_FOUND,
    payload: { isLostFound },
  };
}

function setIsLostFoundAddActionCreator(isLostFoundAdd) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADD,
    payload: { isLostFoundAdd },
  };
}

function setIsLostFoundAddedActionCreator(isLostFoundAdded) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_ADDED,
    payload: { isLostFoundAdded },
  };
}

function setIsLostFoundChangeActionCreator(isLostFoundChange) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE,
    payload: { isLostFoundChange },
  };
}

function setIsLostFoundChangedActionCreator(isLostFoundChanged) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED,
    payload: { isLostFoundChanged },
  };
}

function setIsLostFoundChangeCoverActionCreator(isLostFoundChangeCover) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGE_COVER,
    payload: { isLostFoundChangeCover },
  };
}

function setIsLostFoundChangedCoverActionCreator(isLostFoundChangedCover) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_CHANGED_COVER,
    payload: { isLostFoundChangedCover },
  };
}

function setIsLostFoundDeleteActionCreator(isLostFoundDelete) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETE,
    payload: { isLostFoundDelete },
  };
}

function setIsLostFoundDeletedActionCreator(isLostFoundDeleted) {
  return {
    type: ActionType.SET_IS_LOST_FOUND_DELETED,
    payload: { isLostFoundDeleted },
  };
}

function setLostFoundStatsActionCreator(lostFoundStats) {
  return {
    type: ActionType.SET_LOST_FOUND_STATS,
    payload: { lostFoundStats },
  };
}

function asyncSetLostFounds(params = {}) {
  return async (dispatch) => {
    try {
      const lostFounds = await lostFoundApi.getLostFounds(params);
      dispatch(setLostFoundsActionCreator(lostFounds));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Memuat Data', error.message);
      dispatch(setLostFoundsActionCreator([]));
    }
  };
}

function asyncSetLostFoundById(lostFoundId) {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(false));
    try {
      const lostFound = await lostFoundApi.getLostFoundById(lostFoundId);
      dispatch(setLostFoundActionCreator(lostFound));
      dispatch(setIsLostFoundActionCreator(true));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Memuat Detail', error.message);
      dispatch(setLostFoundActionCreator(null));
      dispatch(setIsLostFoundActionCreator(true));
    }
  };
}

function asyncPostLostFound({ title, description, status }) {
  return async (dispatch) => {
    dispatch(setIsLostFoundAddActionCreator(true));
    try {
      const { message } = await lostFoundApi.postLostFound({
        title,
        description,
        status,
      });
      await showSuccessDialog('Berhasil', message);
      dispatch(setIsLostFoundAddedActionCreator(true));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Menambahkan Laporan', error.message);
      dispatch(setIsLostFoundAddedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundAddActionCreator(false));
    }
  };
}

function asyncPutLostFound(
  lostFoundId,
  { title, description, status, is_completed }
) {
  return async (dispatch) => {
    dispatch(setIsLostFoundChangeActionCreator(true));
    try {
      const message = await lostFoundApi.putLostFound(lostFoundId, {
        title,
        description,
        status,
        is_completed,
      });
      await showSuccessDialog('Berhasil', message);
      dispatch(setIsLostFoundChangedActionCreator(true));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Memperbarui Laporan', error.message);
      dispatch(setIsLostFoundChangedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundChangeActionCreator(false));
    }
  };
}

function asyncPostLostFoundCover(lostFoundId, cover) {
  return async (dispatch) => {
    dispatch(setIsLostFoundChangeCoverActionCreator(true));
    try {
      const message = await lostFoundApi.postLostFoundCover(lostFoundId, cover);
      await showSuccessDialog('Berhasil', message);
      dispatch(setIsLostFoundChangedCoverActionCreator(true));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Mengunggah Cover', error.message);
      dispatch(setIsLostFoundChangedCoverActionCreator(false));
    } finally {
      dispatch(setIsLostFoundChangeCoverActionCreator(false));
    }
  };
}

function asyncDeleteLostFound(lostFoundId) {
  return async (dispatch) => {
    dispatch(setIsLostFoundDeleteActionCreator(true));
    try {
      const message = await lostFoundApi.deleteLostFound(lostFoundId);
      await showSuccessDialog('Berhasil', message);
      dispatch(setIsLostFoundDeletedActionCreator(true));
    } catch (error) {
      console.error(error);
      await showErrorDialog('Gagal Menghapus Laporan', error.message);
      dispatch(setIsLostFoundDeletedActionCreator(false));
    } finally {
      dispatch(setIsLostFoundDeleteActionCreator(false));
    }
  };
}

function asyncSetLostFoundStats(params = {}) {
  return async (dispatch) => {
    try {
      const [daily, monthly] = await Promise.all([
        lostFoundApi.getStatsDaily(params),
        lostFoundApi.getStatsMonthly(params),
      ]);
      dispatch(setLostFoundStatsActionCreator({ daily, monthly }));
    } catch (error) {
      console.error(error);
      dispatch(setLostFoundStatsActionCreator({ daily: null, monthly: null }));
    }
  };
}

export {
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
};