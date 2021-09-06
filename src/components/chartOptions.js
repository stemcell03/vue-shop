import echarts from "echarts";
const myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
export const yearData = [
  {
    year: '2020',  // 年份
    data: [  // 两个数组是因为有两条线
         [24, 40, 101, 134, 190, 230, 110, 130, 320, 130, 110, 320],
         [40, 64, 191, 324, 290, 230, 110, 313, 380, 100, 280, 79]
      ]
  },
  {
    year: '2021',  // 年份
    data: [  // 两个数组是因为有两条线
         [123, 175, 112, 197, 121, 167, 98, 121, 143, 64, 176, 38],
     [143, 131, 165, 123, 78, 21, 82, 264, 143, 60, 119, 234]
      ]
  }
];
export default {
  left: [
    {
      title: '柱状图-就业行业',
      option:     {
        color: ["#2f89cf"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "0%",
          top: "10px",
          right: "0%",
          bottom: "4%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12"
            },
          //  x轴样式不显示
            axisLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12"
            },
            axisLine:{
              lineStyle:{
                color: "rgba(255, 255, 255, 0.1)",
                width:2
              }
            },
            splitLine:{
              lineStyle:{
                color:"rgba(255 , 255, 255, 0.1)"
              }
            }
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "35%",
            data: [101, 252, 100, 134, 290, 130, 120],
            itemStyle:{
              barBorderRadius:5
            },
          }
        ]
      },
    },
    {
      title: '折线图-人员变化',
      titleLink:true,
      option: {
        color: ['#00f2f1', '#ed3f35'],
        tooltip: {
          trigger: 'axis',
          
        },
        legend: {
          textStyle: {
            color:"#4c9bfd"
          },
          right:'10%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          show:true,
          borderColor:'#012f4a'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            show:false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#4c9bfd'
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              show:false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#fff'
            },
            splitLine:{
              lineStyle:{
                color:"#012f4a"
              }
            }
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            data:  yearData[0].data[0],
            smooth:true
          },
          {
            name: '联盟广告',
            type: 'line',
            data: yearData[0].data[1],
            smooth:true
          },
        ]
      }
    },
    {
      title: '饼形图-访问来源',
      option:{
        tooltip: {
            trigger: 'item'
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          bottom: 'bottom',
          // 修改图例组件的文字为 12px
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "10"
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ["40%", "60%"],
            // 不显示标签文字
            label: { show: false },
            // 不显示连接线
            labelLine: { show: false },
            data: [
                {value: 548, name: '搜索引擎'},
                {value: 435, name: '直接访问'},
                {value: 780, name: '邮件营销'},
                {value: 284, name: '联盟广告'},
                {value: 900, name: '视频广告'}
            ],
            emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
  ],
  right: [
    {
      title: '柱状图-技能掌握',
      option:
      {
        grid: {
          top: "2%",
          left: "2%",
          bottom: "0%",
          right:"2%",
          containLabel: true
        },
        xAxis: {
          show:false,
        },
        yAxis: [
          {
            type: 'category',
            inverse: true,
            data: ["A", "B", "C", "D", "E"],
            axisLine: {
              show:false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              color: '#fff'
            }
          },
          {
            show: true,
            data:[700, 350, 610, 790, 660],
            inverse: true,
            // 不显示y轴的线
            axisLine: {
              show: false
            },
            // 不显示刻度
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                fontSize: 12,
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "条",
            type: 'bar',
            data: [70, 35, 61, 79, 66],
            // 柱子之间的距离
            barCategoryGap: 50,
            //柱子的宽度
            barWidth: 10,
            yAxisIndex:0,
            // 柱子设为圆角
            itemStyle: {
              normal: {
              barBorderRadius: 20,
              color: function(params) {
                  return myColor[params.dataIndex]
                }
              },
            },
            // 图形上的文本标签
            label: {
              normal: {
                show: true,
                // 图形内显示
                position: "inside",
                // 文字的显示格式
                formatter: "{c}%"
              }
            },
          },
          {
            name: '框',
            type: 'bar',
            data: [100, 100, 100, 100, 100],
            // 柱子之间的距离
            barCategoryGap: 50,
            //柱子的宽度
            barWidth: 15,
            yAxisIndex:1,
            // 柱子设为圆角
            itemStyle: {
              color: "none",
              borderColor: "#00c1de",
              borderWidth: 3,
              barBorderRadius: 15,
            },
          }
        ]
      }
    },
    {
      title: '折线图-播放量',
      option: {
        color: ['#00f2f1', '#ed3f35'],
        tooltip: {
          trigger: 'axis',
          
        },
        legend: {
          top: "0%",
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "12"
          }
        },
        grid: {
          left: "10",
          top: "30",
          right: "10",
          bottom: "10",
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12
            }
          },
           // x轴线的颜色为   rgba(255,255,255,.2)
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.2)"
            }
          },
          data:  [ "01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","26","28","29","30"],      
        },
        yAxis: [
          {
            type: "value",
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            },
            axisLabel: {
              textStyle: {
                color: "rgba(255,255,255,.6)",
                fontSize: 12
              }
            },
            // 修改分割线的颜色
            splitLine: {
              lineStyle: {
                color: "rgba(255,255,255,.1)"
              }
            }
          }
        ],
        series: [
          {
            name: '转发量',
            type: 'line',
            data:  [ 10, 30, 30, 20,40, 50, 30,60,70, 40, 50, 40, 30, 40,30, 40, 30,60,20, 40, 30, 40, 30, 40,30, 40, 20,60,50, 40],
            smooth: true,
            // 单独修改线的样式
            lineStyle: {
                color: "#0184d5",
                width: 2 
            },
             // 填充区域
            areaStyle: {
                  // 渐变色，只需要复制即可
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(1, 132, 213, 0.4)"   // 渐变色的起始颜色
                    },
                    {
                      offset: 0.8,
                      color: "rgba(1, 132, 213, 0.1)"   // 渐变线的结束颜色
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)"
              },
            // 设置拐点 小圆点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
              color: "#0184d5",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,
          },
          {
            name: '播放量',
            type: 'line',
            data: [ 50, 60, 90, 110,30, 50, 20,60,20, 40, 90, 10,20, 130,30, 40, 130,20,20, 40, 80, 70, 30, 40,30, 120, 20,99,50, 20],
            //第一条 线是圆滑
            smooth: true,
            lineStyle: {
              normal: {
                color: "#00d887",
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 216, 135, 0.4)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 216, 135, 0.1)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)"
              }
            },
            // 设置拐点 小圆点
            symbol: "circle",
            // 拐点大小
            symbolSize: 5,
            // 设置拐点颜色以及边框
            itemStyle: {
                color: "#00d887",
                borderColor: "rgba(221, 220, 107, .1)",
                borderWidth: 12
            },
            // 开始不显示拐点， 鼠标经过显示
            showSymbol: false,  
          },
        ]
      }
    },
    {
      title: '饼形图-地区分布',
      option: {
        color: ['#006cff', '#60cda0', '#ed8884', '#ff9f7f', '#0096ff', '#9fe6b8', '#32c5e9', '#1d9dff'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          itemWidth: 10,
          itemHeight: 10,
          bottom: '0%',
          // 修改图例组件的文字为 12px
          textStyle: {
            color: "rgba(255,255,255,.5)",
            fontSize: "10"
          }
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [20, 80],
            center: ['50%', '50%'],
            roseType: 'radius',
            itemStyle: {
              borderRadius: 5
            },
            data: [
              { value: 20, name: '云南' },
              { value: 26, name: '北京' },
              { value: 24, name: '山东' },
              { value: 25, name: '河北' },
              { value: 20, name: '江苏' },
              { value: 25, name: '浙江' },
              { value: 30, name: '四川' },
              { value: 42, name: '湖北' }
            ],
            labelLine: {
              length: 6,
              length2: 8  
            }
          }
        ]
      }
    }
  ]
}