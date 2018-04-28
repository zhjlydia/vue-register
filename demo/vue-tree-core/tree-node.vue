<style>
.vue-tree-fr {
  float: right;
}
.vue-tree-clearfix {
  *zoom: 1;
}
.vue-tree-clearfix:after {
  content: "";
  display: table;
  clear: both;
}

.vue-node-dragging {
  z-index: 9999;
  position: absolute;
  width: 100%;
  display: block;
  margin-top: -10px; /*bfc fix*/
}
/*折叠框样式*/
.vue-node-collapse,
.vue-node-expand,
.vue-tree-invisible {
  cursor: pointer;
  display: inline-block;
  height: 30px;
  width: 20px;
  /* margin-right:12px; */
  position: relative;
  font-style: normal;
  vertical-align: middle;
}

.vue-node-collapse:before,
.vue-node-expand:before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  top: 12px;
  left: 6px;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4.5px solid  #30404F;
  transition: all 0.2s ease-in-out;
}
/* .vue-tree-titleWrap */
.vue-node-collapse:before {
  -ms-transform: rotate(-90deg) scale(1);
  transform: rotate(-90deg) scale(1);
}
.vue-tree-titleWrap{
    letter-spacing: -3px;
    display:inline-block;
    height:40px;
}
.vue-tree-icon,
.vue-tree-title{
  font-size: 14px;
  vertical-align: middle;
  letter-spacing:0;
}
.vue-tree-title{
    display: inline-block;
    width:240px;
    height: 30px;
    line-height: 26px;
    border-radius:2px;
    border: 2px solid transparent;
    cursor: default;
    white-space:nowrap; 
    text-overflow:ellipsis; 
    -o-text-overflow:ellipsis; 
    overflow:hidden;
}
.vue-tree-title>span{
  vertical-align: middle;
}

.vue-tree-btn-wrap{
  margin-left:16px;
}
.vue-tree-btn{
  cursor: pointer;
  font-size: 16px;
}

/*checkbox样式 开始*/
.vue-tree-checkbox {
  width: 12px;
  height: 12px;
  display: inline-block;
  border: 1px solid #ccc;
}
.vue-tree-checkbox-selected {
  background: #7c9eb2;
}
.vue-tree-checkbox-disabled {
  background: rgba(0, 0, 0, 0.2);
}
/*checkbox样式 结束*/
.vue-tree-loading{
  font-size:14px;
  height:20px;
  width:20px;
  line-height: 20px !important;
  text-align: center;
  letter-spacing: 0;
  vertical-align: middle;
}
/*拖拽样式 开始*/
.tree-draggable{
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* Required to make elements draggable in old WebKit */
  -khtml-user-drag: element;
  -webkit-user-drag: element;
  cursor:move;
}
.tree-drag-over {
  background-color: #5295E7;
  color: white;
  border: 2px #5295E7 solid;
}
.tree-drag-over-top {
  border-top: 2px #5295E7 solid;
}
.tree-drag-over-bottom {
  border-bottom: 2px #5295E7 solid;
}
.tree-drag-over.tree-drop-disabled {
  background-color: #f6f6f6;
  color: #ccc;
  border: 2px #f6f6f6 solid;
}
.tree-drag-over-top.tree-drop-disabled {
  border-top: 2px #f6f6f6 solid;
}
.tree-drag-over-bottom.tree-drop-disabled {
  border-bottom: 2px #f6f6f6 solid;
}
.tree-drag-selected{
  background-color:#deeaf7;
}
.tree-drag-disabled{
   cursor:default;
}
.tree-drag-disabled :hover{
   color:#bbb; 
}
/*拖拽样式 结束*/
.vue-tree-invisible{
  visibility: hidden;
}
.vue-tree-rootHandle{
  display: none;
}
.ivu-tooltip-rel{
  line-height: 1;
}
.ivu-tooltip-inner{
  padding:6px 15px;
}

</style>

