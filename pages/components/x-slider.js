// pages/components/x-sliedr.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {//引用这个组件的时候，这个必须为true
      type: Boolean,
      value: false,
      observer: function (val) {
        if (val) {
          this._initSize()
          this._getSystemInfo()
        }
      },
    },
    sliderValue:{//拖动的值
      type:Number,
      value:0,
    },
    minValue:{//最小值
      type:Number,
      value:0,
    },
    maxValue:{//最大值
      type:Number,
      value:0,
    },
    step:{//步长
      type:Number,
      value:1,
    },
    showValue:{//是否显示拖动的值
      type:Boolean,
      value:false,
    },
    unit:{//值的单位
      type:String,
      value:'',
    },
    lineColor:{//拖动条的颜色
      type:String,
      value:'#64CC7E',
    },
    showText:{//是否显示左边的文本
      type:Boolean,
      value:false,
    },
    text:{//左边的文本
      type:String,
      value:'',
    },
    blockSize:{//滑块的大小
      type:Number,
      value:18,
    },
    activeColor:{//滑块的大小
      type:String,
      value:'#64CC7E',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    rpxRatio:1,
    initFlag: false,
    left: 0,// 组件的位置
    width: 0,
    barX:0,
    p:0,
  },

  // lifetimes: {
  //   attached () {
  //     wx.getSystemInfo({
  //       success: (res) => {
  //         this.setData({
  //           rpxRatio: res.screenWidth / 750
  //         })
  //       }
  //     })
  //   },
  // },
  /**
   * 组件的方法列表
   */
  methods: {
    _getSystemInfo(){
      console.log('dddd');
      
      wx.getSystemInfo({
        success: (res) => {
          this.setData({
            rpxRatio: res.screenWidth / 750
          })
        }
      })
    },
    // 获取初始值
    _getSlierPosition(val){
      var width=this.data.width/ this.data.rpxRatio
      var total = this.data.maxValue-this.data.minValue
      this.setData({
        barX:(((val-this.data.minValue)*width)/total)>=0?((val-this.data.minValue)*width)/total:0,
        sliderValue:val>=this.data.minValue?val:this.data.minValue
      })
      this.triggerEvent('myevent', { sliderValue: val });
    },
    // 初始化布局
    _initSize () {
      if (this.data.show) {
        if(!this.initFlag){
          this.setData({
            initFlag:true
          },()=>{
            const _this = this
            const query = this.createSelectorQuery()
            query.select('#line').boundingClientRect()
            query.exec(res => {
              _this.setData({
                // top: res[0].top,
                left: res[0].left,
                // right: res[0].right,
                width: res[0].width,
              })  
              this._getSlierPosition(this.data.sliderValue)     
            })
          })
        } 
      }
    },
    // 拖动事件
    _changeBar:function(e){
      var width=this.data.width/ this.data.rpxRatio
      let x = (e.changedTouches[0].pageX - this.data.left) / this.data.rpxRatio
      var length= this.data.maxValue-this.data.minValue
      x = x > width ? width : x
      x = x < 0? 0 : x
      // 拖动了多少长度
      var beforeValue=parseInt(parseInt((x/width)*length)/this.data.step)*this.data.step
      // var p=parseInt(parseInt(length*(x/width)*0.01)*100+this.data.minValue)
      // 拖动的长度加上起始的值 当前的长度
      var p=beforeValue+this.data.minValue
      this.setData({
        barX:x,
        sliderValue:p
      })
      this.triggerEvent('myevent', { sliderValue: p });
    },
  }
})
