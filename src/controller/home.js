import tendency from '../components/tendency'
import dtime from 'time-formater'
import {
  userCount,
  orderCount,
  getUserCount,
  getOrderCount,
  adminDayCount,
  adminCount
} from '@/api/getData'
export default {
  data() {
    return {
      userCount: null,
      orderCount: null,
      adminCount: null,
      allUserCount: null,
      allOrderCount: null,
      allAdminCount: null,
      sevenDay: [],
      sevenDate: [[], [], []]
    }
  },
  components: {
    tendency
  },
  mounted() {
    this.initData()
    for (let i = 6; i > -1; i--) {
      const date = dtime(new Date().getTime() - 86400000 * i).format(
        'YYYY-MM-DD'
      )
      this.sevenDay.push(date)
    }
    this.getSevenData()
  },
  computed: {},
  methods: {
    async initData() {
      const today = dtime().format('YYYY-MM-DD')
      Promise.all([
        userCount(today),
        orderCount(today),
        adminDayCount(today),
        getUserCount(),
        getOrderCount(),
        adminCount()
      ])
        .then((res) => {
          this.userCount = res[0].count
          this.orderCount = res[1].count
          this.adminCount = res[2].count
          this.allUserCount = res[3].count
          this.allOrderCount = res[4].count
          this.allAdminCount = res[5].count
        })
        .catch((err) => {
          console.log(err)
        })
    },
    async getSevenData() {
      const apiArr = [[], [], []]
      this.sevenDay.forEach((item) => {
        apiArr[0].push(userCount(item))
        apiArr[1].push(orderCount(item))
        apiArr[2].push(adminDayCount(item))
      })
      const promiseArr = [...apiArr[0], ...apiArr[1], ...apiArr[2]]
      Promise.all(promiseArr)
        .then((res) => {
          const resArr = [[], [], []]
          res.forEach((item, index) => {
            if (item.status == 1) {
              resArr[Math.floor(index / 7)].push(item.count)
            }
          })
          this.sevenDate = resArr
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
