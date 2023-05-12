export const fetchUrlAuth = 'https://auth.nomoreparties.co';

// получаем json, если ответ пришел
function checkResponse (res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
}
  
export const register = (email, password) => {
  return fetch(`${fetchUrlAuth}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password})
  })
  .then(res => checkResponse(res)) 
}

export const login = (email, password) => {
  return fetch(`${fetchUrlAuth}/signin`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password}) 
  })
  .then(res => checkResponse(res))
  .then((data) => {
    if (data.token){
      const token = data.token;
      localStorage.setItem('jwt', token);
      return token;
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
  .then(res => checkResponse(res))
  .then(data => data)
}