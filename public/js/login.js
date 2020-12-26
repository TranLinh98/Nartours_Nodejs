import axios from 'axios';
import { showAlert } from './showAlert'

export const login = async (email, password) => {
    try {
        const res = await axios({
          method: 'POST',
          url: 'http://127.0.0.1:3000/api/v1/users/login',
          data: {
            email,
            password
          }
        });
    
        console.log(res);

        if (res.data.status === 'success') {
          showAlert('success', 'Logged in successfully!');
          window.setTimeout(() => {
            location.assign('/');
          }, 1000);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout'
    });
    console.log(res);
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
