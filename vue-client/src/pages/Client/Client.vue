/**
* Created by dgunzi on 2019/12/03.
*/
<template>
    <!-- Client view -->
    <div class="client-view">
        <div class="client-view-content">

            <!-- Central portion of view -->
            <div class="client-body" guac-touch-drag="clientDrag" guac-touch-pinch="clientPinch">

                <!-- Client for current connection -->
                <guac-client></guac-client>
                <!-- All other active connections -->
                <div id="other-connections">
                </div>

            </div>

            <!-- Bottom portion of view -->
            <div class="client-bottom">
                <div class="text-input-container" v-if="showTextInput">
                    <guac-text-input :needs-focus="showTextInput"></guac-text-input>
                </div>
                <div class="keyboard-container" v-if="showOSK">
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import GuacTextInput from '../TextInput/GuacTextInput'
    import GuacClient from './GuacClient'
    import Guacamole from 'guacamole-common-js'
    import guacClientManager from '@/common/client/guacClientManager'
    export default {
        name: 'Client',
        data() {
            return {
                showTextInput: false,
                showOSK: false,
                client: null
            }
        },
        components: {
            GuacClient,
            GuacTextInput
        },
        created() {
            this.initKeyBoard();
            this.client = guacClientManager.getManagedClient(this.$route.params.id, this.$route.params.params);
            this.showTextInput = true;
        },
        methods: {
            initKeyBoard() {
                let sink = new Guacamole.InputSink();
                document.body.appendChild(sink.getElement());
                let keyboard = new Guacamole.Keyboard(document);
                keyboard.listenTo(sink.getElement());
                // Broadcast keydown events
                // keydown广播事件
                keyboard.onkeydown = (keysym) => {
                    // Do not handle key events if not logged in
                    if (this.$store.getters.expectedCredentials) {
                        return true;
                    }
                    // Warn of pending keydown
                    // 等待按键告警
                    this.$eventBus.$emit('guacBeforeKeydown', keysym, () => {
                        return true;
                    });
                    // If not prevented via guacBeforeKeydown, fire corresponding keydown event
                    // 如果没有通过guacBeforeKeydown阻止，则触发相应的keydown事件
                    var guacKeydownEvent = this.$eventBus.$emit('guacKeydown', keysym, keyboard);
                    // console.log(guacKeydownEvent);
                    return !guacKeydownEvent.defaultPrevented;
                };
                // Broadcast keyup events
                keyboard.onkeyup = (keysym) => {
                    // Do not handle key events if not logged in
                    if (this.$store.getters.expectedCredentials) {
                        return;
                    }

                    // Warn of pending keyup
                    this.$eventBus.$emit('guacBeforeKeyup', keysym, () => {
                        return;
                    });
                    // If not prevented via guacBeforeKeyup, fire corresponding keydown event
                    this.$eventBus.$emit('guacKeyup', keysym, keyboard);
                };
                // Release all keys when window loses focus
                // 释放所有按键当window失去焦点
                window.onblur = () => {
                    keyboard.reset();
                };
                document.onsubmit = () => {
                    keyboard.reset();
                };
            }
        }
    }
</script>

<style>
    .client-view {

        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        font-size: 0px;

    }

    .client-view-content {

        /* IE10 */
        display: -ms-flexbox;
        -ms-flex-align: stretch;
        -ms-flex-direction: column;
        -ms-flex-pack: end;

        /* Ancient Mozilla */
        display: -moz-box;
        -moz-box-align: stretch;
        -moz-box-orient: vertical;
        -moz-box-pack: end;

        /* Ancient WebKit */
        display: -webkit-box;
        -webkit-box-align: stretch;
        -webkit-box-orient: vertical;
        -webkit-box-pack: end;

        /* Old WebKit */
        display: -webkit-flex;
        -webkit-align-items: stretch;
        -webkit-flex-direction: column;
        -webkit-flex-pack: end;

        /* W3C */
        display: flex;
        align-items: stretch;
        flex-direction: column;
        flex-pack: end;

        width: 100%;
        height: 100%;

        font-size: 12pt;

    }

    .client-view .client-body {
        -ms-flex: 1 1 auto;
        -moz-box-flex: 1;
        -webkit-box-flex: 1;
        -webkit-flex: 1 1 auto;
        flex: 1 1 auto;
        position: relative;
    }

    .client-view .client-bottom {
        -ms-flex: 0 0 auto;
        -moz-box-flex: 0;
        -webkit-box-flex: 0;
        -webkit-flex: 0 0 auto;
        flex: 0 0 auto;
    }

    .client-view .client-body .main {

        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;

        width: auto;
        height: auto;

    }

    .text-input-container {
        display: none;
    }

    .text-input-container.open {
        display: block;
    }
</style>