const axios = require('axios');
const keys = require('../config/keys');

const payStackKey = keys.paystack.apiSecretKey;


// sends post request to paystack api
const PaymentHandler = async(id) => {
    try {
        const req = await axios.get(
          `https://api.paystack.co/transaction/${id}`,
          {
            headers: {
              Authorization: `Bearer ${payStackKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        return req.data;
      } catch (error) {
        const NetworkError = new Error('Error fetching from paystack', error.response ? error.response.data : error.message);
        NetworkError.code = 'NETWORK_ERROR'
        throw NetworkError
      }
      
}
module.exports = PaymentHandler;
