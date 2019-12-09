/**
* Created by dgunzi on 2019/12/04.
*/
<template>
    <div class="text-input">
        <!-- Text input target -->
        <div class="text-input-field">
            <div class="sent-history">
                <div class="sent-text" v-for="text in sentText">{{text}}</div>
            </div>
            <textarea rows="1" class="target" autocorrect="off" autocapitalize="off"></textarea>
        </div>
        <div class="text-input-buttons">
        </div>
    </div>
</template>

<script>

    const TEXT_INPUT_PADDING = 4;
    const TEXT_INPUT_PADDING_CODEPOINT = 0x200B;
    const ALLOWED_KEYS = {
        0xFE03: true, /* AltGr */
        0xFF08: true, /* Backspace */
        0xFF09: true, /* Tab */
        0xFF0D: true, /* Enter */
        0xFF1B: true, /* Escape */
        0xFF50: true, /* Home */
        0xFF51: true, /* Left */
        0xFF52: true, /* Up */
        0xFF53: true, /* Right */
        0xFF54: true, /* Down */
        0xFF57: true, /* End */
        0xFF64: true, /* Insert */
        0xFFBE: true, /* F1 */
        0xFFBF: true, /* F2 */
        0xFFC0: true, /* F3 */
        0xFFC1: true, /* F4 */
        0xFFC2: true, /* F5 */
        0xFFC3: true, /* F6 */
        0xFFC4: true, /* F7 */
        0xFFC5: true, /* F8 */
        0xFFC6: true, /* F9 */
        0xFFC7: true, /* F10 */
        0xFFC8: true, /* F11 */
        0xFFC9: true, /* F12 */
        0xFFE1: true, /* Left shift */
        0xFFE2: true, /* Right shift */
        0xFFE3: true, /* Left ctrl */
        0xFFE4: true, /* Right ctrl */
        0xFFE9: true, /* Left alt */
        0xFFEA: true, /* Right alt */
        0xFFFF: true  /* Delete */
    };
    export default {
        name: 'GuacTextInput',
        data() {
            return {
                sentText: [],
                altPressed: false,
                ctrlPressed: false,
                target: null,
                hasFocus: false,
                composingText: false
            }
        },
        props: {
            needsFocus: {
                type: Boolean
            }
        },
        mounted() {
            this.init();
        },
        beforeDestroy () {
            // 取消事件
            this.$eventBus.$off('guacBeforeKeydown');
            this.$eventBus.$off('guacBeforeKeyup');
        },
        methods: {
            init() {
                this.target = this.$el.querySelector('.target');
                this.target.onfocus = () => {
                    this.hasFocus = true;
                    this.resetTextInputTarget(TEXT_INPUT_PADDING);
                };

                this.target.onblur = () => {
                    this.hasFocus = false;
                    this.target.focus();
                };

                this.target.addEventListener('compositionstart', (e) => {
                    this.composingText = true;
                }, false);

                this.target.addEventListener('compositionend', (e) => {
                    this.composingText = false;
                }, false);

                this.target.addEventListener('input', function(e) {
                    // Ignore input events during text composition
                    if (this.composingText) {
                        return;
                    }
                    var i;
                    var content = this.target.value;
                    var expectedLength = TEXT_INPUT_PADDING * 2;

                    // If content removed, update
                    if (content.length < expectedLength) {
                    // Calculate number of backspaces and send
                        var backspaceCount = TEXT_INPUT_PADDING - this.target.selectionStart;
                        for (i = 0; i < backspaceCount; i++) {
                            this.sendKeysym(0xFF08);
                        }

                        // Calculate number of deletes and send
                        var deleteCount = expectedLength - content.length - backspaceCount;
                        for (i = 0; i < deleteCount; i++) {
                            this.sendKeysym(0xFFFF);
                        }
                    } else {
                        this.sendString(content);
                    }
                    // Reset content
                    this.resetTextInputTarget(TEXT_INPUT_PADDING);
                    e.preventDefault();
                }, false);
                this.target.addEventListener('selectstart', (e) => {
                    e.preventDefault();
                }, false);
                if (this.needsFocus) {
                    this.target.focus();
                } else {
                    this.target.blur();
                }
                // If the text input UI has focus, prevent keydown events
                this.$eventBus.$on('guacBeforeKeydown', (keysym, callback) => {
                    if (this.hasFocus && !ALLOWED_KEYS[keysym]) {
                        callback();
                    }
                });

                // If the text input UI has focus, prevent keyup events
                this.$eventBus.$on('guacBeforeKeyup', (keysym, callback) => {
                    if (this.hasFocus && !ALLOWED_KEYS[keysym]) {
                        callback();
                    }
                });
            },
            resetTextInputTarget(padding) {
                let paddingChar = String.fromCharCode(TEXT_INPUT_PADDING_CODEPOINT);

                // Pad text area with an arbitrary, non-typable character (so there is something
                // to delete with backspace or del), and position cursor in middle.
                this.target.value = new Array(padding * 2 + 1).join(paddingChar);
                this.target.setSelectionRange(padding, padding);
            },
            keysymFromCodepoint(codepoint) {
                // Keysyms for control characters
                if (codepoint <= 0x1F || (codepoint >= 0x7F && codepoint <= 0x9F)) {
                    return 0xFF00 | codepoint;
                }
                // Keysyms for ASCII chars
                if (codepoint >= 0x0000 && codepoint <= 0x00FF) {
                    return codepoint;
                }
                // Keysyms for Unicode
                if (codepoint >= 0x0100 && codepoint <= 0x10FFFF) {
                    return 0x01000000 | codepoint;
                }
                return null;
            },
            sendKeysym(keysym) {
                this.$eventBus.$emit('guacSyntheticKeydown', keysym);
                this.$eventBus.$emit('guacSyntheticKeyup', keysym);
            },
            sendCodepoint(codepoint) {
                if (codepoint === 10) {
                    this.sendKeysym(0xFF0D);
                    this.releaseStickyKeys();
                    return;
                }

                var keysym = this.keysymFromCodepoint(codepoint);
                if (keysym) {
                    this.sendKeysym(keysym);
                    this.releaseStickyKeys();
                }
            },
            releaseStickyKeys() {
                this.altPressed = false;
                this.ctrlPressed = false;
            },
            sendString(content) {
                var sentText = '';

                // Send each codepoint within the string
                for (var i = 0; i < content.length; i++) {
                    var codepoint = content.charCodeAt(i);
                    if (codepoint !== TEXT_INPUT_PADDING_CODEPOINT) {
                        sentText += String.fromCharCode(codepoint);
                        this.sendCodepoint(codepoint);
                    }
                }

                // Display the text that was sent
                this.sentText.push(sentText);

                // Remove text after one second
                window.setTimeout(() => {
                    this.sentText.shift();
                }, 1000);
            }
        }
    }
