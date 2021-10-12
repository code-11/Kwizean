//In a production environment, this would obviously be different
const API_LOCATION="http://127.0.0.1:5000/api"

/** These are utility functions which perform GET and POST requests **/

export const kzPost = (endpoint, jsonData)=>{
  const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
  };
  return fetch(API_LOCATION+"/"+endpoint,requestOptions).then(response => response.json());
}

export const kzGet = (endpoint) =>{
  const requestOptions ={
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  }
  return fetch(API_LOCATION+"/"+endpoint,requestOptions).then(response => response.json());
}
