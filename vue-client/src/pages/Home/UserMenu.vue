/**
* Created by dgunzi on 2019/11/22.
*/
<template>
    <section class="user-menu" v-if="!isAnonymous()">
        <s-dropdown style="margin-left: 20px;margin-right: 2px;">
            <s-button icon="user">
                {{ userName }}
                <i class="iconfont icon-bottom"></i>
            </s-button>
            <s-dropdown-menu slot="list">
                <div v-if="fullName">
                    <div class="profile">
                        <div class="full-name"><a :href="userURL">{{ userName }}</a></div>
                        <div class="organizational-role" v-if="role">{{ role }}</div>
                        <div class="organization" v-if="organization">{{ organization }}</div>
                    </div>
                </div>
                <!-- Local actions "断开连接"-->
                <s-dropdown-item
                        v-for="item in localActions"
                        :key="item.name" @click="item.callback()">
                    <i class="iconfont icon-home"></i> {{ $t(item.name) }}
                </s-dropdown-item>
                <!-- Navigation links 首页/设置-->
                <s-dropdown-item v-for="page in pages"
                                 :key="page.name" :disabled="isCurrentPage(page)">
                    <span @click="navigateToPage(page)">
                        <i class="iconfont icon-home" v-if="page.url === '/'"></i>
                        <i class="iconfont icon-set" v-if="page.url === '/settings/sessions'"></i>
                        {{ $t(page.name) }}
                    </span>
                </s-dropdown-item>
                <s-dropdown-item v-for="action in actions"
                                 :key="action.name">
                    <span @click="action.callback">
                        <i class="iconfont icon-quit-s" v-if="action.className === 'logout'"></i>
                        {{ $t(action.name) }}
                    </span>
                </s-dropdown-item>
            </s-dropdown-menu>
        </s-dropdown>
    </section>
</template>

