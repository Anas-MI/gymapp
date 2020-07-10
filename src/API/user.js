import axios from "./config";
import {validateResponseCode} from "../utils/utils";

export const listUsers = async (url) => {
  try {
    let response = !!url ?
      await axios.get(url) :
      await axios.get('/users');
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const updateUserInfo = async (name, bio) => {

  try {
    let response = await axios.put('/user', {
      name,
      bio
    });
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getMyInfo = async () => {
  try {
    let response = await axios.get(`/user/myInfo`);
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getUserInfo = async (userId) => {
  try {
    let response = await axios.get(`/user/${userId}`);
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const getGlobalSlots = async () => {
  try {
    let response = await axios.get(`/slot/getAllAvailable`);
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const subscribeToPackage = async (trainerId, packageId, time, days) => {
  try {
    let response = await axios.post(`/subscription/${trainerId}/${packageId}`, {
      time,
      days
    });
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const sendPaymentData = async ({razorpay_order_id, razorpay_payment_id, razorpay_signature}) => {
  try {
    let response = await axios.put(`/subscription/updateTransaction`, {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });
    if (validateResponseCode(response.status)) {
      return response.success===true;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


export const bookAppointment = async (trainerId, day, time) => {
  try {
    let response = await axios.post(`/appointment/${trainerId}/book`, {
      day,
      time
    });
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const myAppointments = async () => {
  try {
    let response = await axios.get(`/appointment/myAppointments`);
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


export const recentActivity = async () => {
  try {
    let response = await axios.get(`/activity/recent`);
    if (validateResponseCode(response.status)) {
      return response.data;
    } else
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}