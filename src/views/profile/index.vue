<template>
  <div class="app-container">
    <el-card>
      <el-tabs tab-position="left">
        <el-tab-pane label="基本设置">
          <UserCard :form="form" />
        </el-tab-pane>
        <el-tab-pane label="修改密码">
          <PassCard :form="form" />
        </el-tab-pane>
        <el-tab-pane label="登录日志">
          <LogCard />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getUserByName } from '@/api/user'
  import UserCard from './components/UserCard'
  import PassCard from './components/PassCard'
  import LogCard from './components/LogCard'
  export default {
    name: 'Profile',
    components: { UserCard, PassCard, LogCard },
    data() {
      return {
        form: {}
      }
    },
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
      },
      fetchData() {
        getUserByName(this.name).then(res => {
          if (res.code === 200) {
            this.form = res.data.user
            this.form.roles = res.data.roles
            this.form.dept = res.data.dept
          } else {
            this.$message.error(res.msg)
          }
        })
      }
    }
  }
</script>
<style lang="css" scoped>
  ::v-deep .el-tabs__header{width:224px;border-right:1px solid #f0f0f0}
  ::v-deep .el-tabs__nav-wrap{border:0}
  ::v-deep .el-tabs--left .el-tabs__item.is-left{padding-left:24px;text-align:left}
  ::v-deep .el-tabs__item:after{transform:scaleY(1);opacity:1;transition:transform .15s cubic-bezier(.645,.045,.355,1),opacity .15s cubic-bezier(.645,.045,.355,1);position:absolute;top:0;right:0;bottom:0;border-right:3px solid #1890ff;transform:scaleY(.0001);opacity:0;transition:transform .15s cubic-bezier(.215,.61,.355,1),opacity .15s cubic-bezier(.215,.61,.355,1);content:""}
  ::v-deep .el-tabs__item.is-active{font-weight:700;background-color:#e6f7ff}
  ::v-deep .el-tabs__item{font-variant:tabular-nums;font-feature-settings:"tnum","tnum";font-weight:500;color:rgba(0,0,0,.65);font-size:14px;text-align:left;list-style:none}
  ::v-deep .el-tabs__content{flex:1 1;padding:8px 40px}
</style>
