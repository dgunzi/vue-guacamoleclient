/**
* Created by dgunzi on 2019/11/21.
* 如果发生内部错误，则中止页面的呈现
*/
<template>
    <div class="shown fatal-page-error-outer">
        <div class="fatal-page-error-middle">
            <div class="fatal-page-error">
                <h1>{{ $t('APP.DIALOG_HEADER_ERROR') }}</h1>
                <p>{{ $t('APP.ERROR_PAGE_UNAVAILABLE') }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Error',
        data() {
            return {};
        },
        created() {
        },
        methods: {}
    }
</script>

<style scoped>
    .fatal-page-error-outer {
        display: table;
        height: 100%;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 30;
    }

    .fatal-page-error-middle {
        width: 100%;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    .fatal-page-error {
        display: inline-block;
        width: 100%;
        max-width: 5in;
        padding: 1em;
        text-align: left;
    }

    .fatal-page-error h1 {
        text-transform: uppercase;
        padding: 0;
        padding-right: 1em;
    }

    .fatal-page-error h1::before {
        content: ' ';
        display: inline-block;
        background: url('../../static/images/warning.png');
        background-repeat: no-repeat;
        height: 1em;
        width: 1em;
        background-size: contain;
        margin: 0 0.25em;
        margin-bottom: -0.2em;
    }

    /* Ensure fatal error is initially hidden, fading the error message in when
     * needed */

    .fatal-page-error-outer {
        visibility: hidden;
        opacity: 0;
        transition: opacity, visibility;
        transition-duration: 0.25s;
    }

    .shown.fatal-page-error-outer {
        visibility: visible;
        opacity: 1;
    }
</style>