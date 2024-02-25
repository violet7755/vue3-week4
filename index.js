import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

//import 元件
import pagination from './pagination.js';
import productModal from './productModal.js';
import delModal from './delModal.js';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'violet7755',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
      modalProduct: null,
      modalDel: null,
      pages: {},
    }
  },
  methods: {
    //登入驗證
    checkAdmin() {
      const api = `${this.apiUrl}/api/user/check`;
      axios.post(api)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    //取得產品
    getData(page) {
      const api = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;

      axios.get(api)
        .then((res) => {
          this.products = res.data.products;
          this.pages = res.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    //更新產品
    updateProduct() {
      let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      let http = 'post';

      //判斷切換 api 模式
      if(!this.isNew) {
        api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        http = 'put'
      }

      axios[http](api, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          this.getData();
          this.$refs.pModal.closeModal();
          this.tempProduct = {};
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    //彈出視窗z
    openModal(status, item) {
      if(status === 'new'){
        this.tempProduct = {
          imagesUrl: [],
        };
        this.isNew = true;
        this.$refs.pModal.openModal();
      } else if (status === 'edit'){
        this.tempProduct = {...item};
        if(!Array.isArray(this.tempProduct.imagesUrl)){
          this.tempProduct.imagesUrl = [];
        }
        this.isNew = false;
        this.$refs.pModal.openModal();
      } else if (status === 'delete') {
        this.tempProduct = {...item};
        this.$refs.delModal.openModal();
      }
    },
    //刪除產品
    delProduct() {
      const api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(api)
        .then((res) => {
          alert(res.data.message);
          this.$refs.delModal.closeModal();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
  mounted() {
    //取出 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)violetToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
  },
  components: { //註冊區域元件
    pagination,
    productModal,
    delModal
  }
});
app.mount('#app')