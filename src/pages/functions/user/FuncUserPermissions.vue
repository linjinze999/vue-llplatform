<template>
  <div>
    <el-card>
      {{ $t('permissions.instruction') }}
    </el-card>
    <br/>
    <el-card>
      <el-tabs v-model="activeName">
        <!-- Users -->
        <el-tab-pane :label="$t('permissions.user')" name="first" :lazy="true">
          <!-- Users *** Query -->
          <el-card shadow="hover">
            <el-form :inline="true" :model="users.query">
              <el-form-item label="ID">
                <el-input v-model="users.query.id" placeholder="ID"></el-input>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input v-model="users.query.name" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="角色">
                <el-select v-model="users.query.role" placeholder="角色" multiple>
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                  <el-option label="区域3" value="dfas"></el-option>
                  <el-option label="区域4" value="dsfas"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <br/>
          <!-- Users *** Table -->
          <el-card shadow="hover">
            <el-table
              :data="users.table.slice((users.currentPage-1)*users.pageSize,users.currentPage*users.pageSize)"
              style="width: 100%">
              <el-table-column label="ID">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="姓名">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="角色">
                <template slot-scope="scope">
                  <el-tag style="margin-right: 5px;" v-for="role in scope.row.roles" :key="role">{{role}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="userHandleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini" type="danger" @click="userHandleDelete(scope.$index, scope.row)">删除</el-button>
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
        <!-- Roles -->
        <el-tab-pane :label="$t('permissions.role')" name="second" :lazy="true">
          <!-- Roles *** Query -->
          <el-card shadow="hover">
            <el-form :inline="true" :model="roles.query">
              <el-form-item label="ID">
                <el-input v-model="roles.query.id" placeholder="ID"></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="roles.query.name" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="权限">
                <el-input v-model="roles.query.perm" placeholder="权限"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <br/>
          <!-- Roles *** Table -->
          <el-card shadow="hover">
            <el-table
              :data="roles.table.slice((roles.currentPage-1)*roles.pageSize,roles.currentPage*roles.pageSize)"
              style="width: 100%">
              <el-table-column label="ID">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="权限">
                <template slot-scope="scope">
                  <el-tag class="my-role-permission"
                          v-for="permission in scope.row.permission"
                          :key="permission">
                    <b>页面名称</b>: {{permission.name}}.
                    <b>地址URI</b>: {{permission.path}}.
                    <b>指令权限</b>: <span v-for="directive in permission.directive" :key="directive.id">
                      {{directive.name}};</span>
                  </el-tag>
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
        <!-- Pages -->
        <el-tab-pane :label="$t('permissions.page')" name="third" :lazy="true">
          <!-- Pages *** Query -->
          <el-card shadow="hover">
            <el-form :inline="true" :model="pages.query">
              <el-form-item label="ID">
                <el-input v-model="pages.query.id" placeholder="ID"></el-input>
              </el-form-item>
              <el-form-item label="名称">
                <el-input v-model="pages.query.name" placeholder="姓名"></el-input>
              </el-form-item>
              <el-form-item label="路径">
                <el-input v-model="pages.query.path" placeholder="路径"></el-input>
              </el-form-item>
              <el-form-item label="指令">
                <el-input v-model="pages.query.directive" placeholder="指令"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>
          <br/>
          <!-- Pages *** Table -->
          <el-card shadow="hover">
            <el-table
              :data="pages.table.slice((pages.currentPage-1)*pages.pageSize,pages.currentPage*pages.pageSize)"
              style="width: 100%">
              <el-table-column label="ID">
                <template slot-scope="scope">
                  <span>{{ scope.row.id }}</span>
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
                  <el-tag
                    style="margin-right: 5px;"
                    v-for="directive in scope.row.directive"
                    :key="directive">
                    {{directive}}
                  </el-tag>
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
        <!-- Dadabase -->
        <el-tab-pane :label="$t('permissions.db')" name="fourth" :lazy="true">
          <el-card shadow="hover">
            <el-card>
              以下是【用户权限】相关【数据库表】的示例。其中的【数组[]】表示跟另外一张表的一对多关系。<br/>
              你可以将其存成字符串，根据指定字符分割来记录； 也可以另外维护一张表来记录该关系。
            </el-card>
            <br/>
            <el-row :gutter="20">
              <!-- Dadabase *** Users -->
              <el-col :sm="24" :lg="12">
                <el-card shadow="hover">
                  <div slot="header">
                    <span>用户表：user</span>
                  </div>
                  <el-table
                    :data="dbData.users"
                    style="width: 100%">
                    <el-table-column label="id">
                      <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
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
                    <ol>
                      <li>role_ids：表示用户所属的角色，一个用户可能有多个角色。</li>
                    </ol>
                  </el-tag>
                </el-card>
              </el-col>
              <!-- Dadabase *** Roles -->
              <el-col :sm="24" :lg="12">
                <el-card shadow="hover">
                  <div slot="header">
                    <span>角色表：role</span>
                  </div>
                  <el-table
                    :data="dbData.roles"
                    style="width: 100%">
                    <el-table-column label="id">
                      <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
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
                    <ol>
                      <li>page_ids：表示角色拥有的页面权限。</li>
                      <li>directive_ids：表示角色拥有的页面指令权限。</li>
                    </ol>
                  </el-tag>
                </el-card>
              </el-col>
            </el-row>
            <br/>
            <el-row :gutter="20">
              <!-- Dadabase *** Pages -->
              <el-col :sm="24" :lg="12">
                <el-card shadow="hover">
                  <div slot="header">
                    <span>页面表：page</span>
                  </div>
                  <el-table
                    :data="dbData.pages"
                    style="width: 100%">
                    <el-table-column label="id">
                      <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
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
              </el-col>
              <!-- Dadabase *** Directive -->
              <el-col :sm="24" :lg="12">
                <el-card shadow="hover">
                  <div slot="header">
                    <span>页面指令权限表：directive</span>
                  </div>
                  <el-table
                    :data="dbData.directive"
                    style="width: 100%">
                    <el-table-column label="id">
                      <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
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
              </el-col>
            </el-row>
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
        query: {
          id: '',
          name: '',
          role: []
        },
        table: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        modifyDialog: false
      },
      roles: {
        query: {
          id: '',
          name: '',
          perm: ''
        },
        table: [],
        currentPage: 1,
        pageSize: 10,
        pageTotal: 0,
        modifyDialog: false
      },
      pages: {
        query: {
          id: '',
          name: '',
          path: '',
          directive: ''
        },
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
.my-role-permission {
  margin-top: 5px;
  display: block;
  height: auto;
}
.my-db-instruction {
  margin-top: 20px;
  display: block;
  height: auto;
  ol {
    margin-left: 20px;
  }
}
</style>
