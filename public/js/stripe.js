import axios from 'axios';
import { showAlert } from './showAlert';
const stripe = Stripe('pk_test_51I2fYGKpTBadwjvwTw6sGihgTKCIqOENF1XQSq1y7vrABHQeobmNRIbotVMSGPbbyCmlEv3ENozDCKNQnhuYH7BM006nY33QkM');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};