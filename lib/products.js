const axios = require('axios');
const AwsV4Signer = require('./awsv4signer.js')

const SPAPI_EP = 'https://sellingpartnerapi-fe.amazon.com'

const postProducts = async (asin, payload, token) => {
  const req_url = SPAPI_EP + `/products/fees/v0/items/${asin}/feesEstimate`

  // 署名を作成
  const signer = new AwsV4Signer({
    method: 'POST',
    url: req_url,
    payload: payload,
  })
  signer.sign()

  try {
    const res = await axios({
      method: 'POST',
      url: req_url,
      headers: {
        host: signer.hostname,
        'content-type': 'application/json',
        'x-amz-date': signer.x_amz_date,
        Authorization: signer.authHeader,
        'x-amz-access-token': token,
      },
      data : payload,
    })
    console.log('Success to get');
    return res.data
  } catch (e) {
    /* handle error */
    console.log(e.response.data)
    throw new Error(e)
  }
}

module.exports = postProducts

