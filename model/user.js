
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: {
        type:Number,
        default:0
}});

module.exports = mongoose.model('User', userSchema);

const baseUrl = 'http://localhost:3001'; // Replace with your actual server URL
const loginUrl = `${baseUrl}/login`;


// Include the fetch API or an HTTP library like Axios
fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: 'valid', user_password: 'password' })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === 'Login successful') {
      // Access the auth cookie from browser storage (https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
      const authCookie = document.cookie.split('; ').find(c => c.startsWith('authHeader='));
      if (authCookie) {
        // Send the auth cookie in future requests (adjust based on your authorization header requirements)
        fetch('/protected-resource', {
          headers: {
            Authorization: authCookie.split('=')[1]
          }
        })
        .then(response => response.json())
        .then(data => {
          console.log(data); // Access protected resource data
        })
        .catch(error => {
          console.error(error);
        });
      } else {
        console.error('Failed to retrieve auth cookie');
      }
    } else {
      console.error(data.message);
    }
  })
  .catch(error => {
    console.error(error);
  });
  