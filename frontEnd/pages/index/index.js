Page({  
    data: {
        tmp_flie:'',
        file_name:''
      },
    // 生成随机文件名
     generateRandomFileName:function() {
        const randomString = Math.random().toString(36).substring(2, 10); // 生成随机字符串
        return `${randomString}.fit`; // 返回随机文件名，后缀为 .fit
    },
    
    test: function(){
        const randomFileName = this.generateRandomFileName()
        console.log("随机名",randomFileName)
    },
    onChooseMessageFile: async function() {
        try {
            // 选择文件
            const tempFilePath = await this.chooseMessageFile();
            // 上传文件
            await this.uploadFile(tempFilePath);
            // 上传成功后下载文件
            await this.downloadFile();
        } catch (err) {
            console.error('操作失败:', err);
            wx.showToast({
                title: '操作失败',
                icon: 'none'
            });
        }
    },
    
    chooseMessageFile: function() {
        return new Promise((resolve, reject) => {
            wx.chooseMessageFile({
                count: 1,
                type: 'file',
                extension: ['.gpx'],
                success: function(res) {
                    const tempFilePath = res.tempFiles[0].path;
                    resolve(tempFilePath); // 返回选择的文件路径
                },
                fail: function(err) {
                    console.log('选择文件失败:', err);
                    reject(err);
                }
            });
        });
    },
    
    uploadFile: function(tempFilePath) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: 'https://www.yafeiya.top/upload',
                filePath: tempFilePath,
                name: 'file',
                success: function(uploadRes) {
                    console.log('文件上传成功:', uploadRes);
                    wx.showToast({
                        title: '上传成功',
                        icon: 'success'
                    });
                    resolve(); // 上传成功
                },
                fail: function(err) {
                    console.log('文件上传失败:', err);
                    wx.showToast({
                        title: '文件上传失败',
                        icon: 'none'
                    });
                    reject(err); // 上传失败
                }
            });
        });
    },
    
    downloadFile: function() {
        return new Promise((resolve, reject) => {
            wx.downloadFile({
                url: 'https://www.yafeiya.top/download/output.fit',
                success: (res) => {
                    if (res.statusCode === 200) {
                        console.log("下载成功", res);
                        const fs = wx.getFileSystemManager();
                        const now = new Date();
                        const utcOffset = 8 * 60; // 东八区与UTC的时差（分钟）
                        const localTime = new Date(now.getTime() + (utcOffset * 60 * 1000));
                        const timeStamp = localTime.toISOString().replace(/[:.-]/g, '').slice(2, 13); // 格式化为 YYYYMMDDHHMM
                        const fileName = `output_${timeStamp}.fit`; // 文件名
    
                        fs.saveFile({
                            tempFilePath: res.tempFilePath,
                            filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
                            success: (result) => {
                                this.setData({ tmp_flie: result.savedFilePath, file_name: fileName });
                                console.log('文件保存路径:', result.savedFilePath);
                                resolve(); // 下载并保存成功
                            },
                            fail: function(error) {
                                console.log('文件保存失败', error);
                                reject(error); // 保存失败
                            }
                        });
                    } else {
                        console.error('下载失败，状态码:', res.statusCode);
                        reject(new Error('下载失败')); // 下载失败
                    }
                },
                fail: function(err) {
                    console.error('文件下载失败', err);
                    reject(err); // 下载请求失败
                }
            });
        });
    },
    shareMFile: function() {
        if (!this.data.tmp_flie) {
            wx.showToast({
              title: '请先上传gpx文件',
              icon: 'none'
            });
            return;
          }
        wx.shareFileMessage({
            filePath: this.data.tmp_flie,
            fileName: this.data.file_name,
            success: function() {
                console.log('文件分享成功');
            },
            fail: function(err) {
                console.error('文件分享失败', err);
            }
    });
    },

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
  