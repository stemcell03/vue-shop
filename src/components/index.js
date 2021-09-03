import TopTabs from '@/components/layout/TopTabs.vue'
import CustomTable from '@/components/custom-table/index.vue'
import MyInput from '@/components/MyInput/index.vue'
import MySelect from '@/components/MySelect/index.vue'
import MyDate from '@/components/MyDate/index.vue'


export default (Vue) => {
  Vue.component('top-tabs',TopTabs)
  Vue.component('custom-table',CustomTable)
  Vue.component('my-input',MyInput)
  Vue.component('my-select',MySelect)
  Vue.component('my-date',MyDate)
}