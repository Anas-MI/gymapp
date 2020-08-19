import * as actionTypes from "./actionTypes";
import * as API from "../../API";
import cuid from "cuid";

export const addNotification = (text, displayImage = null, type, data) => ({
  type: actionTypes.ADD_NOTIFICATION,
  payload: {
    notification: {
      id: cuid(),
      text,
      displayImage,
      read:false,
      type,
      data
    }
  },
});

export const readNotification = (id) => ({
  type: actionTypes.READ_NOTIFICATION,
  payload: {
    id
  },
});

export const syncNotifications = () => {
  return async (dispatch, getState) => {
    try {

    } catch (error) {
      console.log("sync notification failed", error);
      return false;
    }
  };
};
