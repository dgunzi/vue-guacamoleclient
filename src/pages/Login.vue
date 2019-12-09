/**
* Created by dgunzi on 2019/10/28.
*/
<template>
<div class="login-ui" v-if="expectedCredentials">
    <!-- Login error message -->
    <p class="login-error"></p>
    <div class="login-dialog-middle">
        <div class="login-dialog">
            <form class="login-form" ng-submit="login()">
                <!-- Guacamole version -->
                <div class="logo"></div>
                <div class="version">
                    <div class="app-name">{{ $t("APP.NAME" ) }}</div>
                    <div class="version-number">{{ $t("APP.VERSION" ) }}</div>
                </div>
                <!-- Login message/instructions -->
                <p v-if="loginHelpText">{{ $t('LOGIN.' + loginHelpText.variables) }}</p>
                <!-- Login fields -->
                <div class="login-fields">
                    <!--此处表单为动态的-->
                    <s-form ref="ruleForm" class="demo-ruleForm" labs-position="left" labs-width="0px">
                        <s-form-item v-for="item in expectedCredentials" :key="item.name">
                            <s-input :type="item.type === 'PASSWORD' ? 'password' : 'text'" v-model="loginForm[item.name]" :placeholder="$t('LOGIN.FIELD_HEADER_' + item.type)" @keyup.enter.native="submitAction"></s-input>
                        </s-form-item>
                    </s-form>
                </div>
                <!-- Login/continue button -->
                <div class="buttons">
                    <s-button @click="submitAction" :title="$t('APP.ACTION_LOGIN')" style="width: 100%">{{ $t('APP.ACTION_LOGIN') }}</s-button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>
    import {getTokens, delTokens} from '../rest/authenticationService'
    import eventBus from '@/plugins/eventBus'
    import Error from '@/common/types/Error'
    import qs from 'querystring'
    export default {
        name: 'login',
        data() {
            return {
                expectedCredentials: null, // 没有登录时的表单内容,为空表示没有登录
                loginHelpText: null,
                loginForm: {}
            }
        },
        created() {
            this.getTokensAction(true);
        },
        methods: {
            init() {
                this.loginHelpText = this.$store.getters.loginHelpText;
                this.expectedCredentials = this.$store.getters.expectedCredentials;
                for (let i = 0; i < this.expectedCredentials.length; i++) {
                    this.loginForm[this.expectedCredentials[i].name] = '';
                }
            },
            getTokensAction(initFlag) {
                let AUTH_STORAGE_KEY = 'GUAC_AUTH';
                getTokens(qs.stringify(this.loginForm), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(({data}) => {
                    // 从storge中获取基本信息
                    let currentToken = this.$store.getters.authenticationResult.authToken;
                    if (data.authToken !== currentToken) {
                        if (currentToken) {
                            localStorage.removeItem(AUTH_STORAGE_KEY);
                            this.$store.commit('REMOVE_TOKEN');
                            delTokens(currentToken);
                        }
                        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
                        this.$store.commit('SET_TOKEN');
                    } else {
                        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
                        this.$store.commit('SET_TOKEN');
                    }
                    if (initFlag) {
                        this.init();
                    }
                    eventBus.$emit('guacLogin', currentToken);
                    this.$router.push('/');
                }).catch((error) => {
                    let response = error.response;
                    if (response.data.type === Error.Type.INVALID_CREDENTIALS) {
                        // 如果提供的凭据无效，则请求凭据
                        this.$store.commit('guacInvalidCredentials', response.data);
                        if (initFlag) {
                            this.init();
                        } else {
                            this.$message.error(this.$t('LOGIN.ERROR_INVALID_LOGIN'));
                        }
                    } else if (response.data.type === Error.Type.INSUFFICIENT_CREDENTIALS) {
                        // 如果提供的凭据不够，则请求更多凭据
                        this.$store.commit('guacInsufficientCredentials', response.data);
                        if (initFlag) {
                            this.init();
                        }
                    } else if (response.data.type === Error.Type.INTERNAL_ERROR) {
                        this.$store.commit('setFatalError', response.data);
                        this.$router.push('/error');
                    }
                });
            },
            submitAction() {
                this.getTokensAction(false);
            }
        }
    }
</script>

<style lang="stylus">
.login-ui {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    display: table;
    background: white;
    z-index: 20;
}

.login-ui p.login-error {
    display: none;
}

.login-ui.error p.login-error {
    display: block;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;

    padding: 1em;
    margin: 0.2em;

    background: #FDD;
    border: 1px solid #964040;
    border-radius: 0.25em;
    text-align: center;
    color: #964040;
}

.login-ui .login-fields .form-field .password-field .toggle-password {
    display: none;
}

.login-ui .login-fields .labeled-field {
    display: block;
    position: relative;
    z-index: 1;
}

.login-ui .login-fields .labeled-field .field-header {

  display: block;
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;

  z-index: -1;
  margin: 0.5em;
  font-size: 0.9em;
  opacity: 0.5;

}

.login-ui .login-fields .labeled-field.empty input {
    background: transparent;
}

.login-ui .login-fields .labeled-field input:focus {
    background: white;
}

.login-ui {
    animation: fadein 0.125s linear;
    -moz-animation: fadein 0.125s linear;
    -webkit-animation: fadein 0.125s linear;
}

.login-ui .login-dialog-middle {
    width: 100%;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

.login-ui .login-dialog {

    width: 100%;
    max-width: 3in;
    text-align: left;
    padding: 1em;
    border: 1px solid rgba(0, 0, 0, 0.25);
    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.25);
    font-size: 1.25em;

    display: inline-block;
}

.login-ui .login-dialog h1 {
    margin-top: 0;
    margin-bottom: 0em;
    text-align: center;
}

.login-ui .login-dialog .buttons {
    text-align: right;
    margin: 0;
    margin-top: 1em;
}

.login-ui .login-dialog .login-fields {
    vertical-align: middle;
}

.login-ui .login-dialog th {
    text-shadow: 1px 1px white;
}

.login-ui .login-dialog .version {
    padding: 0.5em 0;
}

.login-ui .login-dialog .version .app-name {
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    font-size: 1.25em;
}

.login-ui .login-dialog .version .version-number {

    position: absolute;
    right: 0;
    bottom: 0;

    padding: 0.25em 0.75em;
    margin: 0.25em;

    border-radius: 0.5em;

    color: white;
    background: green;
    font-size: 0.5em;
    font-style: italic;
    opacity: 0.5;

}

.login-ui .login-dialog .logo {
    display: block;
    margin: 0.5em auto;
    width: 3em;
    height: 3em;
    background-size:         3em 3em;
    background-image: url("/static/images/guac-tricolor.png");
}

.login-ui.continuation .login-dialog {
    border-right: none;
    border-left: none;
    box-shadow: none;
    max-width: 6in;
}

.login-ui.continuation .login-dialog .logo,
.login-ui.continuation .login-dialog .version {
    display: none;
}

.login-ui.error .login-dialog {
    animation-name: shake-head;
    animation-duration: 0.25s;
    animation-timing-function: linear;
    -webkit-animation-name: shake-head;
    -webkit-animation-duration: 0.25s;
    -webkit-animation-timing-function: linear;
}
</style>
