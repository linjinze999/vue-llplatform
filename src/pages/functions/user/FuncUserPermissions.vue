<template>
  <div>
    <el-card>
      {{ $t('permissions.instruction') }}
    </el-card>
    <br/>
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('permissions.user')" name="first" :lazy="true">
          <el-card shadow="hover">
            <el-table
              :data="users.table.slice((users.currentPage-1)*users.pageSize,users.currentPage*users.pageSize)"
              style="width: 100%">
              <el-table-column label="ID">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="姓名">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="角色">
                <template slot-scope="scope">
                  <span>{{ scope.row.roles.join(', ') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="userHandleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="userHandleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="userHandleSizeChange"
              @current-change="userHandleCurrentChange"
              background
              :current-page="users.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="users.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="users.pageTotal">
            </el-pagination>
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('permissions.role')" name="second" :lazy="true">
          <el-card shadow="hover">
            <el-table
              :data="roles.table.slice((roles.currentPage-1)*roles.pageSize,roles.currentPage*roles.pageSize)"
              style="width: 100%">
              <el-table-column label="ID">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="权限">
                <template slot-scope="scope">
                  <span>{{ scope.row.permission }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="roleHandleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="roleHandleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="roleHandleSizeChange"
              @current-change="roleHandleCurrentChange"
              background
              :current-page="roles.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="roles.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="roles.pageTotal">
            </el-pagination>
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('permissions.page')" name="third" :lazy="true">
          <el-card shadow="hover">
            <el-table
              :data="pages.table.slice((pages.currentPage-1)*pages.pageSize,pages.currentPage*pages.pageSize)"
              style="width: 100%">
              <el-table-column label="ID">
                <template slot-scope="scope">
                  <span style="margin-left: 10px">{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="路径">
                <template slot-scope="scope">
                  <span>{{ scope.row.path }}</span>
                </template>
              </el-table-column>
              <el-table-column label="指令权限">
                <template slot-scope="scope">
                  <span>{{ scope.row.directive.join(', ') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="pageHandleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="pageHandleDelete(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="pageHandleSizeChange"
              @current-change="pageHandleCurrentChange"
              background
              :current-page="pages.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pages.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pages.pageTotal">
            </el-pagination>
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('permissions.db')" name="fourth" :lazy="true">
          <el-card shadow="hover">
            <el-card>
              以下是【用户权限】相关【数据库表】的示例。其中的【数组[]】表示跟另外一张表的一对多关系。<br/>
              你可以将其存成字符串，根据指定字符分割来记录； 也可以另外维护一张表来记录该关系。
            </el-card>
            <br/>
            <el-card shadow="hover">
              <div slot="header">
                <span>用户表：user</span>
              </div>
              <el-table
                :data="dbData.users"
                style="width: 100%">
                <el-table-column label="id">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="name">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="role_ids">
                  <template slot-scope="scope">
                    <span>{{ scope.row.role_ids }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-tag class="my-db-instruction">
                <h4>说明：</h4>
                <ol style="margin-left: 20px;">
                  <li>role_ids：表示用户所属的角色，一个用户可能有多个角色。</li>
                </ol>
              </el-tag>
            </el-card>
            <br>
            <el-card shadow="hover">
              <div slot="header">
                <span>角色表：role</span>
              </div>
              <el-table
                :data="dbData.roles"
                style="width: 100%">
                <el-table-column label="id">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="name">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="page_ids">
                  <template slot-scope="scope">
                    <span>{{ scope.row.page_ids }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="directive_ids">
                  <template slot-scope="scope">
                    <span>{{ scope.row.directive_ids }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-tag class="my-db-instruction">
                <h4>说明：</h4>
                <ol style="margin-left: 20px;">
                  <li>page_ids：表示角色拥有的页面权限。</li>
                  <li>directive_ids：表示角色拥有的页面指令权限。</li>
                </ol>
              </el-tag>
            </el-card>
            <br/>
            <el-card shadow="hover">
              <div slot="header">
                <span>页面表：page</span>
              </div>
              <el-table
                :data="dbData.pages"
                style="width: 100%">
                <el-table-column label="id">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="name">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="path">
                  <template slot-scope="scope">
                    <span>{{ scope.row.path }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-tag class="my-db-instruction">
                <h4>说明：</h4>
                <ol>
                  <li>path：表示页面路径地址。</li>
                </ol>
              </el-tag>
            </el-card>
            <br/>
            <el-card shadow="hover">
              <div slot="header">
                <span>页面指令权限表：directive</span>
              </div>
              <el-table
                :data="dbData.directive"
                style="width: 100%">
                <el-table-column label="id">
                  <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.id }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="name">
                  <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="page_id">
                  <template slot-scope="scope">
                    <span>{{ scope.row.page_id }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-tag class="my-db-instruction">
                <h4>说明：</h4>
                <ol>
                  <li>page_id：表示指令权限所属的页面。</li>
                </ol>
              </el-tag>
            </el-card>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {requestPermissionsQuery} from '@/api/user'

export default {
  name: 'FuncUserPermissions',
  data () {
    return {
      activeName: 'first',
      users: {
        table: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        modifyDialog: false
      },
      roles: {
        table: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        modifyDialog: false
      },
      pages: {
        table: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        modifyDialog: false
      },
      modifyData: {
        roles: {},
        pages: {},
        directive: {}
      },
      dbData: {
        users: [],
        roles: [],
        pages: [],
        directive: []
      }
    }
  },
  methods: {
    dbDataToWebData () {
      let dbData = this.dbData
      let rolesJson = {}
      let pagesJson = {}
      let directiveJson = {}
      dbData.directive.forEach(directive => {
        if (!directiveJson.hasOwnProperty(directive.page_id)) {
          directiveJson[directive.page_id] = []
        }
        directiveJson[directive.page_id].push({id: directive.id, name: directive.name})
      })
      dbData.pages.forEach(page => {
        pagesJson[page.id] = {
          id: page.id,
          name: page.name,
          path: page.path,
          directive: directiveJson[page.id] || []
        }
        let directives = []
        pagesJson[page.id].directive.forEach(directive => {
          directives.push(directive.name)
        })
        this.pages.table.push({
          id: page.id,
          name: page.name,
          path: page.path,
          directive: directives
        })
        this.pages.pageTotal += 1
      })
      dbData.roles.forEach(role => {
        role.page_ids = role.page_ids || []
        role.directive_ids = role.directive_ids || []
        rolesJson[role.id] = {
          id: role.id,
          name: role.name,
          pages: role.page_ids.reduce((pages_arr, page_id) => {
            pages_arr.push(pagesJson[page_id] || {id: -1, name: 'Error', path: '/error/404', directive: []})
            return pages_arr
          }, []),
          directive: role.directive_ids.reduce((directive, directive_id) => {
            directive.push(directiveJson[directive_id] || {id: -1, name: 'Error', path: '/error/404'})
            return directive
          }, [])
        }
        this.roles.table.push({
          id: role.id,
          name: role.name,
          permission: role.page_ids.reduce((pages_arr, page_id) => {
            pages_arr.push(pagesJson[page_id] || {id: -1, name: 'Error', path: '/error/404', directive: []})
            return pages_arr
          }, [])
        })
        this.roles.pageTotal += 1
      })
      dbData.users.forEach(user => {
        let roles = []
        user.role_ids.forEach(role_id => {
          roles.push(rolesJson[role_id].name)
        })
        this.users.table.push({
          id: user.id,
          name: user.name,
          roles: roles
        })
        this.users.pageTotal += 1
      })
    },
    userHandleEdit (index, row) {
      console.log(1)
    },
    userHandleDelete (index, row) {
      console.log(2)
    },
    userHandleSizeChange (size) {
      this.users.pagesize = size
    },
    userHandleCurrentChange (currentPage) {
      this.users.currentPage = currentPage
    },
    roleHandleEdit (index, row) {
      console.log(1)
    },
    roleHandleDelete (index, row) {
      console.log(2)
    },
    roleHandleSizeChange (size) {
      this.roles.pagesize = size
    },
    roleHandleCurrentChange (currentPage) {
      this.roles.currentPage = currentPage
    },
    pageHandleEdit (index, row) {
      console.log(1)
    },
    pageHandleDelete (index, row) {
      console.log(2)
    },
    pageHandleSizeChange (size) {
      this.pages.pagesize = size
    },
    pageHandleCurrentChange (currentPage) {
      this.pages.currentPage = currentPage
    }
  },
  mounted () {
    requestPermissionsQuery().then(data => {
      this.dbData = data.permissions
      this.dbDataToWebData()
    })
  }
}
</script>

<style scoped lang="scss">
.my-db-instruction {
  margin-top: 20px;
  display: block;
  height: auto;
  ol {
    margin-left: 20px;
  }
}
</style>
