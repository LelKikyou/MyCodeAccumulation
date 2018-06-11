1，file对象
   <input type="file" multiple name="file" id="upload" class="inputfile"/>
    let upload = document.querySelector("#upload");
    upload.onchange = function () {
         let file = this.files[0];获取到file对象。
         }
     file对象基于blob接口有类型等熟悉。
     提供了如下的元信息，通过FileList中的单个文件调用
     name：文件名，该属性只读。
     size：文件大小，单位为字节，该属性只读。
     type：文件的MIME类型，如果分辨不出类型，则为空字符串，该属性只读。
     lastModified：文件的上次修改时间，格式为时间戳。
     lastModifiedDate：文件的上次修改时间，格式为Date对象实例。

     ajax上传文件
            let formData=new FormData();
            formData.append("xx",file)
            let xhr = new XMLHttpRequest();
             // 监听变化
             xhr.onload = function () {
                 console.log(xhr.response)
             };
             xhr.open("POST", "http://localhost:40209/api/test/Post?guid=xx2222ax");
             //直接发送二进制数据
             xhr.send(formData);

 2，FileList
    <input type="file" multiple name="file" id="upload" class="inputfile"/>
    多个文件一起上传生成的  let file = this.files。就是fileList
 3，blob
    1.全称Binary Large Object，即二进制大数据对象，提供相应的接口；其他操作二进制的对象都是建立在Blob基础之上，并继承了其属性和方法。
    2.Blob只有两个属性，分别为size和type;
    size：二进制数据的大小，单位为字节。
    type：二进制数据的MIME类型，全部为小写，如果类型未知，则该值为空字符串。
    3.相关方法 】
    （1）Blob构造函数，接受两个参数。第一个参数是一个包含实际数据的数组，第二个参数是数据的类型，这两个参数都不是必需的。
    （2）Blob对象的slice方法，将二进制数据按照字节分块，返回一个新的Blob对象。
    let b=new Blob();
     var b = new Blob([this.result]) ,存储方法
    4,ajax下载文件一般用Blob类型，通过.FileReader转换为可读的图片，等。
      function download() {
        var url = 'download/?filename=aaa.txt';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);    // 也可以使用POST方式，根据接口
        xhr.responseType = "blob";  // 返回类型blob
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
          // 请求完成
          if (this.status === 200) {
            // 返回200
            var blob = this.response;
            var reader = new FileReader();
            reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
            reader.onload = function () {
                console.log(this.result)再转换为文件。
            }
          }
        };
        // 发送ajax请求
        xhr.send()
      }

 4,FileReader
   FileReader API用于读取文件，即把文件内容读入内存。它的参数是File对象或Blob对象。
   (1)readAsBinaryString(Blob|File)：返回二进制字符串，该字符串每个字节包含一个0到255之间的整数。
   (2)readAsText(Blob|File, opt_encoding)：返回文本字符串。默认情况下，文本编码格式是’UTF-8’，可以通过可选的格式参数，指定其他编码格式的文本。
   (3)readAsDataURL(Blob|File)：返回一个基于Base64编码的data-uri对象。
   (4)readAsArrayBuffer(Blob|File)：返回一个ArrayBuffer对象。
                  var a = new FileReader();
                     a.readAsBinaryString(file/blob);
                     a.onload = function () {
                       var b = new Blob([this.result])       this.result就是转换后的值
                     };

