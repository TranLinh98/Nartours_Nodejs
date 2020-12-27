import axios from 'axios';
import { showAlert } from './showAlert'

export const login = async (email, password) => {
    try {
        const res = await axios({
          method: 'POST',
          url: '/api/v1/users/login',
          data: {
            email,
            password
          }
        });
    
        //console.log(res);

        if (res.data.status === 'success') {
          showAlert('success', 'Logged in successfully!');
          window.setTimeout(() => {
            location.assign('/');
          }, 500);
        }
      } catch (err) {
        showAlert('error', err.response.data.message);
      }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    
    if ((res.data.status = 'success')) {
      showAlert('success', 'Logged out successfully!');
          window.setTimeout(() => {
            location.assign('/login');
          }, 500);
        }
  } catch (err) {
    //console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};
