<template>
  <el-dialog title="分配权限" :before-close="handleClose" :visible.sync="permissionDialog" width="33%">
    <el-tree
      ref="tree"
      :data="menuTree"
      :props="treeProps"
      node-key="id"
      :default-checked-keys="form.menuIds"
      :default-expanded-keys="form.menuIds"
      highlight-current
      show-checkbox
      check-strictly
      :expand-on-click-node="false"
      @check-change="handleCheckChange"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">
        取消
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        更新
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getMenuTree } from '@/api/menu'

  export default {
    props: {
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      permissionDialog: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        menuTree: [],
        treeProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {
      getMenuTree().then(res => {
        this.menuTree = res.data
      })
    },
    methods: {
      handleClose() {
        this.$refs.tree.setCheckedKeys([])
        this.$emit('update:permissionDialog', false)
        this.$emit('update:form', {})
      },
      // 节点勾选事件
      handleCheckChange(data) {
        if (this.form.menuIds != undefined && this.form.menuIds != null) {
          this.form.menuIds = this.$refs.tree.getCheckedKeys()
        }
      },
      handleSubmit() {
        this.$emit('permissionModelOpen')
      }
    }
  }
</script>

<style lang="css">

</style>

