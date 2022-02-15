const getToken = require('./lib/token')
const getMarketPlace = require('./lib/marketPlace')
const getCatalogItem = require('./lib/catalog')
const postProducts = require('./lib/products')

// SP-APIのサンプルプログラム
async function main() {
  // リフレッシュトークンからアクセストークンを取得
  const token = await getToken()

  // POSTメソッド用の送信データ
  const payload = {
    FeesEstimateRequest: {
      MarketplaceId: 'A1VC38T7YXB528',
      PriceToEstimateFees: {
        ListingPrice: {
          CurrencyCode:'JPY',
          Amount: 980
        }
      },
      Identifier: 'myId'
    }
  }

  // APIにリクエストを投げる
  Promise.all([
    getMarketPlace(token),
    getCatalogItem('B07WXL5YPW', {marketplaceIds: 'A1VC38T7YXB528'}, token),
    postProducts('B07WXL5YPW', payload, token),
  ])
    .then((datas) => {
      // 成功したら応答を出力
      datas.map((data) => {
        console.log(JSON.stringify(data, null, 2))
      })
    })
    .catch((e) => {
      /* handle error */
      console.error(e)
    })
}

main()

