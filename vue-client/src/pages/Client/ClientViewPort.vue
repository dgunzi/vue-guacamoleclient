/**
* Created by dgunzi on 2019/12/03.
*/
<template>
    <section>
        <div class="viewport">
            <client></client>
        </div>
    </section>
</template>

<script>
    import Client from './Client'
    export default {
        components: {
            Client
        },
        name: 'ClientViewPort',
        data() {
            return {
                pollArea: null,
                currentAdjustedHeight: null,
                element: null
            }
        },
        mounted() {
            this.element = this.$el.querySelector('.viewport');
            window.addEventListener('scroll', this.fitVisibleArea);
            this.pollArea = window.setInterval(this.fitVisibleArea, 10);
            document.querySelector('body').className = 'client';
        },
        beforeDestroy() {
            window.removeEventListener('scroll', this.fitVisibleArea);
            window.clearInterval(this.pollArea);
            document.querySelector('body').className = '';
        },
        methods: {
            fitVisibleArea() {
                // Pull scroll properties
                let scrollLeft = document.body.scrollLeft;
                let scrollTop = document.body.scrollTop;
                let scrollWidth = document.body.scrollWidth;
                let scrollHeight = document.body.scrollHeight;

                // Calculate new height
                let adjustedHeight = scrollHeight - scrollTop;

                // Only update if not in response to our own call to scrollTo()
                if (scrollLeft !== scrollWidth && scrollTop !== scrollHeight &&
                    this.currentAdjustedHeight !== adjustedHeight) {
                    // Adjust element to fit exactly within visible area
                    this.element.style.height = adjustedHeight + 'px';
                    this.currentAdjustedHeight = adjustedHeight;

                    // Scroll to bottom
                    window.scrollTo(scrollWidth, scrollHeight);
                } else if (adjustedHeight === 0) {
                    // Manually attempt scroll if height has not been adjusted
                    window.scrollTo(scrollWidth, scrollHeight);
                }
            }
        }
    }
</script>

<style>
    body.client {
        background: black;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }

    #preload {
        visibility: hidden;
        position: absolute;
        left: 0;
        right: 0;
        width: 0;
        height: 0;
        overflow: hidden;
    }

    .client .menu .header h2 {
        text-transform: none;
    }

    .client .user-menu .menu-contents li a.disconnect {
        background-repeat: no-repeat;
        background-size: 1em;
        background-position: 0.75em center;
        padding-left: 2.5em;
        background-image: url('../../../static/images/x.png');
    }
</style>