</script>

<style>
    .text-input {
        width: 100%;
        background: #222;
        color: white;
    }

    .text-input .text-input-field,
    .text-input .text-input-buttons {
        display: inline-block;
        vertical-align: middle;
    }

    .text-input .text-input-field {
        width: 30%;
        overflow: hidden;
        white-space: nowrap;
    }

    .text-input .text-input-buttons {
        width: 70%;
        text-align: right;
    }

    .text-input .target {

        border: none;
        border-radius: 0;

        display: inline-block;
        vertical-align: middle;
        color: white;
        font-size: 12pt;
        width: 100%;
        height: auto;
        resize: none;
        outline: none;

        margin: 0;
        padding: 0.25em;
        padding-left: 0;
        background: transparent;
        overflow: hidden;

    }

    .text-input.open {
        display: block;
    }

    .text-input .sent-history {
        display: inline-block;
        vertical-align: middle;
        padding: 0.25em;
        padding-right: 0;
    }

    .text-input .sent-history .sent-text {
        display: inline-block;
        vertical-align: baseline;
        white-space: pre;
        font-size: 12pt;

        animation: fadeout 1s linear;
        -webkit-animation: fadeout 1s linear;
        opacity: 0;
    }

    .text-input .text-input-buttons button {

        box-shadow: none;
        padding: 0.25em;
        max-width: 20%;
        margin: 0.1em;
        min-width: 3em;

        background: #444;

        border: 0.125em solid #666;
        -moz-border-radius:    0.25em;
        -webkit-border-radius: 0.25em;
        -khtml-border-radius:  0.25em;
        border-radius:         0.25em;

        color: white;
        font-weight: lighter;
        text-align: center;

        text-shadow:  1px  1px 0 rgba(0, 0, 0, 0.25),
        1px -1px 0 rgba(0, 0, 0, 0.25),
        -1px  1px 0 rgba(0, 0, 0, 0.25),
        -1px -1px 0 rgba(0, 0, 0, 0.25);

    }

    .text-input .text-input-buttons button:active {
        background: #822;
        border-color: #D44;
    }

    .text-input .text-input-buttons button.pressed {
        background: #882;
        border-color: #DD4;
    }

</style>