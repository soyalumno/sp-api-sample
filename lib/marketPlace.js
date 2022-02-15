const axios = require('axios')
const AwsV4Signer = require('./awsv4signer.js')

const SPAPI_EP = 'https://sellingpartnerapi-fe.amazon.com'

const getMarketPlace = async (token) => {
  const payload = {}
  const req_url = SPAPI_EP + '/sellers/v1/marketplaceParticipations'

  // 署名を作成
  const signer = new AwsV4Signer({
    method: 'GET',
    url: req_url,
  })
  signer.sign()

  try {
    const res = await axios({
      method: 'GET',
      url: req_url,
      headers: {
        host: signer.hostname,
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

module.exports = getMarketPlace

