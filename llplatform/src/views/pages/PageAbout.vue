<template>
  <el-card class="m-page-box" id="aboutProject">
    <div style="text-align: center">
      <img src="@/assets/img/about/my-logo.png" width="100px" height="100px"/>
    </div>
    <div>
      <h4>{{$t('about.author')}}</h4>
      <p>{{$t('about.authorName')}}</p>
    </div>
    <div>
      <h4>{{$t('about.mail')}}</h4>
      <p>linjinze999@163.com</p>
    </div>
    <div>
      <h4>{{$t('about.code')}}</h4>
      <p>
        <a style="color: #409eff" href="https://github.com/linjinze999/vue-llplatform" target="_blank">
          https://github.com/linjinze999/vue-llplatform
        </a>
      </p>
    </div>
    <div>
      <h4>{{$t('about.study')}}</h4>
      <p>
        <a style="color: #409eff" href="https://linjinze999.github.io/vue-llplatform/" target="_blank">
          https://linjinze999.github.io/vue-llplatform/
        </a>
      </p>
    </div>
    <div>
      <h4>{{$t('about.preview')}}</h4>
      <p>
        <a style="color: #409eff" href="https://linjinze999.github.io/vue-llplatform/preview/#/login"
           target="_blank">
          https://linjinze999.github.io/vue-llplatform/preview/#/login
        </a>
      </p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'PageAbout',
  mounted () {
    let clickShow = () => {
      let clickCnt = 0
      let specialCnt = 0
      let defaultText = '❤'
      let specialText = ['(๑•́ ∀ •̀๑)', 'OωO', '(๑•́ ₃ •̀๑)', '(๑•̀_•́๑)', '（￣へ￣）', 'o(￣▽￣)d',
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
        if (++clickCnt % 5 === 0) {
          $elem.innerText = specialText[specialCnt++]
          specialCnt = specialCnt % specialText.length
        } else {
          $elem.innerText = defaultText
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
  min-height: 0 !important;

  h4 {
    border-bottom: 1px solid #e6e6e6;
    padding: 6px;
  }

  p {
    padding: 6px;
  }
}
</style>
