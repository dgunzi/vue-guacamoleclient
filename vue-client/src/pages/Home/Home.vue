<template>
    <section>
        <div class="header">
            <h2>{{ $t('HOME.SECTION_HEADER_RECENT_CONNECTIONS') }}</h2>
            <user-menu></user-menu>
        </div>
        <!--最近使用过的连接-->
        <recent-connections :root-groups="rootConnectionGroups"></recent-connections>
        <div class="header">
            <h2>{{ $t('HOME.SECTION_HEADER_ALL_CONNECTIONS') }}</h2>
        </div>
        <div class="all-connections">
            <gua-group-list :connection-groups="rootConnectionGroups"
                            :templates="['connection','connection-group']"
            ></gua-group-list>
        </div>
    </section>
</template>

<script>
    import UserMenu from './UserMenu'
    import {getConnectionGroupTree} from '../../rest/connectionGroupService'
    import ConnectionGroup from '@/common/types/ConnectionGroup'
    import RecentConnections from './RecentConnections'
    import GuaGroupList from '../groupList/GuaGroupList'
    export default {
        components: {
            UserMenu,
            RecentConnections,
            GuaGroupList
        },
        name: 'index',
        data() {
            return {
                rootConnectionGroups: null
            }
        },
        created() {
            let getGroupTree = getConnectionGroupTree(this.$store.getters.authenticationResult.availableDataSources, ConnectionGroup.ROOT_IDENTIFIER)

            Promise.all(getGroupTree).then((retrievedRootGroups) => {
                let rootGroups = {};
                retrievedRootGroups.forEach((item) => {
                    rootGroups[item.key] = item.value;
                    console.log(item.key);
                });
                this.rootConnectionGroups = rootGroups;
            }).catch((err) => {
                console.log(err);
                this.$store.commit('setFatalError', err.response.data);
                this.$router.push('/error');
            });
        },
        methods: {}
    }
</script>

<style lang="stylus">
    .header
        border-bottom: 1px solid rgba(0,0,0,0.125);
        box-shadow: 0 1px 2px rgba(0,0,0,0.125);
        background: rgba(0,0,0,0.04);
        margin-bottom: 1em;
        margin-top: 0;
        border-top: 0;
        width: 100%;
        display: -ms-flexbox;
        -ms-flex-align: stretch;
        -ms-flex-direction: row;
        display: -moz-box;
        -moz-box-align: stretch;
        -moz-box-orient: horizontal;
        display: -webkit-box;
        -webkit-box-align: stretch;
        -webkit-box-orient: horizontal;
        display: -webkit-flex;
        -webkit-align-items: stretch;
        -webkit-flex-direction: row;
        display: flex;
        align-items: stretch;
        flex-direction: row
        h2
            -ms-flex: 1 1 auto;
            -moz-box-flex: 1;
            -webkit-box-flex: 1;
            -webkit-flex: 1 1 auto;
            flex: 1 1 auto
        .s-button
            padding 16px 12px
    h2
        font-size: 1.25em;
        font-weight: bold;
        text-transform: uppercase;
        padding: .5em;
        margin: 0
    .header ~ * .header,.header ~ .header {
        margin-top: 1em;
        border-top: 1px solid rgba(0,0,0,0.125)
    }
    div.recent-connections,div.clipboardDiv,div.settings,div.all-connections {
        margin: 1em;
        padding: 0
    }
    .placeholder {
        color: rgba(255,255,255,0.5);
        text-shadow: -1px -1px rgba(0,0,0,0.5);
        text-align: center;
        opacity: .5;
        font-size: 2em;
        font-weight: bolder
    }
</style>