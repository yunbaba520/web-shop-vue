<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 警告区域 -->
    <el-alert
      title="添加商品信息"
      type="info"
      show-icon
      :closable="false"
      center
    >
    </el-alert>
    <!-- 进度条区域 -->
    <!-- activeIndex -0转化为数字 -->
    <el-steps
      :space="200"
      :active="activeIndex - 0"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- tab栏区域 -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="100px"
      label-position="top"
    >
      <el-tabs
        :tab-position="'left'"
        v-model="activeIndex"
        :before-leave="beforeLeave"
        @tab-click="tabClicked"
      >
        <!-- 当前tab栏是哪一项，获取name 双向绑定到activeIndex-->
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
              }"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <!-- 商品参数  2for循环-->
          <el-form-item
            v-for="item in manyTableData"
            :label="item.attr_name"
            :key="item.attr_id"
          >
            <!-- 多选框 -->
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                v-for="(ed, i) in item.attr_vals"
                :label="ed"
                :key="i"
                border
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <!-- 商品属性 -->
          <el-form-item
            v-for="item in onlyTableData"
            :label="item.attr_name"
            :key="item.attr_id"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!-- 图片上传 -->
          <!--action图片上传后台api地址  -->
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            list-type="picture"
            :headers="headersToken"
            :on-success="uploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
          <quill-editor
            ref="myQuillEditor"
            v-model="addForm.goods_introduce"
          />
          <!-- 提交按钮 -->
          <el-button type="primary" @click="addContent" class="addbut">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 观看图片对话框 -->
    <el-dialog title="观看图片" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" alt="" class="preview" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      //进度条激活项
      activeIndex: '0',
      //增加表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        //联级选择框选中三级分类，id
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        attrs : []  
      },
      //增加表单数据对象验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      //保存分类列表
      cateList: [],
      //动态获取参数列表
      manyTableData: [],
      //获取静态属性列表
      onlyTableData: [],
      //保存上传图片
      fileList: [],
      //上传图片请求头携带令牌
      headersToken: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      //观看图片的路径
      previewPath: '',
      //控制观看图片的显示与隐藏
      dialogVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获得分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }

      this.cateList = res.data
      console.log(this.cateList)
    },
    //联级选择框选中项发生变化
    handleChange() {
      console.log(this.addForm.goods_cat)
      //只允许选择三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    //监听tab标签页跳转进行验证
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName == 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    //tab被选中时
    async tabClicked() {
      //表示选中的是需要获得数据动态参数那一页
      if (this.activeIndex == '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes/`,
          {
            params: { sel: 'many' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数失败')
        }
        //获取成功，保存下来
        //console.log(res.data);
        this.manyTableData = res.data
        //把vals拆分成数组
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ')
        })
      }
      //静态属性
      if (this.activeIndex == '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes/`,
          {
            params: { sel: 'only' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        //获取成功，保存下来
       // console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    //上传图片，图片点击后的操作
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    //图片上传，删除图片的操作
    handleRemove(file) {
      //获取要删除图片路径
      //console.log(file);
      const filePath = file.response.data.tmp_path
      //在数组pics找到这个图片的索引值
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath
      })
      //根据索引值删除
      this.addForm.pics.splice(i, 1)
      //console.log(this.addForm.pics);
    },
    //上传成功钩子函数
    uploadSuccess(response) {
      //获得服务器临时地址
      const picInfo = { pic: response.data.tmp_path }
      //把临时地址放到增加表单对象中
      this.addForm.pics.push(picInfo)
      //console.log(this.addForm);
    },
    //提交商品内容
    async addContent() {
      //判断是否符合提交要求
      this.$refs.addFormRef.validate(vali => {
        if(!vali){
          return this.$message.error("请填写必要表单项")
        }
      })
      //符合提交要求
      //请求要求是字符窜，把goods_cat数组里面数据转为字符串
      //又因为联级选择器双向绑定的是数组，不能在元数据上操作
      //用lodash依赖，进行深拷贝
      const form = _.cloneDeep(this.addForm)
      form.goods_cat = form.goods_cat.join(',')
      //from 与addFrom互不影响
      //处理动态参数,循环把每一项追加到attrs数组中
      //console.log(this. manyTableData)
      this.manyTableData.forEach(item =>{
        const newInfo = {
          attr_id : item.attr_id,
          attr_value : item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newInfo)
      })
      //处理静态属性
      this.onlyTableData.forEach(item =>{
        const newInfo = {
          attr_id : item.attr_id,
          attr_value: item.attr_vals
        }
        this.addForm.attrs.push(newInfo)
      })
      //给form 
      form.attrs = this.addForm.attrs
      //console.log(form);
      // console.log(this.addForm);
      //提交
      const {data:res} = await this.$http.post('goods', form)
      if(res.meta.status !== 201){
        return this.$message.error("提交失败")
      }  
      this.$message.success("提交成功")
      this.$router.push('/goods')
    }
  },
}
</script>

<style>
.el-steps {
  margin: 15px 0;
}
.el-step__title {
  font-size: 13px !important;
}
.el-checkbox {
  margin: 0 0 0 6px !important;
}
.preview {
  width: 100%;
}
.addbut {
  margin: 15px 0 !important;
}
</style>