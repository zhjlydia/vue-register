<style>
.vue-tree-root,
.vue-tree-root ol {
  list-style: none;
}

.vue-tree-root>ol>li>ol,
.vue-tree-root>ol {
  padding-left:0px!important;/* 一级根节点和二级节点不缩进*/
}
.vue-tree-root>ol>li>ol>li>ol>li .vue-tree-handle{
  padding-left: 0;
}

.vue-tree-root ol  {
  padding-left:43px;
}
.vue-tree-root>ol>li>ol>li>ol>li ol  {
  padding-left:23px;
}

.vue-tree-root{
  min-width: 560px;
  overflow: hidden;
  border: 1px solid #B9BEC5;
  border-radius: 4px;
  min-height: 320px;
  background:#fff;
}

.vue-tree-root .vue-tree-handle {
  position: relative;
  padding:0 24px 0 20px;
  font-size: 14px;
  font-family: "MicrosoftYaHeiUI";
  font-size: 14px;
  color: #30404F;
  line-height: 39px;
  height:40px;
  /* box-shadow: inset 0 -1px 0 0 #D4DFE5; */
}
.vue-tree-root .vue-tree-handle:after{
    content: "";
    position: absolute;
    left: -100%;
    bottom: 0;
    width: 10000%;
    box-shadow: inset 0 -1px 0 0 #D4DFE5;
    height: 1px;
}

</style>

<template>
  <div :class="wrapClass">    
      <h1 v-if="config.title" :class="mainTitle">{{config.title}}</h1>
      <ol>
        <!--<vue-tree-node v-for="(node,index) in dataList" 
          :key="index" 
          :node-data="node" 
          :root-data="rootData"
          ref="vueTreeNode"
        >
        </vue-tree-node>-->
      </ol>
      <slot name='noDataSlot'></slot>
  </div>

</template>

<script>
// import vueTreeNode from "./tree-node.vue";

export default {
  name: "vueTree",
    components: {
    // vueTreeNode
  },
  props: {
    dataList: {
      type:Array
    },
    config: {
      type:Object
    },
    loadData: {
      type: Function
    }
  },
  data() {
    return {
      rootData:{
        _UITreeMap:null,
        globalConfig:null,
        dragOverStatus:{
          overNodeKey: "",
          dropPosition: "",
          dragNode:{}
        },
        rootInstance:this
      }
    };
  },
  computed:{
    wrapClass(){
      typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;
      return this.rootData.globalConfig.styles.treeWrap
        ? this.rootData.globalConfig.styles.treeWrap
        : "vue-tree-root";
    },
    mainTitle(){
       typeof this.rootData.globalConfig.styles === "undefined" ? this.rootData.globalConfig.styles = {}:false;
      return this.rootData.globalConfig.styles.mainTitle
        ? this.rootData.globalConfig.styles.mainTitle
        : "vue-tree-mainTitle";
    }
  },
  created() {
    //在整个组件传递参数
    this.rootData.globalConfig = this.config;

    //销毁整个删除树型组件
    this.$on("destory",this.destory);

  },
  mounted() {
    this.$on('dragStart', (info) => {
      this.$emit('on-dragStart',info);
    });
    this.$on('dragEnter', (info) => {
      this.$emit('on-dragEnter',info);
    });
    this.$on('dragOver', (info) => {
      this.$emit('on-dragOver',info);
    });
    this.$on('dragLeave', (info) => {
      this.$emit('on-dragLeave',info);
    });
    this.$on('dragEnd', (info) => {
      this.$emit('on-dragEnd',info);
    });
    this.$on('drop', (dropInfo) => {
      this.$emit('on-drop',dropInfo);
    });
  },

  methods: {
    /**
     * 公共方法
     * **/

    // （公有）获取所有勾选数据
    getSelectedNodeData(){
      var arr = [];
      for (var p in this.rootData._UITreeMap) {
          if (this.rootData._UITreeMap[p].prop.isChecked) {
            arr.push(this.rootData._UITreeMap[p]);
          }
        }
      return arr;
    },

    //（公有）获取所有带索引的节点数据
    getAllNodeData(){
      return this.rootData._UITreeMap;
    },

    //清空所有勾选项
    clearAllCheckedData(){
      for (var p in this.rootData._UITreeMap) {
          this.rootData._UITreeMap[p].prop.isChecked === true && (this.rootData._UITreeMap[p].prop.isChecked = false); 
      }
    },

    //从父节点销毁数据
    destory(){
      this.dataList.splice(0,1);
      this.rootData._UITreeMap = null;
      this.dragOverStatus = {
        overNodeKey: "",
        dropPosition: "",
        dragNode:{}
      }
    }
  }
};
</script>