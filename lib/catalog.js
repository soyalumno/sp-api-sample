const axios = require('axios')
const AwsV4Signer = require('./awsv4signer.js')

const SPAPI_EP = 'https://sellingpartnerapi-fe.amazon.com'

const getCatalogItem = async (asin, query, token) => {
  const payload = {}
  const query_param = Object.keys(query)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(query[k]))
    .join('&');
  const req_url = SPAPI_EP + '/catalog/2020-12-01/items/' + asin + '?' + query_param

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

module.exports = getCatalogItem

