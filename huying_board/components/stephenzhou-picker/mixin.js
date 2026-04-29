export default {
    data() {
        return {
            loading: false,
            state: 'loadmore',
            listReq: {
				current: 1,
				size: 20,
				total: 0
			}
        }
    },
    methods: {
        // 需要分页
        async getPage(self, obj) {
            const params = {
                ...this.listReq,
                ...obj,
            }
            this.loading = true;
            try {
              const res = await self.listApi(params);
              let { size, current } = this.listReq;
              let { data } = res;
              //如果响应值列表的长度小于我们所请求的页数 那就意味已经没有下一页了
              if (data.records && data.records.length < size) this.state = 'nomore';
              //如果current是第一页，直接赋值
              if (current === 1) self.data = data.records; 
              //不是第一页 将原数组和得到的数组进行合并
              else self.data = [...self.data, ...data.records];
              return res
            } catch(e) {
                console.log(e);
            } finally {
                this.loading = false;
                uni.stopPullDownRefresh()
            }
        },
        // 不需要分页
        async getList(self, obj) {
            const params = {
                ...obj,
            }
            this.loading = true;
            try {
              const res = await self.listApi(params);
              if(res && res.code === 200) {
                self.data = res.data;
              }
            } catch(e) {
                console.log(e);
            } finally {
                this.loading = false;
                uni.stopPullDownRefresh()
            }
        },
        // 加载更多
        loadmore(self, params) {
            if (this.state !== 'nomore' && self.pagination) {
                this.state = 'loading';
                this.listReq.current ++
                if (params){
                    this.getPage(self, params);	
                } else{
                    this.getPage(self);	
                }
            }
        },
        // 初始化
        init(self, str, obj) {
            if(str === 'data') {
                this.state = 'loadmore';
                this.listReq.current = 1
            } else {
                this.state = 'loadmore';
                this.listReq.current = 1
                if (obj){
                    this.getPage(self, obj)
                } else{
                    this.getPage(self)
                }
                
            }
        }
    }
}