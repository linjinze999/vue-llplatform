<template>
  <div class='page'>
    <div class="login-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px"
               class="demo-ruleForm login-container" status-icon>
        <h3 class="title">{{$t('login.modifyPass')}}</h3>
        <el-form-item prop="oldPass">
          <el-input type="password" v-model="ruleForm.oldPass" auto-complete="off"
                    :placeholder="$t('login.oldPass')"></el-input>
        </el-form-item>
        <el-form-item prop="newPass">
          <el-input type="password" v-model="ruleForm.newPass" auto-complete="off"
                    :placeholder="$t('login.newPass')"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off"
                    :placeholder="$t('login.checkPass')"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="loading">
            {{$t('common.ok')}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {requestChangePassword} from '@/api/user'

export default {
  name: 'FuncUserPassword',
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.inputPass')))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.inputCheckPass')))
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error(this.$t('login.errorCheckPass')))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        oldPass: '',
        newPass: '',
        checkPass: ''
      },
      rules: {
        oldPass: [
          {required: true, message: this.$t('login.inputOldPass'), trigger: 'blur'}
        ],
        newPass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleSubmit (ev) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$confirm(this.$t('login.changePassMessage'), this.$t('login.tip'), {
            confirmButtonText: this.$t('common.ok'),
            cancelButtonText: this.$t('common.cancel'),
            type: 'warning'
          }).then(() => {
            this.loading = true
            let changePasswordParams = {
              oldPass: this.ruleForm.oldPass,
              newPass: this.ruleForm.newPass,
              checkPass: this.ruleForm.checkPass
            }
            requestChangePassword(changePasswordParams).then(data => {
              this.loading = false
              this.$message({
                message: this.$t('login.changeSuccess'),
                type: 'success'
              })
            }).catch(err => {
              this.logining = false
              console.log(err)
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('login.cancel')
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>

.title {
  text-align: center;
  margin-bottom: 15px;
}

.page {
  background-color: #eff3f4;
  width: 100%;
  height: 100%;
  font-size: 16px;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: block;
  width: 400px;
  background-color: #FFF;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #DDD;
  border-radius: .5em;
  font-family: 'Source Sans Pro', sans-serif;
}

.login-box .svgContainer {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto 1em;
  border-radius: 50%;
  pointer-events: none;
}
</style>
