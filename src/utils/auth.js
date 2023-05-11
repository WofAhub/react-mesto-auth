export const fetchUrlAuth = 'https://auth.nomoreparties.co';  
  
export const register = (email, password) => {
  return fetch(`${fetchUrlAuth}/signup`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password})
  })
  .then((response) => {
    return response.json();
  })
  .then((res) => {
    return res;
  })
  .catch((err) => console.log(err));
};

export const login = (email, password) => {
  return fetch(`${fetchUrlAuth}/signin`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password}) 
  })
  .then((response => response.json()))
  .then((data) => {
    if (data.user){
      localStorage.setItem('jwt', data.jwt);
      return data;
    }
  })
  .catch(err => console.log(err))
};

export const checkToken = (token) => {
  return fetch(`$(fetchUrlAuth)/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(this._getJson)
  .then(data => data)
}