const API_LOCATION="http://127.0.0.1:5000/api"

export const kzPost = (endpoint, jsonData)=>{
  const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData),
  };
  return fetch(API_LOCATION+"/"+endpoint,requestOptions).then(response => response.json());
}
