import API from "../api/axios";

export const logout = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  try {
    await API.post("users/logout/", { refresh: refresh_token });
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.clear();
    window.location.href = "/login";
  }
};
