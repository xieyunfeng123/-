Page({



  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    hidden: false,
    viewHidden:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    requestData(that, mCurrentPage + 1);
  },

  onItemClick: function (event) {
    var targetUrl = Constant.PAGE_SPECIFIC;
    var bean = event.currentTarget.dataset.publishData; // e.currentTarget
    console.log(bean.title)
    if (event.currentTarget.dataset.publishTime != null)
      targetUrl = targetUrl + "?publishData=" + bean.title+"-"+bean.content;

    wx.navigateTo({
      url: targetUrl
    });
  },
  onPostClick: function (event) {
    console.log("onPostClick");
    wx.navigateTo({
      url: Constant.PAGE_POSt
    });
  }
});

var mTitles = [];
var mSrcs = [];
var mTimes = [];
var mCurrentPage = 0;
/**
 * 请求数据
 * @param that Page的对象，用其进行数据的更新
 * @param targetPage 请求的目标页码
 */
function requestData(that, targetPage) {
  wx.request({
    url: Constant.GET_URL.replace("(/\(\d+))$", targetPage),
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res == null ||
        res.data == null ||
        res.data.results == null ||
        res.data.results.length <= 0) {

        console.error(Constant.ERROR_DATA_IS_NULL);
        return;
      }

      var i = 0;
      for (; i < res.data.results.length; i++)
        bindData(res.data.results[i]);

      //将获得的各种数据写入itemList，用于setData
      var itemList = [];
      for (var i = 0; i < mTitles.length; i++)
        itemList.push({ title: mTitles[i], src: mSrcs[i], time: mTimes[i] });
        
      if(itemList==null||itemList.length==0)
      var viewHiddens=true;
      else
        var viewHiddens=false;
      that.setData({
        items: itemList,
        hidden: true,
        viewHidden: viewHiddens
      });

      mCurrentPage = targetPage;
    }
  });
}

/**
 * 绑定数据
 * @param itemData Gank的接口返回的content值，里面有各种相关的信息
 */
function bindData(itemData) {

  var re = new RegExp("[a-zA-z]+://[^\"]*");
  var ceshi = itemData.content.split("<img src=\"")[1];

  var ceshi2=ceshi.split("\"")[0];
  if (-1 != (ceshi2.search("//ww")))
  {
    var img = ceshi2.replace("//ww", "//ws").replace("%22","");
  }
  else
  {
    var img = ceshi2.replace("%22", "")
  }
  
  
  // //图片URL标志之前的是"img alt"
  // var title = itemData.content.split("img alt=")[1].match(re)[0];
  // //todo 挺奇怪的，小程序不能显示以 （ww+数字） 开头的图片，把它改成 ws 开头就可以了，不知道为什么
  // if (-1 != (title.search("//ww"))) {
  //   var src = title.replace("//ww", "//ws");
  // }
  // //早期的URL不一定是ww开头的，不需要转换直接调用
  // else {
  //   var src = title;
  // }
  var time = itemData.updated_at.replace("T", " ");
  mTitles.push(itemData.title);
  mTimes.push(time.split(".")[0]);
  mSrcs.push(ceshi2);
}

var Constant = require('../../utils/constant.js');