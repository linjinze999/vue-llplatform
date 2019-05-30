<template>
  <div>
    <el-card>
      {{$t('else.learn')}}
      <a style="color: #409eff" href="https://www.npmjs.com/package/vuedraggable">Vue.Draggable</a><br/>
      {{$t('else.example')}}
      <a href="https://github.com/linjinze999/vue-llplatform/blob/vue-cli3/llplatform/src/views/pages/PageDrag.vue"
         style="color: #409eff" target="_blank">
        https://github.com/linjinze999/vue-llplatform/blob/vue-cli3/llplatform/src/views/pages/PageDrag.vue
      </a>
    </el-card>
    <br/>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <h3 style="text-align: center">{{$t('drag.boy')}}</h3>
          <draggable v-model="boy" @update="datadragEnd" :options="{animation:500,group:'people'}">
            <transition-group>
              <div v-for="e in boy" :key="e.text">
                <el-button type="primary" style="width: 90%;margin-top: 20px;">{{e.text}}</el-button>
              </div>
            </transition-group>
          </draggable>
        </el-col>
        <el-col :span="12">
          <h3 style="text-align: center">{{$t('drag.girl')}}</h3>
          <draggable v-model="girl" @update="datadragEnd" :options="{animation:500,group:'people'}">
            <transition-group>
              <div v-for="e in girl" :key="e.text">
                <el-button type="danger" style="width: 90%;margin-top: 20px;">{{e.text}}</el-button>
              </div>
            </transition-group>
          </draggable>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'PageDrag',
  data () {
    return {
      boy: [
        { text: '林1' },
        { text: '林2' },
        { text: '林3' },
        { text: '林4' },
        { text: '林5' },
        { text: '林6' },
        { text: '林7' },
        { text: '林8' },
        { text: '林9' }
      ],
      girl: [
        { text: '李1' },
        { text: '李2' },
        { text: '李3' },
        { text: '李4' },
        { text: '李5' }
      ],
      startArr: [],
      endArr: [],
      count: 0
    }
  },
  components: {
    draggable
  },
  methods: {
    getdata (evt) {
      console.log(evt.draggedContext.element.text)
    },
    datadragEnd (evt) {
      evt.preventDefault()
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      console.log(this.colors)
    }
  },
  mounted () {
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  border: 1px solid #ccc;
}

.ghostClass {
  opacity: 1;
}

.bottom {
  width: 200px;
  height: 50px;
  position: relative;
  background: blue;
  top: 2px;
  left: 2px;
  transition: all .5s linear;
}
</style>
