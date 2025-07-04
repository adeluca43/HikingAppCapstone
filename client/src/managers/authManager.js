const _apiUrl = "/api/auth";

export const login = (email, password) => {
  return fetch(_apiUrl + "/login", {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Basic ${btoa(`${email}:${password}`)}`,
    },
  }).then((res) => {
    if (res.status !== 200) {
      return Promise.resolve(null);
    } else {
      return tryGetLoggedInUser();
    }
  });
};

export const logout = () => {
  return fetch(_apiUrl + "/logout");
};

export const tryGetLoggedInUser = () => {
  return fetch(_apiUrl + "/me", {
    credentials: "include"
  }).then(async (res) => {
    if (!res.ok || res.status === 401 || res.status === 500) {
      return null;
    }

    const text = await res.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  });
};


export const register = (userProfile) => {
  return fetch(_apiUrl + "/register", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userProfile),
  }).then((res) => {
    if (res.ok) {
      return fetch(_apiUrl + "/me").then((res) => res.json());
    } else if (res.status === 400) {
      return res.json(); 
    } else {
      return Promise.resolve({ errors: ["Unknown registration error"] });
    }
  });
};