<script>
    import {getEffectivePermissions} from '../../rest/permissionService'
    import {getConnectionGroupTree} from '../../rest/connectionGroupService'
    import {delTokens} from '../../rest/authenticationService'
    import {getUser} from '../../rest/userService'
    import User from '@/common/types/User'
    import ConnectionGroup from '@/common/types/ConnectionGroup'
    import PageDefinition from '@/common/types/PageDefinition'
    import PermissionSet from '@/common/types/PermissionSet'
    import translationStringService from '@/common/utils/translationStringService'
    import ClientIdentifier from '@/common/navigation/ClientIdentifier'
    import {cloneDeep} from 'lodash'
    let SYSTEM_HOME_PAGE = new PageDefinition({
        name: 'USER_MENU.ACTION_NAVIGATE_HOME',
        url: '/'
    });
    export default {
        name: 'UserMenu',
        data() {
            return {
                userName: null,
                fullName: null,
                userURL: null,
                role: null,
                organization: null,
                pages: null,
                actions: null
            }
        },
        created() {
            this.userName = this.$store.getters.authenticationResult.userName;
            getUser(this.$store.getters.authenticationResult.dataSource, this.userName).then(({data}) => {
                this.fullName = data.attributes[User.Attributes.FULL_NAME];
                this.organization = data.attributes[User.Attributes.ORGANIZATION];
                this.role = data.attributes[User.Attributes.ORGANIZATIONAL_ROLE];
                // Link to email address if available
                let email = data.attributes[User.Attributes.EMAIL_ADDRESS];
                this.userURL = email ? 'mailto:' + email : null;
            });
            this.getMainPages();
            this.actions = [{
                name: 'USER_MENU.ACTION_LOGOUT',
                className: 'logout',
                callback: this.logout
            }];
        },
        props: {
            localActions: {
                type: Array
            }
        },
        methods: {
            // 退出系统
            logout() {
                localStorage.removeItem('GUAC_AUTH');
                this.$store.commit('REMOVE_TOKEN');
                delTokens().catch(() => {}).finally(() => {
                    this.$router.push('/login');
                });
            },
            isAnonymous() {
                return this.userName === '';
            },
            isCurrentPage(page) {
                return this.$router.currentRoute.fullPath === page.url;
            },
            navigateToPage(page) {
                this.$router.push(page.url)
            },
            getMainPages() {
                let rootGroups = null;
                let permissions = null;
                let getGroupTree = getConnectionGroupTree(this.$store.getters.authenticationResult.availableDataSources, ConnectionGroup.ROOT_IDENTIFIER)
                let getPermissions = getEffectivePermissions(this.$store.getters.authenticationResult.availableDataSources, this.userName);

                Promise.all(getGroupTree).then((retrievedRootGroups) => {
                    rootGroups = {};
                    retrievedRootGroups.forEach((item) => {
                        rootGroups[item.key] = item.value;
                    });
                    if (rootGroups && permissions) {
                       // 从用户页服务检索主页
                       this.pages = this.generateMainPages(rootGroups, permissions);
                    }
                }).catch((err) => {
                    this.$store.commit('setFatalError', err.response.data);
                    this.$router.push('/error');
                });
                Promise.all(getPermissions).then((retrievedPermissions) => {
                    permissions = {};
                    retrievedPermissions.forEach((item) => {
                        permissions[item.key] = item.value;
                    });
                    if (rootGroups && permissions) {
                      // 从用户页服务检索主页
                      this.pages = this.generateMainPages(rootGroups, permissions);
                    }
                }).catch((err) => {
                    this.$store.commit('setFatalError', err.response.data);
                    this.$router.push('/error');
                });
            },
            generateSettingsPages(permissionSets) {
                let pages = [];

                let canManageUsers = [];
                let canManageUserGroups = [];
                let canManageConnections = [];
                let canViewConnectionRecords = [];

                // Inspect the contents of each provided permission set
                this.$store.getters.authenticationResult.availableDataSources.forEach((dataSource) => {
                    // Get permissions for current data source, skipping if non-existent
                    let permissions = permissionSets[dataSource];
                    if (!permissions) {
                        return;
                    }

                    // Do not modify original object
                    permissions = cloneDeep(permissions);

                    // Ignore permission to update root group
                    PermissionSet.removeConnectionGroupPermission(permissions,
                        PermissionSet.ObjectPermissionType.UPDATE,
                        ConnectionGroup.ROOT_IDENTIFIER);

                    // Ignore permission to update self
                    PermissionSet.removeUserPermission(permissions,
                        PermissionSet.ObjectPermissionType.UPDATE,
                        this.userName);

                    // Determine whether the current user needs access to the user management UI
                    // 确定当前用户是否需要访问用户管理UI
                    if (
                        // System permissions 系统权限/建立用户组
                        PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.ADMINISTER) ||
                    PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.CREATE_USER) ||

                    // Permission to update users 更新用户权限
                    PermissionSet.hasUserPermission(permissions, PermissionSet.ObjectPermissionType.UPDATE) ||

                    // Permission to delete users 删除用户权限
                    PermissionSet.hasUserPermission(permissions, PermissionSet.ObjectPermissionType.DELETE) ||

                    // Permission to administer users 管理用户权限
                    PermissionSet.hasUserPermission(permissions, PermissionSet.ObjectPermissionType.ADMINISTER)
                    ) {
                        canManageUsers.push(dataSource);
                    }

                    // Determine whether the current user needs access to the group management UI
                    if (
                        // System permissions 系统权限/建立用户组
                        PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.ADMINISTER) ||
                    PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.CREATE_USER_GROUP) ||

                    // Permission to update user groups 更新用户组权限
                    PermissionSet.hasUserGroupPermission(permissions, PermissionSet.ObjectPermissionType.UPDATE) ||

                    // Permission to delete user groups 删除用户组权限
                    PermissionSet.hasUserGroupPermission(permissions, PermissionSet.ObjectPermissionType.DELETE) ||

                    // Permission to administer user groups 管理用户组权限
                    PermissionSet.hasUserGroupPermission(permissions, PermissionSet.ObjectPermissionType.ADMINISTER)
                    ) {
                        canManageUserGroups.push(dataSource);
                    }

                    // Determine whether the current user needs access to the connection management UI
                    if (
                        // System permissions 系统权限/建立连接/连接组
                        PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.ADMINISTER) ||
                    PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.CREATE_CONNECTION) ||
                    PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.CREATE_CONNECTION_GROUP) ||

                    // Permission to update connections or connection groups 更新连接/连接组
                    PermissionSet.hasConnectionPermission(permissions, PermissionSet.ObjectPermissionType.UPDATE) ||
                    PermissionSet.hasConnectionGroupPermission(permissions, PermissionSet.ObjectPermissionType.UPDATE) ||

                    // Permission to delete connections or connection groups 删除连接/连接组
                    PermissionSet.hasConnectionPermission(permissions, PermissionSet.ObjectPermissionType.DELETE) ||
                    PermissionSet.hasConnectionGroupPermission(permissions, PermissionSet.ObjectPermissionType.DELETE) ||

                    // Permission to administer connections or connection groups 管理连接/连接组
                    PermissionSet.hasConnectionPermission(permissions, PermissionSet.ObjectPermissionType.ADMINISTER) ||
                    PermissionSet.hasConnectionGroupPermission(permissions, PermissionSet.ObjectPermissionType.ADMINISTER)
                    ) {
                        canManageConnections.push(dataSource);
                    }

                    // Determine whether the current user needs access to view connection history
                    if (
                        // A user must be a system administrator to view connection records
                        // 用户必须是系统管理员才能查看连接记录
                        PermissionSet.hasSystemPermission(permissions, PermissionSet.SystemPermissionType.ADMINISTER)
                    ) {
                        canViewConnectionRecords.push(dataSource);
                    }
                });

                // Add link to Session management (always accessible)
                // 添加到会话管理的链接(总是可访问的)
                pages.push(new PageDefinition({
                    name: 'USER_MENU.ACTION_MANAGE_SESSIONS',
                    url: '/settings/sessions'
                }));

                // If user can manage connections, add links for connection management pages
                // 如果用户可以管理连接，请为连接管理页面添加链接 连接历史
                canViewConnectionRecords.forEach((dataSource) => {
                    pages.push(new PageDefinition({
                        name: [
                            'USER_MENU.ACTION_VIEW_HISTORY',
                            translationStringService.canonicalize('DATA_SOURCE_' + dataSource) + '.NAME'
                        ],
                        url: '/settings/' + encodeURIComponent(dataSource) + '/history'
                    }));
                });

                // If user can manage users, add link to user management page
                // 如果用户可以管理用户，添加链接到用户管理页面
                if (canManageUsers.length) {
                    pages.push(new PageDefinition({
                        name: 'USER_MENU.ACTION_MANAGE_USERS',
                        url: '/settings/users'
                    }));
                }

                // If user can manage user groups, add link to group management page
                // 如果用户可以管理用户组，请将链接添加到组管理页面
                if (canManageUserGroups.length) {
                    pages.push(new PageDefinition({
                        name: 'USER_MENU.ACTION_MANAGE_USER_GROUPS',
                        url: '/settings/userGroups'
                    }));
                }

                // If user can manage connections, add links for connection management pages
                // 如果用户可以管理连接，请为连接管理页面添加链接
                canManageConnections.forEach((dataSource) => {
                    pages.push(new PageDefinition({
                        name: [
                            'USER_MENU.ACTION_MANAGE_CONNECTIONS',
                            translationStringService.canonicalize('DATA_SOURCE_' + dataSource) + '.NAME'
                        ],
                        url: '/settings/' + encodeURIComponent(dataSource) + '/connections'
                    }));
                });

                // Add link to user preferences (always accessible)
                // 添加到用户首选项的链接(总是可访问的)
                pages.push(new PageDefinition({
                    name: 'USER_MENU.ACTION_MANAGE_PREFERENCES',
                    url: '/settings/preferences'
                }));

                return pages;
            },
            getClientPages(rootGroups) {
                let clientPages = [];

                // Determine whether a connection or balancing group should serve as
                // the home page
                for (let dataSource in rootGroups) {
                    addClientPages(clientPages, dataSource, rootGroups[dataSource]);
                }

                function addClientPages(clientPages, dataSource, connectionGroup) {
                    // Add pages for all child connections
                    connectionGroup.childConnections.forEach((connection) => {
                        clientPages.push(new PageDefinition({
                            name: connection.name,
                            url: '/client/' + ClientIdentifier.toString({
                                dataSource: dataSource,
                                type: ClientIdentifier.Types.CONNECTION,
                                id: connection.identifier
                            })
                        }));
                    });

                    // Add pages for all child balancing groups, as well as the connectable
                    // descendants of all balancing groups of any type
                    connectionGroup.childConnectionGroups.forEach((connectionGroup) => {
                        if (connectionGroup.type === ConnectionGroup.Type.BALANCING) {
                            clientPages.push(new PageDefinition({
                                name: connectionGroup.name,
                                url: '/client/' + ClientIdentifier.toString({
                                    dataSource: dataSource,
                                    type: ClientIdentifier.Types.CONNECTION_GROUP,
                                    id: connectionGroup.identifier
                                })
                            }));
                        }
                        addClientPages(clientPages, dataSource, connectionGroup);
                    });
                }

                return clientPages;
            },
            generateHomePage(rootGroups, permissions) {
                let settingsPages = this.generateSettingsPages(permissions);

                // If user has access to settings pages, return home page and skip
                // evaluation for automatic connections.  The Preferences page is
                // a Settings page and is always visible, and the Session management
                // page is also available to all users so that they can kill their
                // own session.  We look for more than those two pages to determine
                // if we should go to the home page.
                if (settingsPages.length > 2) {
                    return SYSTEM_HOME_PAGE;
                }
                // If exactly one connection or balancing group is available, use
                // that as the home page
                let clientPages = this.getClientPages(rootGroups);
                return (clientPages.length === 1) ? clientPages[0] : SYSTEM_HOME_PAGE;
            },
            generateMainPages(rootGroups, permissions) {
                let pages = [];
                // Get home page and settings pages
                let homePage = this.generateHomePage(rootGroups, permissions);
                let settingsPages = this.generateSettingsPages(permissions);
                // Only include the home page in the list of main pages if the user
                // can navigate elsewhere.
                if (homePage === SYSTEM_HOME_PAGE || settingsPages.length) {
                    pages.push(homePage);
                }
                // Add generic link to the first-available settings page
                if (settingsPages.length) {
                    pages.push(new PageDefinition({
                        name: 'USER_MENU.ACTION_MANAGE_SETTINGS',
                        url: settingsPages[0].url
                    }));
                }

                return pages;
            }
        }
    }
</script>

<style scoped>
    .user-menu {
        /* W3C */
        display: flex;
        align-items: stretch;
        flex-direction: row;
    }
    .user-menu .menu-title {
        font-weight: bold;
        padding-left: 2em;
    }
    .user-menu .profile {
        margin: 1em;
        padding-bottom: 1em;
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        width: 2in;
    }
    .user-menu .profile .full-name {
        font-weight: bold;
    }
    .user-menu .profile .full-name a{
        cursor: pointer;
        text-decoration: underline;
    }
    .user-menu .profile .organization,
    .user-menu .profile .organizational-role {
        font-size: 0.8em;
    }
</style>