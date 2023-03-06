'use strict'
import { Message } from 'element-ui'
import { ajax } from 'jquery'
import { func } from 'prop-types'
import {baseUrl } from "./ajaxPath"
var OSS = require('ali-oss')

export default {
  // 创建随机字符串
  randomString (num) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    let res = ''
    for (let i = 0; i < num; i++) {
      var id = Math.ceil(Math.random() * 35)
      res += chars[id]
    }
    return res
  },
  dateFormat (dateObj, format) {
    const date = {
      'M+': dateObj.getMonth() + 1,
      'd+': dateObj.getDate(),
      'h+': dateObj.getHours(),
      'm+': dateObj.getMinutes(),
      's+': dateObj.getSeconds(),
      'q+': Math.floor((dateObj.getMonth() + 3) / 3),
      'S+': dateObj.getMilliseconds()
    }
    if (/(y+)/i.test(format)) {
      format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in date) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1
          ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
      }
    }
    return format
  },
  /**
     * 创建oss客户端对象
     * @returns {*}
     */
  createOssClient (params) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url:baseUrl+'/oss/v1/permissions',
        type: 'post',
        data:{},
        dataType:'json',
        success: res => {
          (res);
          var params = res.data
          const client = new OSS({
            region: params.region,
            accessKeyId: params.AccessKeyId,
            accessKeySecret: params.AccessKeySecret,
            stsToken: params.SecurityToken,
            bucket: params.bucket
          })
          resolve(client)
        }
      })
    })
  },
  /**
     * 文件上传
     * @param option
     */
  ossUploadFile (option, sceneName) {
    // sceneName 文件名称
    let file = option.file
    // let file = option.file
    if (option.type === 'change') {
      file = option.target.files[0]
    }
    const self = this
    return new Promise((resolve, reject) => {
      const dateTime = self.dateFormat(new Date(), 'yyyyMMddhhmmss') // 当前时间
      const randomStr = self.randomString(4) //  4位随机字符串
      const extensionName = file.name.substr(file.name.indexOf('.')) // 文件扩展名
      let fileName = ''
      // const userId = JSON.parse(localStorage.getItem('userInfo')).id
      const userId = 2
      fileName = 'pc-console/user-upload/' + userId + '/' + sceneName + '/' + dateTime + '_' + randomStr + extensionName
      // 执行上传
      self.createOssClient().then(client => {
        const options = client.options
        const filePath = 'https://' + options.bucket + '.' + options.region + '.aliyuncs.com/'

        // 分片上传文件
        client.multipartUpload(fileName, file, {
          progress: function (p) {
            const e = {}
            e.percent = Math.floor(p * 100)
            if (option.type !== 'change') {
              option.onProgress(e)
            }
          }
        }).then((val) => {
          if (val.res.statusCode === 200) {
            val.filePath = filePath
            if (option.type !== 'change') {
              option.onSuccess(val, file)
            } else {
              resolve(val)
            }
            return val
          } else {
            Message({
              message: '上传失败',
              type: 'error',
              showClose: true
            })
          }
        }, err => {
          Message({
            message: '上传失败',
            type: 'error',
            showClose: true
          })
          reject(err)
        })
      })
    })
  },
  delete (key) {
    const me = this
    return new Promise((resolve, reject) => {
      me.createOssClient().then(client => {
        client.delete(key).then((re) => {
          resolve(re)
        }, (err) => {
          reject(err)
        })
      })
    })
  }
}
