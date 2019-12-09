/**
* Created by dgunzi on 2019/11/26.
*/
<template>
    <div class="recent-connections">
        <!-- All recent connections 所有最近连接-->
        <div v-for="recentConnection in recentConnections" class="connection">
            <a :href="'#/client/' + recentConnection.entry.id">
                <!-- Connection thumbnail -->
                <div class="thumbnail">
                    <img :alt="recentConnection.name" :src="recentConnection.entry.thumbnail"/>
                </div>

                <!-- Connection name -->
                <div class="caption">
                    <span class="name">{{recentConnection.name}}</span>
                </div>

            </a>
        </div>
        <p class="placeholder" v-if="hasRecentConnections()">无最近使用过的连接。</p>
    </div>
</template>

<script>
    import ClientIdentifier from '@/common/navigation/ClientIdentifier'
    import guacHistory from '@/common/history/guacHistory'
    import RecentConnection from '@/common/home/RecentConnection'

    let visibleObjects = {};
    function addVisibleConnection(dataSource, connection) {
        // Add given connection to set of visible objects
        // ClientIdentifier.toString base64转码
        let key = ClientIdentifier.toString({
            dataSource: dataSource,
            type: ClientIdentifier.Types.CONNECTION,
            id: connection.identifier
        });
        visibleObjects[key] = connection;
    }
    function addVisibleConnectionGroup(dataSource, connectionGroup) {
        let key = ClientIdentifier.toString({
            dataSource: dataSource,
            type: ClientIdentifier.Types.CONNECTION_GROUP,
            id: connectionGroup.identifier
        });
        visibleObjects[key] = connectionGroup;
        // Add all child connections
        if (connectionGroup.childConnections) {
            connectionGroup.childConnections.forEach(function addChildConnection(child) {
                addVisibleConnection(dataSource, child);
            });
        }
        if (connectionGroup.childConnectionGroups) {
            connectionGroup.childConnectionGroups.forEach(function addChildConnectionGroup(child) {
                addVisibleConnectionGroup(dataSource, child);
            });
        }
    }
    export default {
        name: 'RecentConnections',
        data() {
            return {
                activeConnections: [],
                recentConnections: []
            }
        },
        props: {
            rootGroups: {
                type: Object
            }
        },
        created() {
            let ary = [{
                'id': 'MgBjAG15c3Fs',
                'thumbnail': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAACxCAYAAAC1KWSiAAAJU0lEQVR4Xu3ZS6iP+R8H8K/BTAbjupiVS2RiMSEKUy5F7MYt9jY2s1SSOlZY2VnQsLCcKUsaM6aGXEoJTcmGpiZCueSScZ++33rO/xwOCf+mvF+npjPnnOd5fs/79fl497sMKqW8LL4IECAQIPD111+XhQsXtqT3798vg7Zs2fJy586dr0UfNGhQefnyw7uxXqf+t3nz5jLQ42zZsqXs2rWrPHnyZED++fPnl88//7zcuXOnjBkzphw7dqzfcatXry5DhgwpP//8c/t99/Pff//dznv1+Hnz5pU///yzPHz4sB3fXX/cuHH9rjNnzpzy5ZdfluPHj7fj6mPfvXv3nU26858+ffrW+5gyZUq/XN39dPf96s/d/b96XsDuikjggwVqAa5cubJd5/bt2/8rwJEjR5ZVq1aVoUOHlgMHDpRnz54N+GCzZ88uo0aNKjdu3GhNumfPnnZcLbL6j/bUqVMDntf9fdGiReWPP/4op0+f7j3v3Llz5ebNm+26tQhrYZ44caL3OsOHDy9Lly4t48ePL/v37+93/enTp5exY8eWkydPtt/3/bme1xVdd1K9/6+++qrdQ/dVj5swYUK/6yxfvryV3a+//toOqwV569at3u+dw9WrV9vvujzdNfue/7b7qJlfzfXq8X1/7u5/oPM+eDtcgMAnLvBaAfb09Lz86aefyuTJk8uwYcNKLcL6j/r3338vkyZNKn/99VfvM6BaCN99910rhqlTp5b6LOu3335rz3B++OGHcubMmfLLL7/0I/ziiy/KixcvWkHWv9eyqM+sfvzxx3ZcT09P2bdvX5k1a1a77uHDh/udX4tk9OjRrcjq3w8dOtT+Xn9Xf168eHF58OBBu9/69f3337ef67PCekzN1vf4FStWtKe+3eN01//nn3/aeWfPnm3XXbduXbvfCxcutPO/+eabcvny5VKfedXvXcFdu3atFdjRo0f7PU53fgWv9zF37tyyadOm3vvu7uOzzz5rj7dkyZL29+5+jhw50n5fn/H1PX/9+vXt/rvzOo9PfG/FI/BRBF4rwPd9D7C+JHz+/Hm5d+/eR7mxN12kFmf9Gujl8//1gV2cAIFPTuC9C7A+y6nPRq5cuVIuXrz4RpgZM2a0v2/fvr1s3br1nQDry+K+79XVm7x+/Xo7d+/eve37xo0b3+laDiJAgMCbBN5YgNOmTWvP6OpL0fqStb7Eqt/rS7H6/xMnTmwvK8+fP9+uvXbt2vb3+p5hfU+tvif4+PHjdnz9qs/cLl26VAYPHtyOGzFiRHvpVt9Tq9er/z/Q17ffftte8nUfPihAy0yAwMcSeGMBdm/yz5w5sxVQ/cSzfu8+LFi2bFkru+69s+64+r5ZfZ9swYIF7QOMvh9u1HMfPXrUrlPfT9uwYUPZvXv3W7Ns27at1E9Od+zY4Rngx5q66xAg0AQGLMD6xnr3YcF/5bRmzZpy8ODB1x7eM8D/aiIel8CnJ/De7wF+ehQSESCQJqAA0yYuLwECvQIK0DIQIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQIK0A4QIBAroABjRy84AQK1ABcuXNgg7t+/X/4Fq8I+YDt6S2kAAAAASUVORK5CYII='
            }];
            localStorage.setItem('GUAC_HISTORY', JSON.stringify(ary));
        },
        watch: {
            rootGroups(groups) {
                this.groupChange(groups);
            }
        },
        methods: {
            hasRecentConnections() {
                return !(this.activeConnections.length > 0 || this.recentConnections.length > 0);
            },
            groupChange(groups) {
                visibleObjects = {};
                for (let dataSource in groups) {
                    addVisibleConnectionGroup(dataSource, groups[dataSource]);
                }
                // 添加所有活动连接(无法处理)
                guacHistory.recentConnections.forEach((historyEntry) => {
                    console.log(historyEntry);
                    // Add recent connections for history entries with associated visible objects
                    // !(historyEntry.id in managedClients)
                    if (historyEntry.id in visibleObjects) {
                        let object = visibleObjects[historyEntry.id];
                        this.recentConnections.push(new RecentConnection(object.name, historyEntry));
                    }
                });
            }
        }
    }
</script>

<style scoped>
    div.recent-connections {
        text-align: center;
        margin: 1em;
        padding: 0;
    }

    div.recent-connections div.connection {
        -moz-border-radius: 0.5em;
        -webkit-border-radius: 0.5em;
        -khtml-border-radius: 0.5em;
        border-radius: 0.5em;
        display: inline-block;
        padding: 1em;
        margin: 1em;
        text-align: center;
        max-width: 75%;
        overflow: hidden;
    }

    .connection {
        cursor: pointer;
    }

    .connection a{
        text-decoration:none;
        color: black;
    }

    .connection a:hover {
        text-decoration:none;
        color: black;
    }

    .connection a:visited {
        text-decoration:none;
        color: black;
    }

    .recent-connections .connection:hover {
        background: #CDA;
    }

    .recent-connections .connection .thumbnail {
        display: block;
        margin: 0.5em;
    }

    .recent-connections .connection .thumbnail > * {
        border: 1px solid black;
        background: black;
        box-shadow: 1px 1px 5px black;
        max-width: 75%;
        display: inline-block;
    }

</style>