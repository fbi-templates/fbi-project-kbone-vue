<template>
  <div class="cnt">
    <header></header>
    <button @click="onClickBack">回到上一页</button>
    <footer></footer>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Header from '@/components/common/header.vue'
  import Footer from '@/components/common/footer.vue'

  export default Vue.extend({
    name: 'App',
    components: {
      Header,
      Footer
    },
    created() {
      window.addEventListener('wxload', query => console.log('page3 wxload', query))
      window.addEventListener('wxshow', () => console.log('page3 wxshow'))
      window.addEventListener('wxready', () => console.log('page3 wxready'))
      window.addEventListener('wxhide', () => console.log('page3 wxhide'))
      window.addEventListener('wxunload', () => console.log('page3 wxunload'))
    },
    methods: {
      onClickBack() {
        if (process.env.isMiniprogram) {
          wx.navigateBack()
        }
      }
    }
  })
</script>

<style>
  .cnt {
    margin-top: 20px;

    a,
    button {
      display: block;
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 20px;
      border: 1px solid #ddd;
    }
  }
</style>