<template>
<li ref="draggAbleEle" :class="draggingClass" data-wrap>

          <!--这里onDragStart事件和接收目标上的事件不能绑在同一个元素上，否则真机IE10下 会无法触发接收事件-->
          <div class="vue-tree-clearfix" :class="nodeHandleClass" data-handle>  
          <span :class="treeTitleWrap" ref="dropTarget">
              <!-- 折叠图标 -->
              <span :class="collapseWrapClass">
                <i v-show="showArrow" :class="collapseStatus" @click="toggleCollapseStatus"></i>
                <!-- 加载图标 -->
                <Icon v-show="showLoading" type="loading" class="ivu-load-loop vue-tree-loading"></Icon>  
              </span>
              <!-- 模拟勾选框（单选或多选） -->
              <i :class="checkboxClass" v-show=" nodeData.prop.checkable"   @click="toggleChecbox"></i>
              <Icon :type="nodeData.iconType" v-if="nodeData.isUseIcon && !nodeData.isIconAtRight" class="vue-tree-icon"></Icon>
              <span :class="[treeTitleClass,dragClasses,dragOverClass]" ref="draggAbleDom">
                <span ref="nodeTitle" :title="isTextOverFlow && nodeData.title">{{nodeData.title}}</span>
                <Icon :type="nodeData.iconType" v-if="nodeData.isUseIcon && nodeData.isIconAtRight" class="vue-tree-icon"></Icon>
              </span>
          </span>

            <span class="vue-tree-fr">
                <span class="vue-tree-btn-wrap" v-if="nodeData.handleList && nodeData.handleList.length" v-for="(dataList,index) in nodeData.handleList" :key="index">
                  <a v-if="!dataList.isUseIcon" v-show="dataList.isShow" href="javascript:;" @click="key2FuncMap(dataList.key, dataList)">{{dataList.text}}</a>
                  <Tooltip :content="dataList.toolTipText" :disabled="dataList.toolTipDisable" :delay="1000" placement="top" :transfer="true">
                    <span @click="key2FuncMap(dataList.key, dataList)">
                      <Icon :type="dataList.iconType" v-if="dataList.isUseIcon" v-show="dataList.isShow" class="vue-tree-icon vue-tree-btn"></Icon>
                    </span>
                  </Tooltip>
                </span>
            </span>
        </div>
        <!-- 子节点 -->
        <ol v-show="nodeData.nodes.length && nodeData.prop.isExpand">
            <vue-tree-node v-for="(node,index) in nodeData.nodes" 
              :key="index" 
              :node-data="node" 
              :parent-node-data="nodeData"
              :root-data="rootData"
            ></vue-tree-node>
        </ol>
</li>

</template>

