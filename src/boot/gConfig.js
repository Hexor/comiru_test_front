import { LocalStorage } from 'quasar'
import axios from 'axios'

export default async ({ app, router, Vue }) => {
  Vue.prototype.getLocalTokenType = function () {
    const tokenType = LocalStorage.getItem('token_type')
    if (tokenType) {
      return tokenType
    } else if (this.isLineTokenInLocal()) {
      return 'line'
    }
  }

  Vue.prototype.isLineTokenInServer = function () {
    if (LocalStorage.getItem('line_exist_in_server') === 'line_exist_in_server') {
      return true
    }
  }

  Vue.prototype.isLineTokenInLocal = function () {
    const token = LocalStorage.getItem('line_access_token')
    const tokenExpireTS =
      LocalStorage.getItem('line_token_expire_at')

    const nowTS = new Date()
    if (token && tokenExpireTS > nowTS) {
      return true
    }
  }

  Vue.prototype.updateLocalStorageTokenInfo = function (accessToken, tokenType, tokenExpireAt, lineExistInServer) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
    LocalStorage.set('access_token', accessToken)
    LocalStorage.set('token_type', tokenType)
    LocalStorage.set('token_expire_at', tokenExpireAt)

    if (lineExistInServer) {
      LocalStorage.set('line_exist_in_server', lineExistInServer)
    }
  }

  Vue.prototype.handleErrorResponse = function (errorResponse) {
    let errorMessage = errorResponse.response.data.message
    this.$q.notify({
      multiLine: true,
      color: 'warning',
      message: errorMessage,
      timeout: 1500
    })
    LocalStorage.clear()
    this.$router.push({ path: '/auth' })
  }

  Vue.prototype.openLineLoginWindow = function () {
    return window.open('https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1564192144&redirect_uri=http://comiru.tt/api/line_auth_callback&state=12345&scope=openid', '_blank', 'width=600,height=400,menubar=no,toolbar=no,location=no')
  }

  Vue.prototype.bindSignInTokenWithLineToken = function () {
    const that = this
    const signInToken = LocalStorage.getItem('access_token')
    const lineToken = LocalStorage.getItem('line_access_token')
    if (signInToken) {
      axios.post(LocalStorage.getItem('token_type') + '/bind_line', {
        line_token: lineToken
      })
        .then((response) => {
          that.$q.notify({
            color: 'info',
            icon: 'thumb_up',
            message: '绑定成功!',
            timeout: 500
          })
          that.$router.push({ path: '/auth/switch' })
        })
        .catch((errorResponse) => {
          that.handleErrorResponse(errorResponse)
        })
        .then(function () {
        })
    }
  }

  Vue.prototype.startLoginAsLineProcess = function () {
    this.startLineProcess('login')
  }

  Vue.prototype.startBindLineProcess = function () {
    this.startLineProcess('bind')
  }

  Vue.prototype.startLineProcess = function (processType) {
    const that = this
    const authWindow = this.openLineLoginWindow()

    // 打开新窗口用于line 登录, 并且定时查询是否已经登录成功
    const checkLineToken = setInterval(function () {
      if (that.isLineTokenInLocal()) {
        authWindow.close()
        // line 登录成功后关闭刚才打开的窗口, 然后开始执行绑定帐号逻辑

        if (processType === 'login') {
          that.$q.notify({
            color: 'lineColor',
            textColor: 'white',
            icon: 'fab fa-line',
            message: '登录 Line 成功! ',
            timeout: 3000
          })
          that.$router.push({ path: '/auth/switch' })
        } else if (processType === 'bind') {
          that.bindSignInTokenWithLineToken()
        }
        clearInterval(checkLineToken)
      }
    },
    500
    )

    setTimeout(function () {
      clearInterval(checkLineToken)
    }, 30000)
  }
}
