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
              <el-table-column label="姓名" width="180">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="角色" width="280">
                <template slot-scope="scope">
                  <span>{{ scope.row.roles.join(",") }}</span>
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
            角色
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('permissions.page')" name="third" :lazy="true">
          <el-card shadow="hover">
            页面
          </el-card>
        </el-tab-pane>
        <el-tab-pane :label="$t('permissions.db')" name="fourth" :lazy="true">
          <el-card shadow="hover">
            数据库
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
    dbDataToWebData (dbData) {
      let rolesJson = {}
      let pagesJson = {}
      let directiveJson = {}
      dbData.directive.forEach(directive => {
        if (!directiveJson.hasOwnProperty(directive.page_id)) {
          directiveJson[directive.page_id] = []
        }
        directiveJson[directive.page_id].push({id: directive.id, name: directive.name})
      })
      console.log(directiveJson)
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
      })
      dbData.roles.forEach(role => {
        rolesJson[role.id] = {
          id: role.id,
          name: role.name,
          pages: role.page_ids.reduce((pages, next_id) => {
            console.log(pages)
            pages.push(pagesJson[next_id] || {id: -1, name: 'Error', path: '/error/404', directive: []})
          }),
          directive: role.directive_ids.reduce((directive, next_id) => {
            directive.push(directiveJson[next_id] || {id: -1, name: 'Error', path: '/error/404'})
          })
        }
        this.roles.table.push(role)
      })
      dbData.users.forEach(user => {
        let roles = []
        user.role_ids.forEach(role_id => {
          roles.push(rolesJson[role_id].name)
        })
        this.users.table.push({
          id: user.id,
          name: user.name,
          role: roles
        })
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
    }
  },
  mounted () {
    requestPermissionsQuery().then(data => {
      this.dbDataToWebData(data.permissions)
    })
  }
}
</script>

<style scoped>

</style>
