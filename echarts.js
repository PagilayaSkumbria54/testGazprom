const data = [
    { period: "Март", name: "В программе ЦП", value: 120 },
    { period: "Апрель", name: "В программе ЦП", value: 120 },
    { period: "Май", name: "В программе ЦП", value: 120 },
    { period: "Июнь", name: "В программе ЦП", value: 120 },
    { period: "Июль", name: "В программе ЦП", value: 120 },
    { period: "Август", name: "В программе ЦП", value: 120 },
    { period: "Сентябрь", name: "В программе ЦП", value: 120 },
    { period: "Март", name: "В программе ИТ", value: 220 },
    { period: "Апрель", name: "В программе ИТ", value: 182 },
    { period: "Май", name: "В программе ИТ", value: 191 },
    { period: "Июнь", name: "В программе ИТ", value: 234 },
    { period: "Июль", name: "В программе ИТ", value: 290 },
    { period: "Август", name: "В программе ИТ", value: 330 },
    { period: "Сентябрь", name: "В программе ИТ", value: 310 },
    { period: "Март", name: "Вне программ ЦП", value: 620 },
    { period: "Апрель", name: "Вне программ ЦП", value: 732 },
    { period: "Май", name: "Вне программ ЦП", value: 701 },
    { period: "Июнь", name: "Вне программ ЦП", value: 734 },
    { period: "Июль", name: "Вне программ ЦП", value: 1090 },
    { period: "Август", name: "Вне программ ЦП", value: 1130 },
    { period: "Сентябрь", name: "Вне программ ЦП", value: 1120 },
    { period: "Март", name: "Вне программ ИТ", value: 120 },
    { period: "Апрель", name: "Вне программ ИТ", value: 132 },
    { period: "Май", name: "Вне программ ИТ", value: 101 },
    { period: "Июнь", name: "Вне программ ИТ", value: 134 },
    { period: "Июль", name: "Вне программ ИТ", value: 290 },
    { period: "Август", name: "Вне программ ИТ", value: 230 },
    { period: "Сентябрь", name: "Вне программ ИТ", value: 220 }
];

function takePeriods(mas){
    const periods = []
    for(let i = 0; i < 7; i++){
        periods.push(mas[i].period)
    }
    return periods
}

function getValues(index1, index2, mas){
    const values = []
    for (let i = index1; i < index2; i++){
        values.push(mas[i].value)
    }
    return values
}


const mySeries = [
    {
        name: 'В программе ИТ',
        type: 'bar',
        stack: 'one',
        color: '#56B9F2',
        data: getValues(7,14,data)
    },
    {
        name: 'В программе ЦП',
        type: 'bar',
        stack: 'one',
        color: '#0078D2',
        data: getValues(0,7,data)
    },
    {
        name: 'Вне программ ИТ',
        type: 'bar',
        stack: 'two',
        color: '#22C38E',
        data:  getValues(21,28,data)

    },
    {
        name: 'Вне программ ЦП',
        type: 'bar',
        stack: 'two',
        color: '#00724C',
        data:getValues(14,21,data)

    },
]

const seriesHandler = series => {
    return series.map((serie, index) => {
        if(serie.stack === 'one'){
            return {
                ...serie,
                label:{
                    show: (series.length > 1 && series[1].name === 'В программе ЦП') ? index === 1 : index === 0,
                    position: 'top',
                    fontWeight: '600',
                    fontSize: 14,
                    color: '#000',
                    formatter: params => {
                        let inProgramTotal = 0;
                        series.forEach(s => {
                            if (s.stack === 'one') {
                                inProgramTotal += s.data[params.dataIndex]
                            }
                        })
                        return inProgramTotal
                    }
                }
            }
        }

        if(serie.stack === 'two'){
            return {
                ...serie,
                label:{
                    show: index === series.length - 1,
                    position: 'top',
                    fontWeight: '600',
                    fontSize: 14,
                    color: '#000',
                    formatter: params => {
                        let outProgramTotal = 0;
                        series.forEach(s => {
                            (s.stack === 'two') ? outProgramTotal += s.data[params.dataIndex] : ''
                        })
                        return outProgramTotal
                    }
                }
            }
        }
    })
}


