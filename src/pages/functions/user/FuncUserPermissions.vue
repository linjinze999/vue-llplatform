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
            用户
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
      showData: {
        users: [],
        roles: [],
        pages: []
      },
      modifyData: {
        users: {},
        roles: {},
        pages: {}
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
      dbData.pages.forEach(page => {
        pagesJson[page.id] = {
          id: page.id,
          name: page.name,
          path: page.path,
          directive:directiveJson[page.id] || []
        }
      })
      dbData.roles.forEach(role => {
        rolesJson[role.id] = {
          id: role.id,
          name: role.name,
          pages: role.page_ids.reduce((pages, next_id) => {
            pages.push(pagesJson[next_id] || {id: -1, name: 'Error', path: '/error/404', directive:[]})
          }),
          directive: role.directive_ids.reduce((directive, next_id) => {
            directive.push(directiveJson[next_id] || {id: -1, name: 'Error', path: '/error/404'})
          })
        }
      })
    }
  },
  mounted () {
    requestPermissionsQuery().then(data => {

    })
  }
}
</script>

<style scoped>

</style>
