/**
* Created by dgunzi on 2019/11/28.
*/
<template>
    <div class="group-list">
        <div class="group-list-page">
            <div class="list-item" v-for="item in pageData">
                <list-item :item="item" :templates="templates"></list-item>
            </div>
            <s-pagination
                    :current-page="currentPage"
                    @current-change="handleCurrentChange"
                    layout="prev, pager, next"
                    :page-size="pageSize"
                    :total="rootItems.length">
            </s-pagination>
        </div>
    </div>
</template>

<script>
    import GroupListItem from './GroupListItem'
    import {getActiveConnections} from '../../rest/activeConnectionService'
    import {cloneDeep} from 'lodash'
    export default {
        name: 'guaGroupList',
        data() {
            return {
                rootItems: [],
                pageData: [],
                currentPage: 1,
                pageSize: 3,
                totalPage: 0,
                connectionCount: {}
            }
        },
        props: {
            connectionGroups: {
                type: Object
            },
            templates: {
                type: Array
            },
            showRootGroup: {
                type: Boolean
            }
        },
        watch: {
            connectionGroups(groups) {
                this.getConnectionCount(groups);
            }
        },
        methods: {
            handleCurrentChange(current) {
                if (current === this.currentPage) return;
                this.currentPage = current;
                this.getPageData();
            },
            getPageData() {
                this.totalPage = this.rootItems.length;
                let firstIndex = (this.currentPage - 1) * this.pageSize;
                this.pageData = cloneDeep(this.rootItems).splice(firstIndex, this.pageSize);
            },
            isVisible(type) {
                return !!this.templates.includes(type);
            },
            countActiveConnections(dataSource, connection) {
                return this.connectionCount[dataSource][connection.identifier];
            },
            // 获取连接个数
            getConnectionCount(groups) {
                let dataSources = [];
                this.rootItems = [];
                this.connectionCount = {};
                for (let dataSource in groups) {
                    let connectionGroup = groups[dataSource];
                    let rootItem;

                    // Prepare data source for active connection counting
                    dataSources.push(dataSource);
                    this.connectionCount[dataSource] = {};
                    if (connectionGroup instanceof GroupListItem) {
                        rootItem = connectionGroup;
                    } else {
                        rootItem = GroupListItem.fromConnectionGroup(dataSource, connectionGroup,
                            this.isVisible(GroupListItem.Type.CONNECTION),
                            this.isVisible(GroupListItem.Type.SHARING_PROFILE),
                            this.countActiveConnections);
                    }
                    // this.showRootGroup 从来就没有调用过
                    if (this.showRootGroup) {
                        this.rootItems.push(rootItem);
                    } else {
                        rootItem.children.forEach((child) => {
                            this.rootItems.push(child);
                        });
                    }
                }
                Promise.all(getActiveConnections(dataSources)).then((activeConnectionMapAry) => {
                    activeConnectionMapAry.forEach((activeConnectionBigMap) => {
                        let activeConnectionMap = activeConnectionBigMap.value;
                        let dataSource = activeConnectionBigMap.key;
                        for (let key in activeConnectionMap) {
                            let activeConnection = activeConnectionMap[key];
                            let identifier = activeConnection.connectionIdentifier;
                            console.log(activeConnection.connectionIdentifier);
                            if (this.connectionCount[dataSource][identifier]) {
                                this.connectionCount[dataSource][identifier]++;
                            } else {
                                this.connectionCount[dataSource][identifier] = 1;
                            }
                        }
                    });
                    this.getPageData();
                }).catch((err) => {
                    this.$store.commit('setFatalError', err.response.data);
                    this.$router.push('/error');
                });
            }
        }
    }
</script>

<style>
    a{
        text-decoration: none;
    }
    .connection a:visited,.connection-group a:visited {
        text-decoration: none;
        color: black
    }
    .connection:hover {
        background: #CDA
    }
    .connection .icon,
    .connection-group .icon,
    .sharing-profile .icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: 16px 16px;
        -moz-background-size: 16px 16px;
        -webkit-background-size: 16px 16px;
        -khtml-background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: center center;
    }

    .connection-group > .caption .icon {
        background-image: url('../../../static/images/folder-closed.png');
    }

    .connection-group.expanded > .caption .icon {
        background-image: url('../../../static/images/folder-open.png');
    }

    .connection .icon {
        background-image: url('../../../static/images/protocol-icons/guac-plug.png');
    }

    .connection .icon.kubernetes,
    .connection .icon.ssh,
    .connection .icon.telnet {
        background-image: url('../../../static/images/protocol-icons/guac-text.png');
    }

    .connection .icon.vnc,
    .connection .icon.rdp {
        background-image: url('../../../static/images/protocol-icons/guac-monitor.png');
    }

    .sharing-profile .icon {
        background-image: url('../../../static/images/share.png');
    }

    /*
     * Groups
     */
    .expandable > .children {
        margin-left: 13px;
        padding-left: 13px;
    }

    .connection-group.empty.balancer .icon {
        background-image: url('../../../static/images/protocol-icons/guac-monitor.png');
    }

    .expandable.expanded > .children > .list-item {
        position: relative;
    }

    .expandable.expanded > .children > .list-item:before,
    .expandable.expanded > .children > .list-item:after {
        display: block;
        content: ' ';
        position: absolute;
        z-index: -1;
    }

    .expandable.expanded > .children > .list-item:before {
        border-left: 1px solid #BBB;
        left: -13px;
        top: -0.75em;
        bottom: 0;
    }

    .expandable.expanded > .children > .list-item:last-child:before {
        height: 1.5em;
    }

    .expandable.expanded > .children > .list-item:after {
        display: block;
        content: ' ';
        border-bottom: 1px solid #BBB;
        left: -13px;
        width: 13px;
        top: 0.75em;
    }

    .expandable > .caption .icon.expand {
        background-image: url('../../../static/images/group-icons/guac-closed.png');
    }

    .expandable.expanded > .caption .icon.expand {
        background-image: url('../../../static/images/group-icons/guac-open.png');
    }

    .expandable.empty > .caption .icon.expand {
        opacity: 0.25;
        background-image: url('../../../static/images/group-icons/guac-open.png');
    }

    .history th,
    .history td {
        padding-left: 1em;
        padding-right: 1em;
    }

    .buttons {
        text-align: center;
        margin: 1em;
    }

    .list-item * {
        vertical-align: middle;
    }

    .list-item .caption {
        padding: .1em
    }

    .list-item .name {
        color: black;
        font-weight: normal;
        padding: 0.1em;
        margin-left: 0.25em;
    }

    .connection .icon,
    .connection-group .icon,
    .sharing-profile .icon {
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: 16px 16px;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .list-item.selected {
        background: #DEB
    }

    .caption.active * {
        opacity: .5
    }

    .caption .activeUserCount {
        font-style: italic;
        margin-right: 1em;
        float: right
    }

    .list-item:not(.selected) .caption:hover {
        background: #CDA
    }
</style>