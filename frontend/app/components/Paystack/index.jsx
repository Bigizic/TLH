import Paystack from '@paystack/inline-js';
import axios from 'axios';

import { API_URL, PAYSTACK_KEY } from '../../constants';

export const payStackHelper = async (props) => {
  const {
    cart,
    user,
    guest,
    events,
    tickets,
    finalAmount,
    discountPrice,
    amountBeforeDiscount,
    paymentStatus,
    paymentMethod,
    transactionId,
    billingEmail,
  } = props;

  //console.log(cart, user, guest, events, tickets, finalAmount, discountPrice)

  return new Promise((resolve, reject) => {
    let globalId;
    const popup = new Paystack();
    
    popup.checkout({
      key: PAYSTACK_KEY,
      email: billingEmail,
      amount: finalAmount * 100,
      firstName: user.name.length > 0 ? user.name : guest.name,

      onLoad: async(response) => {
        try {
          // sends request to api to add an order
          const { id } = response;
          globalId = id
          await axios.post(`${API_URL}/order/add`, {
            cart,
            guest: guest._id || null,
            user: user._id || null,
            finalAmount,
            events,
            tickets,
            discountPrice,
            amountBeforeDiscount,
            payStackId: id,
            billingEmail,
          });
        } catch (error) {
          reject(new Error(`Payment failed: ${error.message}`));
        }
      },

      onSuccess: async(transaction) => {
        try {
          const { status, message, reference } = transaction;
          if (status === 'success' && message === 'Approved') {
            // send request to api to edit order as payment has been sucessful
            // api would be responsible for sending email to customer and admin
            const response = await axios.put(`${API_URL}/order/edit/order`, {
              payStackId: globalId,
              paystackReference: reference,
            });
            resolve(response);
          }
        } catch (error) {
          reject(new Error(`Payment failed: ${error.message}`));
        }
      },

      onElementMount: (elements) => {
      },

      onCancel: () => {
        reject(new Error('Payment cancelled.'));
      },

      onError: (error) => {
        reject(new Error(`Payment failed: ${error.message}`));
     }
    });
  });
};