const handleLegendSelectChanged = (event, series) => {

    const includedSeriesNames = []
    for (const [name, value] of Object.entries(event.selected)) {
        if (value) {
            includedSeriesNames.push(name)
        }
    }

    const includedSeries = series.filter(serie => {
        return includedSeriesNames.includes(serie.name)
    })

    return seriesHandler(includedSeries)
}

const dom = document.getElementById("container");
const myChart = echarts.init(dom);

const option = {
    title: {
        text: 'Проекты в программах и вне программ',
        subtext: 'Сумма и процентное соотношение проектов, находящихся в программах и вне программ',
        textStyle: {
            fontSize: 16,
            height: 40
        },
        subtextStyle: {
            fontSize: 14,
        },
        left: 40,
    },
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            const masIn = []
            const masOut = []
            let countInProgram = 0
            let countOutProgram = 0
            for (let i = 0; i < params.length; i++){
                if (params[i].seriesName === "В программе ЦП" || params[i].seriesName === "В программе ИТ"){
                    masIn.push(params[i]);
                    countInProgram += params[i].data
                }
                else {
                    masOut.push(params[i]);
                    countOutProgram += params[i].data
                }
            }
            if(masIn.length === 0 && masOut.length === 0){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>

                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>0 % | 0 шт.</span>
                        </div>

                       <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>0 % | 0 шт.</span>
                        </div>
`
            }
            if(masIn.length === 1 && masOut.length === 0){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>

                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>${Math.round((countInProgram) / (countInProgram + countOutProgram) * 100)}%
                            | ${countInProgram} шт.</span>
                        </div>

                        <div class="title"><span>${masIn[0].marker} ${masIn[0].seriesName}</span><span><strong>${masIn[0].value} шт.</strong></span></div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>0 % | 0 шт.</span>
                        </div>
`
            }
            if(masIn.length === 2 && masOut.length === 0){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>

                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>${Math.round((countInProgram) / (countInProgram + countOutProgram) * 100)}%
                            | ${countInProgram} шт.</span>
                        </div>

                        <div class="title"><span>${masIn[0].marker} ${masIn[0].seriesName}</span><span><strong>${masIn[0].value} шт.</strong></span></div>
                        <div class="title"><span>${masIn[1].marker} ${masIn[1].seriesName}</span><span><strong>${masIn[1].value} шт.</strong></span></div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>0 % | 0 шт.</span>
                        </div>
                        `
            }
            if(masIn.length === 0 && masOut.length === 1){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>
                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>0 % | 0 шт.</span>
                        </div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>${Math.round((countOutProgram) / (countInProgram + countOutProgram) * 100)}%
                             | ${countOutProgram} шт.</span>
                        </div>
                        <div class="title"><span>${masOut[0].marker} ${masOut[0].seriesName}</span><span><strong>${masOut[0].value} шт.</strong></span></div>
`
            }
            if(masIn.length === 1 && masOut.length === 1){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>

                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>${Math.round((countInProgram) / (countInProgram + countOutProgram) * 100)}%
                            | ${countInProgram} шт.</span>
                        </div>

                        <div class="title"><span>${masIn[0].marker} ${masIn[0].seriesName}</span><span><strong>${masIn[0].value} шт.</strong></span></div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>${Math.round((countOutProgram) / (countInProgram + countOutProgram) * 100)}%
                             | ${countOutProgram} шт.</span>
                        </div>
                        <div class="title"><span>${masOut[0].marker} ${masOut[0].seriesName}</span><span><strong>${masOut[0].value} шт.</strong></span></div>
                        `
            }
            if(masIn.length === 2 && masOut.length === 1){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>

                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>${Math.round((countInProgram) / (countInProgram + countOutProgram) * 100)}%
                            | ${countInProgram} шт.</span>
                        </div>

                        <div class="title"><span>${masIn[0].marker} ${masIn[0].seriesName}</span><span><strong>${masIn[0].value} шт.</strong></span></div>
                        <div class="title"><span>${masIn[1].marker} ${masIn[1].seriesName}</span><span><strong>${masIn[1].value} шт.</strong></span></div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>${Math.round((countOutProgram) / (countInProgram + countOutProgram) * 100)}%
                             | ${countOutProgram} шт.</span>
                        </div>
                        <div class="title"><span>${masOut[0].marker} ${masOut[0].seriesName}</span><span><strong>${masOut[0].value} шт.</strong></span></div>`
            }
            if(masIn.length === 0 && masOut.length === 2){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>
                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>0 % | 0 шт.</span>
                        </div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>${Math.round((countOutProgram) / (countInProgram + countOutProgram) * 100)}%
                             | ${countOutProgram} шт.</span>
                        </div>
                        <div class="title"><span>${masOut[0].marker} ${masOut[0].seriesName}</span><span><strong>${masOut[0].value} шт.</strong></span></div>
                        <div class="title"><span>${masOut[1].marker} ${masOut[1].seriesName}</span><span><strong>${masOut[1].value} шт.</strong></span></div>`
            }
            if(masIn.length === 1 && masOut.length === 2){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>
                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>${Math.round((countInProgram) / (countInProgram + countOutProgram) * 100)}%
                            | ${countInProgram} шт.</span>
                        </div>
                        <div class="title"><span>${masIn[0].marker} ${masIn[0].seriesName}</span><span><strong>${masIn[0].value} шт.</strong></span></div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>${Math.round((countOutProgram) / (countInProgram + countOutProgram) * 100)}%
                             | ${countOutProgram} шт.</span>
                        </div>
                        <div class="title"><span>${masOut[0].marker} ${masOut[0].seriesName}</span><span><strong>${masOut[0].value} шт.</strong></span></div>
                        <div class="title"><span>${masOut[1].marker} ${masOut[1].seriesName}</span><span><strong>${masOut[1].value} шт.</strong></span></div>
`
            }
            if(masIn.length === 2 && masOut.length === 2){
                return `<style>
                        .title {
                            margin-bottom: 9px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        </style>

                        <div style="font-weight: 700" class="title">${params[0].axisValue}</div>
                        <div style="font-weight: 700" class="title">
                            <span>В программе</span><span>${Math.round((countInProgram) / (countInProgram + countOutProgram) * 100)}%
                            | ${countInProgram} шт.</span>
                        </div>

                        <div class="title"><span>${masIn[0].marker} ${masIn[0].seriesName}</span><span><strong>${masIn[0].value} шт.</strong></span></div>
                        <div class="title"><span>${masIn[1].marker} ${masIn[1].seriesName}</span><span><strong>${masIn[1].value} шт.</strong></span></div>
                        <div style="font-weight: 700" class="title">
                            <span>Вне программ</span><span>${Math.round((countOutProgram) / (countInProgram + countOutProgram) * 100)}%
                             | ${countOutProgram} шт.</span>
                        </div>
                        <div class="title"><span>${masOut[0].marker} ${masOut[0].seriesName}</span><span><strong>${masOut[0].value} шт.</strong></span></div>
                        <div class="title"><span>${masOut[1].marker} ${masOut[1].seriesName}</span><span><strong>${masOut[1].value} шт.</strong></span></div>
`
            }
        },
        axisPointer: {
            type: 'line',
            axisLine: 'x'
        },
        padding: 10,
        backgroundColor: '#fff',
        textStyle: {
          color: '#000'
        },
        extraCssText: 'width: 250px; ' +
            'filter: drop-shadow(0px 16px 32px rgba(0, 32, 51, 0.07)) drop-shadow(0px 12px 16px rgba(0, 32, 51, 0.07)) drop-shadow(0px 8px 8px rgba(0, 32, 51, 0.07)) drop-shadow(0px 12px 16px rgba(0, 32, 51, 0.07)) drop-shadow(0px 16px 32px rgba(0, 32, 51, 0.07));\n' +
            'border-radius: 4px;'
    },

    yAxis: {
        type: 'value',
        axisLine: {
            show: true
        },
        axisTick: {
            inside: false,
            show: true
        },
    },
    xAxis: {
        type: 'category',
        data: takePeriods(data),
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
    },
    legend: {
        orient: 'horizontal',
        top: 'bottom',
        icon: 'circle',
        data: ['В программе ИТ', 'В программе ЦП', 'Вне программ ИТ', 'Вне программ ЦП'],
        itemGap: 20
    }
};

myChart.setOption({
    ...option,
    series: seriesHandler(mySeries)
})

myChart.on('legendselectchanged', event => {
    myChart.setOption({
        series: handleLegendSelectChanged(event, mySeries)
    })
})