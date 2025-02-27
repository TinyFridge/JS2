import "./css/style.css";

import "./js/api/auth/login.js";

import router from "./js/router";

await router(window.location.pathname);