<script>
import { throttle, debounce } from '../../utils/throttle';
let mouseOffsetY=0;//鼠标位置
export default {
  name: "vueTreeNode",
  props: {
    nodeData: {
      type: Object
    },
    parentNodeData: {
      type: Object,
      default: null
    },
    rootData:{
      type: Object,
      default: null
    }
  },
  watch:{
    nodeData:{
      handler(newVal, oldVal){
        if(!newVal._hash){
          this.init();
        }
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
    //绑定拖拽事件
    if(this.rootData.globalConfig.draggable){
      this.$refs.draggAbleDom.draggable= !this.nodeData.prop.noDrag;
      this.$refs.draggAbleDom.ondragstart= this.onDragStart;

      this.$refs.dropTarget.ondragenter=this.onDragEnter;
      this.$refs.dropTarget.ondragover=this.onDragOver;
      this.$refs.dropTarget.ondragleave=this.onDragLeave;
      this.$refs.dropTarget.ondrop=this.onDrop;
      this.$refs.dropTarget.ondragend=this.onDragEnd;
    }
    this.calcTitleOverFlow();
    
  },
  computed: {
    collapseWrapClass(){
      return {
        "vue-tree-invisible": ("loading" in this.nodeData) ? false : (this.nodeData.isHiddenCollapseIcon || !this.nodeData.nodes.length),
        "vue-tree-rootHandle": !this.parentNodeData
      }
    },

    treeTitleWrap(){
        typeof this.rootData.globalConfig.styles === undefined ? this.rootData.globalConfig.styles = {}:false;
        
        return this.rootData.globalConfig.styles.titleWrap
        ? this.rootData.globalConfig.styles.titleWrap
        : "vue-tree-titleWrap";
    },
    treeTitleClass(){
      typeof this.rootData.globalConfig.styles === undefined ? this.rootData.globalConfig.styles = {}:false;

      return this.rootData.globalConfig.styles.titleText
        ? this.rootData.globalConfig.styles.titleText
        : "vue-tree-title";                                   
    },
    draggingClass() {
      return {
        "vue-node-dragging": this.params.flag
      };
    },
    nodeHandleClass() {

      typeof this.rootData.globalConfig.styles === undefined ? this.rootData.globalConfig.styles = {}:false;

      return this.rootData.globalConfig.styles.nodeHandle
        ? this.rootData.globalConfig.styles.nodeHandle
        : "vue-tree-handle";
    },
    showArrow() {
      return (this.nodeData.nodes && this.nodeData.nodes.length) || ("loading" in this.nodeData && !this.nodeData.loading);
    },
    showLoading () {
      return "loading" in this.nodeData && this.nodeData.loading;
    },
    checkboxClass() {

      typeof this.rootData.globalConfig.styles === undefined ? this.rootData.globalConfig.styles = {}:false;

      return [
        this.rootData.globalConfig.styles.checkbox
          ? this.rootData.globalConfig.styles.checkbox
          : "vue-tree-checkbox",
        this.rootData.globalConfig.styles.checkboxSelected
          ? {
              [this.rootData.globalConfig.styles.checkboxSelected]: this.nodeData
                .prop.isChecked
            }
          : { "vue-tree-checkbox-selected": this.nodeData.prop.isChecked },
        this.rootData.globalConfig.styles.checkDisabled
          ? {
              [this.rootData.globalConfig.styles.checkDisabled]: this.nodeData.prop
                .isDisabled
            }
          : { "vue-tree-checkbox-disabled": this.nodeData.prop.isDisabled }
      ];
    },
    collapseStatus() {

      typeof this.rootData.globalConfig.styles === undefined ? this.rootData.globalConfig.styles = {}:false;

      return [
        this.rootData.globalConfig.styles.iconCollapse
          ? {
              [this.rootData.globalConfig.styles.iconCollapse]: !this.nodeData.prop
                .isExpand
            }
          : { "vue-node-collapse": !this.nodeData.prop.isExpand },
        this.rootData.globalConfig.styles.iconExpanded
          ? {
              [this.rootData.globalConfig.styles.iconExpanded]: this.nodeData.prop
                .isExpand
            }
          : { "vue-node-expand": this.nodeData.prop.isExpand }
      ];
    },
    dragClasses() {
      return [
              {
                ["tree-draggable"]:this.rootData.globalConfig.draggable && !this.nodeData.prop.noDrag,
                ["tree-drag-selected"]: this.dragNodeHighlight,
                ["tree-drag-disabled"]: this.nodeData.prop.noDrag,//禁用该节点的拖拽
                ["tree-drop-disabled"]: this.nodeData.prop.noDrop,//该节点禁用放置
            }
       ];
    }
  },
  data() {
    return {
      currentDepth: 0,
      currentEditValue: "",
      params: {
        left: 0,
        top: 0,
        currentX: 0,
        currentY: 0,
        flag: false
      },
      draggingData: {
        placeholderSize: {
          width: "0px",
          height: "0px"
        },
        nodeData: null
      },
      isTextOverFlow:false,
      dragOverClass:"",
      dragNodeHighlight:false //拖拽元素是否高亮
    };
  },
  methods: {
    calcTitleOverFlow(){
      if(this.$refs.nodeTitle.offsetWidth > this.$refs.draggAbleDom.offsetWidth){
        this.isTextOverFlow = true;
      }
    },
    /**
     * 初始化函数
     */
    init(){
      /**
       * 每次初始化实例时执行构建树的操作
       * **/
      //遍历第一层的的时候
      if (!this.parentNodeData) {
        this.nodeData._hash = this.generateHash();
        this.rootData._UITreeMap = {};
        this.rootData._UITreeMap[this.nodeData._hash] = {};

        /**
         * 给全局配置添加内部属性
         * **/
      }
      this.setInitNodeValue();
      this.setNodeDataMap();
    },

    /**
     * 给传入节点赋予默认值
     **/
    setInitNodeValue() {
        //【prop属性类型校验】
        if (
          "prop" in this.nodeData &&
          !this.checkThisType(this.nodeData.prop, "object")
        ) {
          throw new Error("传入prop的类型必须为对象");
        }
        //【增加必要函数】
        this.$set(this.nodeData,"fn",{});
        this.$set(this.nodeData.fn,"getAllNodeData", () => this.rootData._UITreeMap);
        this.$set(this.nodeData.fn, "remove", this.remove);
        this.$set(this.nodeData.fn, "getParent", () => this.parentNodeData);
        this.$set(this.nodeData.fn, "getChildren", () => this.nodeData.nodes);
        this.$set(this.nodeData.fn, "getDepthInParent", this.getDepthInParent);
        this.$set(this.nodeData.fn, "getDepthWithChildren", this.getDepthWithChildren)
        //【无传入prop对象时默认创建prop对象】
        if (!("prop" in this.nodeData)) {

          this.$set(this.nodeData, "prop", {
            isExpand: true,
            checkable: false,
            showCollapseIcon:false,
            isDisabled: false,
            isChecked: false,
            noDrag:false,//此节点禁用拖拽
            noDrop:false,//此节点禁用放置
            _isEdit: false
          });
          
        }else{
          //【有传入prop对象时检查默认值】
          //赋予内部属性
          this.$set(this.nodeData.prop, "_isEdit", false);

          //赋予可扩展属性和默认值
          //  是否展开this.nodeData.prop.isExpand
          this.checkAndSetInitValue("isExpand",this.nodeData.prop,"boolean", true);
          //  是否可选中this.nodeData.prop.checkable
          this.checkAndSetInitValue("checkable",this.nodeData.prop,"boolean",false);
          //  是否禁用this.nodeData.prop.checkbox
          this.checkAndSetInitValue("isDisabled",this.nodeData.prop,"boolean",false);
          // 是否默认选中this.nodeData.prop.isChecked
          this.checkAndSetInitValue("isChecked",this.nodeData.prop,"boolean",false);
          // 是否默认选中this.nodeData.prop.noDrag
          this.checkAndSetInitValue("noDrag",this.nodeData.prop,"boolean",false);
          // 是否默认选中this.nodeData.prop.noDrop
          this.checkAndSetInitValue("noDrop",this.nodeData.prop,"boolean",false);
          
        }
      },

      /**
       * 给当前节点数据模型写入唯一hash标识，建立dom -> hash -> 数据 的标识
       * */
      setNodeDataMap() {
        
        //针对添加节点操作，本身是没有hashkey的，这个时候在初始化的时候增加hashKey
        if(this.nodeData._hash === undefined){
          this.nodeData._hash = this.generateHash();
          this.rootData._UITreeMap[this.nodeData._hash] = {};
        }

        /**
         *  额外维护一份 hash值映射=>数据模型的表，方便后期做拖拽扩展，减少遍历性能开销
         * */
        //保存当前节点的数据模型
        this.rootData._UITreeMap[this.nodeData._hash] = this.nodeData;
      },

      //切换勾选状态
      toggleChecbox() {
        
        if (this.nodeData.prop.isDisabled) {
          return;
        }

        //如果是多选，正常选择功能
        if(!this.rootData.globalConfig.singleSelect){

          this.nodeData.prop.isChecked = !this.nodeData.prop.isChecked;
        }else{
          // 单选的话只能高亮一个勾选项
          this.nodeData.prop.isChecked = true;
          var currHash = this.nodeData._hash;
          
          for (var p in this.rootData._UITreeMap) {
            //反选调所有除本次勾选节点以外所有的节点的状态
            var currentNode = this.rootData._UITreeMap[p];
            if(currentNode.prop.isChecked == true && p !== currHash){
              currentNode.prop.isChecked = false;
            }
          }
        }
        //勾选输出单选和多选区别对待
        var arr = [];
        if(!this.rootData.globalConfig.singleSelect){
          for (var p in this.rootData._UITreeMap) {
            if (this.rootData._UITreeMap[p].prop.isChecked) {
              arr.push(this.rootData._UITreeMap[p]);
            }
          }
        }else{
          arr = [this.nodeData]
        }
        //增加每次勾选的事件
        this.rootData.rootInstance.$emit("on-selected-change",arr,this.nodeData);
      },

      //切换折叠状态
      toggleCollapseStatus() {
        var item = this.nodeData;
        if (item.nodes.length === 0 && !this.nodeData.prop.isExpand) {
          //异步请求子节点数据
          if (this.rootData.rootInstance.loadData && ("loading" in this.nodeData) && !this.nodeData.loading) {
            this.$set(this.nodeData, 'loading', true);
            this.rootData.rootInstance.loadData(item, children => {
              this.$set(this.nodeData, 'loading', false);
              if (children.length) {
                this.$set(this.nodeData, 'nodes', children);
                this.$nextTick(() => this.toggleCollapseStatus());
              }
            });
            return;
          }
        }
        //展开或收起节点
        if ((item.nodes && item.nodes.length) || !item.nodes.length && this.nodeData.prop.isExpand) {
          this.nodeData.prop.isExpand = !this.nodeData.prop.isExpand;
        }
      },
      //添加子节点
      addNode() {
        this.rootData.rootInstance.$emit("on-add",this.nodeData)
      },

      
      deleteThisNode() {
        var defer = this.defered();
        this.rootData.rootInstance.$emit("on-delete",this.nodeData,defer);
        defer.promise.then(()=>{this.remove()})
      },

      //获得当前节点在父节点的深度
      getDepthInParent(limitNodeHashKey){
        
        var depth = 1,
        curParentNode = this.nodeData.fn.getParent();
        while (curParentNode) {
          //当前父级是限定的父级，停止继续计算深度
          if(curParentNode._hash == limitNodeHashKey){
            depth++;
            break;
          }
          curParentNode = curParentNode.fn.getParent();
          depth++;
        }
        return depth;
      },
      //获得从当前节点到所有子节点的深度
      getDepthWithChildren(){
        var maxDepth = 1;

        //递归遍历所有子节点的深度
        var loopFindLastNodes = (dataList,callback)=>{
          //已经是最后一层返回1
          if(!dataList.length) {
            callback(1);
            return;
          }
          
          dataList.map((item)=>{
            if(item.nodes.length){
              loopFindLastNodes(item.nodes,callback)
            }else{
              callback(item);
            }
          })

        }
        var depthArr =[];
        //找到每个最底层的叶子节点，计算其到当前节点的深度
        loopFindLastNodes(this.nodeData.nodes,(item)=>{
          if(item == 1){
            depthArr = [1];
            return;
          }
          depthArr.push(item.fn.getDepthInParent(this.nodeData._hash));
        })
        // console.log("当前所有节点深度："+ JSON.stringify(depthArr))
        return Math.max.apply(null,depthArr);
      },

      //删除自身和子树,同时删除其数据模型
      remove(){
        //如果是根节点，直接删除
        if(!this.parentNodeData){
          this.rootData.rootInstance.$emit("destory");
          return;
        }

         var i = this.parentNodeData.nodes.findIndex(item =>item._hash == this.nodeData._hash);

         //如果不存在子树
         if (!this.nodeData.nodes.length) {
           this.rootData._UITreeMap[this.nodeData._hash] = null;
           delete this.rootData._UITreeMap[this.nodeData._hash];
         } else {
           //找到树中删除所有建立的索引
           this.nodeData.nodes.map(item => item._hash).map(hashKey => {
             this.rootData._UITreeMap[hashKey].fn.remove();
             delete this.rootData._UITreeMap[this.nodeData._hash];
           });
        }
        //最后删除数据
        this.parentNodeData.nodes.splice(i, 1);
      },
      
      //编辑当前节点
      editThisNode() {
        this.rootData.rootInstance.$emit("on-edit",this.nodeData)
        this.nodeData.prop._isEdit = true;
      },

      //检查属性的类型并且设置默认值
      checkAndSetInitValue(prop, Obj, type, initValue) {
        if (!(prop in Obj)) {
          this.$set(Obj, prop, initValue);
        } else if (!this.checkThisType(Obj[prop], type)) {
          var typeMap = {
            boolean: "布尔值",
            string:"字符串"
          };

          throw new Error(`树型组件传入prop.${prop}必须为${typeMap[type]}`);
        }
      },
    //拖拽处理-huijuan
    //计算拖拽节点的放置方式0（作为目标节点的子节点），-1（放置在目标节点的前面）,1（放置在目标节点的后面）
    calDropPosition(e) {
      var offsetTop = this.getOffset(e.target).top;
      var offsetHeight = e.target.offsetHeight;
      var pageY = e.pageY;
      var gapHeight = 0.2 * offsetHeight;
      if (pageY > offsetTop + offsetHeight - gapHeight) {//放在目标节点后面-同级
        return 1;
      }
      if (pageY < offsetTop + gapHeight) {//放在目标节点前面-同级
        return -1;
      }
      //放在目标节点里面-作为子节点
      return 0;
    },
    //设置hover样式
    setDragOverClass(){
      var pos = this.rootData.dragOverStatus.dropPosition;
      if (pos === 0) {
        return "tree-drag-over";
      }
      else if (pos === -1) {
        return "tree-drag-over-top";
      }
      else if (pos === 1) {
        return "tree-drag-over-bottom"
      }
      return ""
    },
    //是否有拖拽节点
    hasDragNode(){
      return this.rootData.dragOverStatus.dragNode && this.rootData.dragOverStatus.dragNode.nodeData;
    },
    //拖拽开始
    onDragStart(e) {
      e.stopPropagation();
      if(this.nodeData.prop.noDrag){
        return;
      }
      e.dataTransfer.effectAllowed = "move";
      this.nodeData.prop.isExpand = false;
      this.rootData.dragOverStatus.dragNode = {
        nodeData:this.nodeData,
        parentNode:this.parentNodeData
      };
      this.dragNodeHighlight= true;
      try {
         e.dataTransfer.setData('text/plain', '');
      } catch (error) {
      }
      this.rootData.rootInstance.$emit('dragStart', { treeNode: this.nodeData,parentNode:this.parentNodeData, event: e });
    },
    //进入目标节点
    onDragEnter:debounce(function (e) {
      e.preventDefault();
      e.stopPropagation();
      var that=this;
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.hasDragNode()){
        return;
      }
      this.rootData.dragOverStatus.overNodeKey="";
      //拖拽节点与目标节点是同一个，return掉
      if (this.nodeData._hash === this.rootData.dragOverStatus.dragNode.nodeData._hash) {
        return;
      }
      this.rootData.dragOverStatus.overNodeKey = this.nodeData._hash;//当前经过的可放置的节点的key
      //当前节点禁止做为放置节点时
      if (this.nodeData.prop.noDrop) {
        return;
      }
      //设置dragEnter定时器，停留300毫秒后触发事件
      if (!this.rootData.delayedDragEnterLogic) {
        this.rootData.delayedDragEnterLogic = {};
      }
      Object.keys(this.rootData.delayedDragEnterLogic).forEach(function (key) {
        clearTimeout(that.rootData.delayedDragEnterLogic[key]);
      });
      this.rootData.delayedDragEnterLogic[this.nodeData._hash] = setTimeout(function () {
        if (!that.nodeData.prop.isExpand) {
          that.toggleCollapseStatus();
        }
        that.rootData.rootInstance.$emit('dragEnter', { treeNode: that.nodeData, parentNode: that.parentNodeData, event: e });
      }, 250);
    },150),

    onDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.hasDragNode()){
        return;
      }
      if(this.rootData.dragOverStatus.overNodeKey===this.nodeData._hash && mouseOffsetY!==e.pageY){
        this.rootData.dragOverStatus.dropPosition = this.calDropPosition(e);//放置标识0，-1,1
        this.dragOverClass=this.setDragOverClass();
        mouseOffsetY=e.pageY;
      }
      //当前节点禁止拖拽时
      if(!this.nodeData.prop.noDrop){
         this.rootData.rootInstance.$emit('dragOver', { treeNode: this.nodeData,parentNode:this.parentNodeData, event: e });
      }
      return false;
    },

    onDragLeave(e) {
      e.stopPropagation();
      this.dragOverClass="";
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.hasDragNode()){
        return;
      }
      //当前节点禁止拖拽时
      if(this.nodeData.prop.noDrop){
        return;
      }
      this.rootData.rootInstance.$emit('dragLeave', { treeNode: this.nodeData,parentNode:this.parentNodeData, event: e });
    },

    onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.dragOverClass="";
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.hasDragNode()){
        return;
      }
      this.rootData.dragOverStatus.overNodeKey = "";
      //当前节点禁止拖拽时
      if(this.nodeData.prop.noDrop){
        return;
      }
      //拖拽节点与目标节点是同一个，不做任何操作
      if (this.rootData.dragOverStatus.dragNode.nodeData._hash === this.nodeData._hash) {
        return;
      }
      //当异步加载子节点时不允许放置
      if(this.showLoading){
        return;
      }
      var res = {
        event: e,
        dragNode: this.rootData.dragOverStatus.dragNode,
        dropNode: {
          nodeData:this.nodeData,
          parentNode:this.parentNodeData
        },
        dropPosition: this.rootData.dragOverStatus.dropPosition
      };
      this.rootData.rootInstance.$emit('drop', res);
    },

    onDragEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      //当没有设置拖拽节点时，禁止作为目标节点
      if(!this.hasDragNode()){
        return;
      }
      //当前节点禁止拖拽时
      if(this.nodeData.prop.noDrop){
        return true;
      }
      this.rootData.dragOverStatus.dragNode=null;
      this.rootData.dragOverStatus.overNodeKey = "";
      this.dragNodeHighlight= false;
      this.rootData.rootInstance.$emit('dragEnd', { treeNode: this.nodeData, parentNode:this.parentNodeData,event: e });
    },



    //拖拽处理结束-huijuan

      /****************工具方法 ****************/

      generateHash(num = 6) {
        var collectStr = "abcdefghijklmnopqrstuvwxyz0123456789",
          i = 0,
          str = "";
        while (i < num) {
          str += collectStr[Math.round(Math.random() * 35)];
          i++;
        }
        return str;
      },

      defered(){
        var resolve,reject;
        return {
          promise:new Promise(function(res,rej){resolve = res;reject = rej;}),
          resolve:resolve,
          reject:reject
          }
      },

      key2FuncMap(key,dataList){
 
        switch(key){
          case "add":
            return this.addNode();
          case "edit":
            return this.editThisNode();
          case "delete":
            return this.deleteThisNode();
          case "common":
            return dataList.callback? dataList.callback(this.nodeData): function(){console.log("未传入回调")}
        }
        
      },

      //检查当前值类型
      checkThisType(data, type) {
        //基本类型
        if (type === "boolean") {
          return typeof data == "boolean";
        }
        if (type === "string") {
          return typeof data == "string";
        }
        //引用类型:对象
        if (type === "object") {
          return (Object.prototype.toString.call(data).toLowerCase() == "[object object]");
        }
      },
      //获取元素到文档顶部和左边的距离
      getOffset(ele) {
        if (!ele.getClientRects().length) {
          return { top: 0, left: 0 };
        }
        var rect = ele.getBoundingClientRect();
        if (rect.width || rect.height) {
          var doc = ele.ownerDocument;
          var win = doc.defaultView;
          var docElem = doc.documentElement;
          return {
            //元素距离视窗顶部距离，滚动高度，元素边框厚度
            top: rect.top + win.pageYOffset - docElem.clientTop,
            left: rect.left + win.pageXOffset - docElem.clientLeft
          };
        }
        return rect;
      }
    },
    };
</script>

