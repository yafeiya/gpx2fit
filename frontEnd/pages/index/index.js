Page({  
    data: {
        tempFilePath: '',
        upflog:''
      },
     generateRandomFileName:function() {
        const randomString = Math.random().toString(36).substring(2, 10); // 生成随机字符串
        return `${randomString}.fit`; // 返回随机文件名，后缀为 .fit
    },
    
    test: function(){
        const randomFileName = this.generateRandomFileName()
        console.log("随机名",randomFileName)
    },
    // gpx文件上传
    onChooseMessageFile: function() {  
        wx.chooseMessageFile({
                count: 1,  // 允许选择的文件数量
                type: 'file',  // 可以选择的文件类型，'image', 'video', 'file' 或 'all'
                extension: ['.gpx'],
                success: function(res) {
                const tempFilePath = res.tempFiles[0].path;
                  // 上传文件
                wx.uploadFile({
                    url: 'https://www.yafeiya.top/upload', 
                    filePath: tempFilePath,
                    name: 'file',  // 后端接收文件时使用的字段名
                    success: function(uploadRes) {
                      console.log('文件上传成功:', uploadRes);
                      wx.showToast({
                        title: '上传成功',
                        icon: 'success'
                      });
                    },
                    fail: function(err) {
                      console.log('文件上传失败:', err);
                      wx.showToast({
                        title: '文件上传失败',
                        icon: 'none'
                      });
                    }
                  });
                },
                fail: function(err) {
                  console.log('选择文件失败:', err);
                }
              });
    } ,

    shareFile: function(filePath) {
        const randomFileName = this.generateRandomFileName()
        wx.shareFileMessage({
            filePath: filePath,
            fileName: randomFileName,
            success: function() {
                console.log('文件分享成功');
            },
            fail: function(err) {
                console.error('文件分享失败', err);
            }
    });
    },
    // 分享fit文件
    downloadFile: function() {
        wx.downloadFile({
        url: 'https://www.yafeiya.top/download/output.fit', 
        success: (res) => { // 使用箭头函数保持上下文
            if (res.statusCode === 200) {
            console.log("下载成功", res);
            this.shareFile(res.tempFilePath); // 使用 this 调用 shareFile
            }
        },
        fail: function(err) {
            console.error('文件下载失败', err);
            }
        });
    },
    //上传相册
    uploadAlbum: function() {  
        // 实现上传逻辑，例如使用 wx.uploadFile  
        wx.chooseImage({  
          count: 1, // 默认9  count: 1, // 默认9，设置为1表示只允许用户选择一张图片
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
          success: function(res) {  
              //TODO:待实现
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
            console.log("相册上传待实现")
            var tempFilePaths = res.tempFilePaths  
            wx.uploadFile({  
              url: 'https://flask-211n-115716-6-1328083609.sh.run.tcloudbase.com/upload', 
              filePath: tempFilePaths[0],  
              name: 'file',  
              formData: {  
                'user': 'test'  
              },  
              success: function(res) {  
                console.log('upload success:', res.data);  
              },  
              fail: function(err) {  
                console.error('upload fail:', err);  
              }  
            })  
          }, 
          fail: function(err) {
            console.error('相册选择失败', err);
          }
        })  
    },  
    //  系统文件上传
    // TODO:未实现,wx.miniapp.chooseFile暂不能用在小程序
    onChooseFileTap: function(){  
        wx.miniapp.chooseFile({  
          count: 1, // 默认9，设置为1  
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
          success: function(res) {  
            // 返回选定文件的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
            const tempFilePaths = res.tempFilePaths;  
            if (tempFilePaths.length > 0) {  
              const filePath = tempFilePaths[0]; // 获取到的是文件的本地路径  
              wx.uploadFile({  
                url: '你的服务器接口URL', // 仅为示例，需要替换为你的上传接口  
                filePath: filePath,  
                name: 'file', // 后端接收文件的参数名  
                formData: {  
                  'user': 'test' // 其他需要一并上传的参数  
                },  
                success: function(res) {  
                  // 上传成功  
                  console.log('uploadFile:success', res.data);  
                  // 可以将res.data返回的数据进行展示  
                },  
                fail: function(err) {  
                  // 上传失败  
                  console.error('uploadFile:fail', err);  
                }  
              });  
            }  
          }  
        });  
      }   
  })
  