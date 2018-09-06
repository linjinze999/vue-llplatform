<template>
  <el-card class="m-page-box" id="aboutProject">
    <div style="text-align: center">
      <img src="@/assets/img/about/my-logo.png" width="100px" height="100px"/>
    </div>
    <div>
      <h4>作者</h4>
      <p>林锦泽</p>
    </div>
    <div>
      <h4>邮箱</h4>
      <p>linjinze999@163.com</p>
    </div>
    <div>
      <h4>源码地址</h4>
      <p>
        <a style="color: #409eff" href="https://github.com/linjinze999/vue-llplatform" target="_blank">
          https://github.com/linjinze999/vue-llplatform
        </a>
      </p>
    </div>
    <div>
      <h4>教程步骤</h4>
      <p>
        <a style="color: #409eff" href="https://linjinze999.github.io/vue-llplatform/" target="_blank">
          https://linjinze999.github.io/vue-llplatform/
        </a>
      </p>
    </div>
    <div>
      <h4>预览地址</h4>
      <p>
        <a style="color: #409eff" href="https://linjinze999.github.io/preview/vue-llplatform/#/login"
           target="_blank">
          https://linjinze999.github.io/preview/vue-llplatform/#/login
        </a>
      </p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'FuncAbout',
  mounted () {
    let clickShow = () => {
      let click_cnt = 0
      let special_cnt = 0
      let default_text = '❤'
      let special_text = ['(๑•́ ∀ •̀๑)', 'OωO', '(๑•́ ₃ •̀๑)', '(๑•̀_•́๑)', '（￣へ￣）', 'o(￣▽￣)d',
        '╮(｡>口<｡)╭', '(o゜▽゜)o☆', '(ꐦ°᷄д°᷅)']
      let $about = document.getElementsByClassName('page-sub-main')[0]
      let $body = document.getElementsByTagName('body')[0]
      $about.onclick = function (e) {
        let $elem = document.createElement('b')
        $elem.style.color = '#E94F06'
        $elem.style.zIndex = 9999
        $elem.style.position = 'absolute'
        $elem.style.select = 'none'
        let x = e.pageX
        let y = e.pageY
        $elem.style.left = (x - 8) + 'px'
        $elem.style.top = (y - 16) + 'px'
        let anim
        clearInterval(anim)
        if (++click_cnt % 5 === 0) {
          $elem.innerText = special_text[special_cnt++]
          special_cnt = special_cnt % special_text.length
        } else {
          $elem.innerText = default_text
        }
        $elem.style.fontSize = Math.random() * 5 + 11 + 'px'
        let increase = 0
        setTimeout(function () {
          anim = setInterval(function () {
            if (++increase === 150) {
              clearInterval(anim)
              $body.removeChild($elem)
            }
            $elem.style.top = y - 20 - increase + 'px'
            $elem.style.opacity = (150 - increase) / 120
          }, 8)
        }, 70)
        $body.appendChild($elem)
      }
    }
    clickShow()
  }
}
</script>

<style scoped lang="scss">
.m-page-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  h4 {
    border-bottom: 1px solid #e6e6e6;
    padding: 6px;
  }
  p {
    padding: 6px;
  }
}
</style>
