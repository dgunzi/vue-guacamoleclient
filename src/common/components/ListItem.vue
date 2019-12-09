/**
* Created by dgunzi on 2019/11/29.
*/
<template>
        <div v-if="isVisible(item.type)" :class="getIconClass(item)">
            <div class="caption">
                <!-- Expand/collapse icon -->
                <div class="icon expand" @click="toggleExpanded(item)"
                     v-if="item.expandable"></div>
                <!-- Item caption -->
                <template v-if="item.type == 'connection'">
                    <a class="home-connection"
                       :href="'#/client/' + item.getClientIdentifier()"
                       :class="{active: item.getActiveConnections()}">
                        <!-- Connection icon -->
                        <div class="icon type" :class="item.protocol"></div>
                        <!-- Connection name -->
                        <span class="name">{{item.name}}</span>
                        <!-- Active user count -->
                        <span class="activeUserCount" v-if="item.getActiveConnections()">
                            {{ $t('HOME.INFO_ACTIVE_USER_COUNT', {'USERS': item.getActiveConnections()}) }}
                        </span>
                    </a>
                </template>
                <template v-if="item.type == 'connection-group'">
                        <span class="home-connection-group name">
                            <a v-if="item.balancing" :href="'#/client/' + item.getClientIdentifier() ">{{item.name}}</a>
                            <span v-if="!item.balancing">{{item.name}}</span>
                        </span>
                </template>
            </div>
            <!-- Children of item (if any) -->
            <div class="children" v-if="item.expanded">
                <div class="list-item" v-for="child in item.children">
                    <list-item :item="child" :templates="templates"></list-item>
                </div>
            </div>
        </div>
</template>

<script>
    export default {
        name: 'ListItem',
        data() {
            return {}
        },
        created() {
        },
        props: {
            item: {
                required: true
            },
            templates: {
                type: Array,
                required: true
            }
        },
        methods: {
            getIconClass(item) {
                let classAry = [item.type];
                if (item.expanded) classAry.push('expanded');
                if (item.expandable) classAry.push('expandable');
                if (!item.children.length) classAry.push('empty');
                return classAry.join(' ')
            },
            toggleExpanded(groupListItem) {
                groupListItem.expanded = !groupListItem.expanded;
            },
            isVisible(type) {
                return !!this.templates.includes(type);
            }
        }
    }
</script>

<style scoped>

</style>