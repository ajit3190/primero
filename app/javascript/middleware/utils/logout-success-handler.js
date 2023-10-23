export default () => {
  const returnUrl = localStorage.getItem("returnUrl");

  window.localStorage.clear();
  window.sessionStorage.clear();

  if (returnUrl) {
    localStorage.setItem("returnUrl");
  }
};
