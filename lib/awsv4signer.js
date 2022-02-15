require('dotenv').config();
const url = require('url')
const cryptoJs = require('crypto-js')

/** AWS署名バージョン4プロセス */
module.exports = class AwsV4Signer {
  /** API実行用にパラメータを初期化 */
  constructor(option) {
    this.key = option.key || process.env.SECRET_ACCESS_KEY
    this.region = option.region || 'us-west-2'
    this.service = option.service || 'execute-api'
    this.method = option.method || 'GET'
    this.url = option.url || 'http://example.com'
    this.hostname = url.parse(this.url).hostname
    this.payload = option.payload || {}
  }

  /**
   * Authorizationヘッダーの取得
   */
  get authHeader() {
    // 署名が無ければ作成
    const sign = this._signature || this.sign()
    return `AWS4-HMAC-SHA256 Credential=${process.env.ACCESS_KEY_ID}/${this.credential_scope}, SignedHeaders=${this._signed_headers}, Signature=${sign}`
  }

  /**
   * 現在時刻をセット
   */
  setDatestamp() {
    this.x_amz_date = new Date().toISOString().replace(/[-|:]/g, '').replace(/\..+/, 'Z')
    this.dateStamp = this.x_amz_date.split('T')[0]
    this.credential_scope = `${this.dateStamp}/${this.region}/${this.service}/aws4_request`
    return this
  }

  /**
   * 署名を取得
   */
  sign() {
    if(!this.dateStamp)
      this.setDatestamp()

    // 署名の作成
    const kDate = cryptoJs.HmacSHA256(this.dateStamp, 'AWS4' + this.key)
    const kRegion = cryptoJs.HmacSHA256(this.region, kDate)
    const kService = cryptoJs.HmacSHA256(this.service, kRegion)
    const kSigning = cryptoJs.HmacSHA256('aws4_request', kService)
    return this._signature = cryptoJs.HmacSHA256(this.str_to_sign, kSigning)
  }

  /**
   * 正規リクエストの取得
   */
  get canonical_req() {
    this._headers = {
      host: this.hostname
    }

    this._signed_headers = Object.keys(this._headers).sort().join(';')
    this._canonical_headers = Object.keys(this._headers)
      .sort()
      .map((key) => [key, this._headers[key]].join(':'))
      .join('\n') + '\n'

    return this._canonical_request = [
      this.method,  // method
      url.parse(this.url).pathname,  // URI
      url.parse(this.url).query,     // query string
      this._canonical_headers,    // headers
      this._signed_headers,
      cryptoJs.SHA256(JSON.stringify(this.payload)).toString(),     // payload hash
    ].join('\n')
  }

  /**
   * 署名用文字列の作成
   */
  get str_to_sign() {
    // 署名用文字列の作成
    return this.string_to_signature = [
      'AWS4-HMAC-SHA256',
      this.x_amz_date,
      this.credential_scope,
      cryptoJs.SHA256(this.canonical_req).toString()
    ].join('\n')
  }
}

