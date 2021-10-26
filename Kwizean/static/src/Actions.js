//In a production environment, this would obviously be different
const API_LOCATION="http://127.0.0.1:5000/api"

export const ADMIN_OP = true;

export const setUserInfo=(userId, token) =>{
  const kzStorage = window.sessionStorage;
  kzStorage.setItem("userId",userId);
  kzStorage.setItem("userToken",token);
}

export const getUserInfo=() =>{
  const kzStorage = window.sessionStorage;
  const userId=kzStorage.getItem("userId");
  const userToken=kzStorage.getItem("userToken");
  return {userId,userToken};
}

export const clearUserInfo=() =>{
  sessionStorage.clear();
}

const genHeaders=(includeAuth) =>{
  const {userId,userToken}=getUserInfo();
  const toReturn = {
        'Content-Type': 'application/json'
  };
  if (includeAuth && userId!=null && userToken!=null){
      toReturn['Authorization']="Basic "+btoa(+userId+":"+userToken)
  }
  return toReturn;
}

/** These are utility functions which perform GET and POST requests **/

export const kzPost = (endpoint, jsonData, includeAuth=false, method="POST")=>{
  const headers=genHeaders(includeAuth);
  const requestOptions = {
          method: method,
          headers: headers,
          body: JSON.stringify(jsonData),
  };
  return fetch(API_LOCATION+"/"+endpoint,requestOptions).then(response => response.json());
}

export const kzGet = (endpoint, includeAuth=false) =>{
  const headers=genHeaders(includeAuth);
  const requestOptions ={
    method: 'GET',
    headers: headers,
  }
  return fetch(API_LOCATION+"/"+endpoint,requestOptions).then(response => response.json());
}
