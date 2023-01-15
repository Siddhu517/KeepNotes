import axios from "axios";
//const Url = "http://127.0.0.1:8000/keeper";

/* auth */
export const RegisterAPI = async (registerForm) => {
  try {
    return await axios.post(`/register`, registerForm);
  } catch (err) {
    console.log(err);
  }
};

export const LoginAPI = async (loginForm) => {
  try {
    return await axios.post(`/login`, loginForm);
  } catch (err) {
    console.log(err);
  }
};

export const VerifyEmailAndSendOTPAPI = async (email) => {
  try {
    return await axios.post(`/reset-password/send-otp`, { email });
  } catch (err) {
    console.log(err);
  }
};

export const VerifyOTPAPI = async (otp) => {
  try {
    return await axios.post(`/reset-password/verify-otp`, { otp });
  } catch (err) {
    console.log(err);
  }
};

export const ResetPassword = async (resetData) => {
  try {
    return await axios.put(`/reset-password`, resetData);
  } catch (err) {
    console.log(err);
  }
};

/* notes */

export const addNote = async (title, note) => {
  try {
    return await axios.post(`/add-note`, { title, note });
  } catch (err) {
    console.log(err);
  }
};

export const getNotes = async () => {
  try {
    return await axios.get(`/get-notes`);
  } catch (err) {
    console.log(err);
  }
};

export const updateNote = async (id, updateData) => {
  try {
    return await axios.put(`/update-note`, { id, updateData });
  } catch (err) {
    console.log(err);
  }
};

export const deleteNote = async (id) => {
  try {
    return await axios.put(`/delete-note`, { id });
  } catch (err) {
    console.log(err);
  }
};

export const deleteUser = async () => {
  try {
    return await axios.delete(`/delete-user`);
  } catch (err) {
    console.log(err);
  }
};
