const axios = require('axios');

const getToken = async () => {
  const payload = {
    grant_type: "refresh_token",
    refresh_token: process.env.REFRESH_TOKEN,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  }

  try {
    const res = await axios({
      method: 'post',
      url: 'https://api.amazon.com/auth/o2/token',
      headers: {
        'Content-Type': 'application/json'
      },
      data : payload
    })
    console.log(`Success. Expires in ${res.data.expires_in} `);
    return res.data.access_token
  } catch (e) {
    /* handle error */
    console.log(e);
    throw new Error(e)
  }
}

module.exports = getToken

