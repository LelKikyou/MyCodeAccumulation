let {mainScreen} = require(pathRoot + "/modelApi/mainScreenApi");
exports.mainScreen = (req, res) => {
    mainScreen().then(data => {
        if (data.code === 200) {
            try {
                res.json({
                    code: 200,
                    msg: "success",
                    data: data
                })
            } catch (e) {
                console.log(e);
                res.json({
                    code: 500,
                    msg: "服务器错误！"
                })
            }
        } else {
            console.log(res);
            res.json({
                code: data.code,
                msg: data.msg
            })
        }
    }).catch(err => {
        console.log(err);
        if (err) {
            res.json({
                code: err.status,
                msg: err.statusText
            })
        } else {
            res.json({
                code: 500,
                msg: "服务器错误！"
            })
        }
    })

}
