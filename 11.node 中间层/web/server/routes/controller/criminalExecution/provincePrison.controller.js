let {getCriminalPrison, getCriminalPrisonDetails, getShowPrisonListByProvinceCode, getCriminalInfo, getShowcriminalssummaryinfoByZfbh} = require(pathRoot + "/modelApi/criminalExecutionApi");

//监狱首页
function handleFiveyearschange(data) {
    let [years, inTheCriminal, registeredCriminals, releaseTheCriminals] = [[], [], [], []];
    if (data) {
        data.map(i => {
            years.push(i.years)
            inTheCriminal.push(i.inTheCriminal)
            registeredCriminals.push(i.registeredCriminals)
            releaseTheCriminals.push(i.releaseTheCriminals)
        })
    }
    return {
        years, inTheCriminal, registeredCriminals, releaseTheCriminals
    }
}

function handlePrisonanalyse(data) {
    let xName = [], xData = []
    if (data) {
        data.map(i => {
            xName.push(i.name)
            xData.push(i.value)
        });
    }
    return {
        xName,
        xData
    }
}

function handlePrisonmapanddensity(data) {
    let dtsj = [], xName = [], zyData = [], nxData = [], wcnData = [];
    if (data) {
        data.map((item) => {
            item.value = (item.lnglat && item.lnglat.split(","));
            dtsj.push(item);
            xName.push(item.name);
            zyData.push(item.registeredCC)
            nxData.push(item.femaleCC)
            wcnData.push(item.juvenileDC)
        })
    }
    return {
        dtsj,
        gjyryfb: {
            xName, zyData, nxData, wcnData
        }
    }
}

exports.criminalPrison = (req, res) => {
    getCriminalPrison(req.query).then(data => {
        if (data.code === 200) {
            try {
                data = (data.data)[0];
                //监狱基本情况
                let prisoninfo = JSON.parse(data.prisoninfo) || [];
                //近5年罪犯数量变化
                let fiveyearschange = handleFiveyearschange(JSON.parse(data.fiveyearschange));
                //地图信息
                let prisonmapanddensity = handlePrisonmapanddensity(JSON.parse(data.prisonmapanddensity));
                let mapData = prisonmapanddensity.dtsj;
                let prisonPersonnelFB = prisonmapanddensity.gjyryfb;
                //罪犯分析
                let criminalAnalysis = {
                    xqcompose: JSON.parse(data.xqcompose) || [],
                    agecompose: JSON.parse(data.agecompose) || [],
                    sexcompose: JSON.parse(data.sexcompose) || [],
                    whcdcompose: JSON.parse(data.whcdcompose) || []
                };
                //监狱分析
                let prisonanalyse = handlePrisonanalyse(JSON.parse(data.prisonanalyse));
                res.json({
                    code: 200,
                    msg: "success",
                    data: {
                        prisoninfo,
                        fiveyearschange,
                        mapData,
                        prisonPersonnelFB,
                        criminalAnalysis,
                        prisonanalyse
                    }
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

//监狱详情
function handleDwinfo(data) {
    if (!data) {
        return ""
    }
    return data.find(res => {
        return res.name === "单位名称"
    });
}

function handleChargedensty(data) {
    let yName = [], value = [];
    if (data) {
        data.reverse().map(i => {
            yName.push(i.name)
            value.push(i.value)
        });
    }
    return {
        yName,
        value
    }
}

function handleClassify(data) {
    let value = [], yName = []
    if (data) {
        data.map(i => {
            value.push(i.value || 0)
            yName.push(i.name)
        })
    }
    return {
        value, yName
    }
}

exports.criminalPrisonDetails = async (req, res) => {
    try {
        let showPrisonList = await getShowPrisonListByProvinceCode({provincecode: 3700});
        let criminalPrisonDetails = await getCriminalPrisonDetails(req.query);
        if (showPrisonList.code === 200 && criminalPrisonDetails.code === 200) {
            let criminalPrisonDetailsData = (criminalPrisonDetails.data)[0];
            let showPrisonListData = (showPrisonList.data)[0];
            //监狱列表
            let prisonList = JSON.parse(showPrisonListData) || [];
            //监狱信息
            let dwinfo = handleDwinfo(JSON.parse(criminalPrisonDetailsData.dwinfo));
            let prisoninfo = JSON.parse(criminalPrisonDetailsData.prisoninfo) || [];
            //罪名分布
            let chargedensty = handleChargedensty(JSON.parse(criminalPrisonDetailsData.chargedensty));
            //占比分析
            let ratio_fenguan = JSON.parse(criminalPrisonDetailsData.ratio_fenguan) || [];
            let ratio_fenya = JSON.parse(criminalPrisonDetailsData.ratio_fenya) || [];
            let ratio_lijian = JSON.parse(criminalPrisonDetailsData.ratio_fenguan) || [];
            let ratio_huijian = JSON.parse(criminalPrisonDetailsData.ratio_fenguan) || [];
            //分类统计
            let classify_duiwai = handleClassify(JSON.parse(criminalPrisonDetailsData.classify_duiwai));
            let classify_jiguan = handleClassify(JSON.parse(criminalPrisonDetailsData.classify_jiguan));
            res.json({
                code: 200,
                msg: "success",
                data: {
                    // criminalPrisonDetailsData,
                    prisonList,
                    dwinfo,
                    prisoninfo,
                    chargedensty,
                    ratio: {
                        ratio_fenguan,
                        ratio_fenya,
                        ratio_lijian,
                        ratio_huijian
                    },
                    classify: {
                        classify_duiwai,
                        classify_jiguan
                    }
                }
            })
        } else {
            res.json({
                code: 201,
                msg: "合并接口出错！"
            })
        }
    } catch (e) {
        console.log(e);
        res.json({
            code: 500,
            msg: "服务器错误！"
        })
    }
}

//罪犯信息
function handleKhfchangetrend(data) {
    let xName = [], jyfnumbers = [], ldfnumbersm = [], zhfnumbersm = []
    if (data) {
        data.map(res => {
            xName.push(res.date)
            jyfnumbers.push(res.jyfnumbers)
            ldfnumbersm.push(res.ldfnumbersm)
            zhfnumbersm.push(res.zhfnumbersm)
        })
    }
    return {
        xName,
        jyfnumbers,
        ldfnumbersm,
        zhfnumbersm
    }
}

exports.criminalInfo = async (req, res) => {
    try {
        let criminalInfo = await getCriminalInfo(req.query);
        let showcriminalssummaryinfoByZfbh = await getShowcriminalssummaryinfoByZfbh(req.query);
        if (criminalInfo.code === 200 && showcriminalssummaryinfoByZfbh.code === 200) {
            let showcriminalssummaryinfoByZfbhData = (showcriminalssummaryinfoByZfbh.data)[0];
            let criminalInfoData = (criminalInfo.data)[0];
            //考核分变化趋势
            let khfchangetrend = handleKhfchangetrend(JSON.parse(criminalInfoData.khfchangetrend));
            //罪犯标签
            let zflable = JSON.parse(criminalInfoData.zflable) || [];
            res.json({
                code: 200,
                msg: "success",
                data: {
                    criminalInfo,
                    khfchangetrend,
                    zflable,
                    showcriminalssummaryinfoByZfbhData
                }
            })
        } else {
            res.json({
                code: 201,
                msg: "合并接口出错！"
            })
        }
    } catch (e) {
        console.log(e);
        res.json({
            code: 500,
            msg: "服务器错误！"
        })
    }
}
