import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { loadMultiPool } from '../store/actions/multiPool'
import PageHeader from '../Components/PageHeader/PageHeader'
import classes from './PoolPage.module.scss'
import Metric from '../Components/Metric/Metric'
import { genFormattedNumber } from '../util/numberFormat'
import { Chart } from 'react-google-charts'
import Loader from '../Components/Loader/Loader'
import SegmentedTabs from '../Components/SegmentedTabs/SegmentedTabs'
import cx from 'classnames'
import _ from 'lodash'
import BalApyMetric from '../Components/BalApyMetric/BalApyMetric'

const MultiPoolPage: FunctionComponent = () => {
  const [chartType, setChartType] = useState('assetPrice')
  const [chartTimePeriod, setChartTimePeriod] = useState('30_day')

  const mounted:any = useRef()

  const params:any = useParams()
  const contractAddress:string = params.contract_address

  const dispatch = useDispatch()

  const multiPoolState = useSelector((state:any) => state.multiPool)

  useEffect(() => {
    if (!mounted.current) {
      // do componentDidMount logic
      dispatch({ type: 'SET_MULTI_POOL', payload: { contractAddress } })
      dispatch(loadMultiPool())

      mounted.current = true;
    } else {
      // do componentDidUpdate logic
      if (contractAddress && contractAddress !== multiPoolState.contractAddress) {
        dispatch({ type: 'RESET_MULTI_POOL' })
        dispatch({ type: 'SET_MULTI_POOL', payload: { contractAddress } })
        dispatch(loadMultiPool())
      }
    }
  })

  const handleChartTypeTab = (value:string) => {
    setChartType(value)
  }

  const handleChartTimePeriodTab = (value:string) => {
    setChartTimePeriod(value)
  }

  if (multiPoolState.meta.success) {
    // // Transform chart data by period
    // let timePeriod
    // switch (chartTimePeriod) {
    //   case "7_day": {
    //     timePeriod = 7
    //     break;
    //   }

    //   case "30_day": {
    //     timePeriod = 30
    //     break;
    //   }

    //   case "365_day": {
    //     timePeriod = 365
    //     break;
    //   }
    // }

    let chartData
    let chartLeftMargin
    switch (chartType) {
      case 'assetPrice': {
        chartData = [
          ['Datetime', 'Asset Price'],
          ...multiPoolState.data.chart.assetPrice,
        ]
        chartLeftMargin = 50
        break
      }

      case 'volume': {
        chartData = [
          ['Datetime', 'Volume'],
          ...multiPoolState.data.chart.volume,
        ]
        chartLeftMargin = 70
        break
      }

      case 'liquidity': {
        chartData = [
          ['Datetime', 'Liquidity'],
          ...multiPoolState.data.chart.liquidity,
        ]
        chartLeftMargin = 80
        break
      }

      case 'feeReturns': {
        chartData = [
          ['Datetime', 'Fee Returns'],
          ...multiPoolState.data.chart.feeReturns,
        ]
        chartLeftMargin = 40
        break
      }
    }

    // Get most recent and second most recent price array
    const priceArray0:any = _.takeRight(multiPoolState.data.chart.assetPrice, 1)[0]
    const price0 = priceArray0[1]
    const priceArray1:any = _.takeRight(multiPoolState.data.chart.assetPrice, 2)[0]
    const price1 = priceArray1[1]
    const percChange = ((price0 - price1) / price1) * 100

    return (
      <div className={classes.container}>
        <div className={classes.dashboardContainer}>
          <PageHeader
            title={multiPoolState.name}
            price={genFormattedNumber(price0, 2)}
            priceChangePerc={genFormattedNumber(percChange, 2)}
            percChange
          />

          <div className={classes.dashboard}>

            <div className={classes.dashboardLeft}>
            <div className={cx(classes.chartCard, classes.card)}>
                <div className={classes.chartContainer}>
                  <Chart
                    width={'100%'}
                    height={'100%'}
                    chartType={ chartType === 'assetPrice' ? 'LineChart' : 'ColumnChart' }
                    loader={<div>Loading Chart</div>}
                    data={chartData}
                    options={{
                      legend: 'none',
                      chartArea: {
                        left: chartLeftMargin,
                        top: 20,
                        width: '90%',
                        height: '90%',
                      },
                      colors: ['#848ca9'],
                      hAxis: {
                        textPosition: 'none',
                        gridlines: {
                          color: 'transparent'
                        },
                        textStyle: {
                          fontName: 'Inter',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#595e78',
                        },
                      },
                      vAxis: {
                        format: chartType === 'feeReturns' ? '#,###%' : '$#,###',
                        gridlines: {
                          color: '#e6e6f0'
                        },
                        minorGridlines: {
                          color: 'transparent'
                        },
                        textStyle: {
                          fontName: 'Inter',
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#595e78',
                        },
                      },
                    }}
                  />
                </div>

                <div className={classes.chartActions}>
                  <div
                    className={classes.typeTabContainer}
                    style={{
                      maxWidth: '380px'
                    }}
                  >
                    <SegmentedTabs
                      items={[{
                        text: 'Asset Price',
                        value: 'assetPrice',
                      },{
                        text: 'Volume',
                        value: 'volume',
                      },{
                        text: 'Liquidity',
                        value: 'liquidity',
                      },{
                        text: 'Fee Returns',
                        value: 'feeReturns',
                      }]}
                      value={chartType}
                      onInput={handleChartTypeTab}
                    />
                  </div>

                  {/* <div className={classes.timePeriodTabContainer}>
                    <SegmentedTabs
                      items={[{
                        text: '7D',
                        value: '7_day',
                      }, {
                        text: '30D',
                        value: '30_day',
                      }, {
                        text: '1Y',
                        value: '365_day',
                      }]}
                      value={chartTimePeriod}
                      onInput={handleChartTimePeriodTab}
                    />
                  </div> */}
                </div>
              </div>

              <div className={classes.threeGrid}>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="Holder Count"
                    valueItems={[{
                      value: multiPoolState.data.liquidityProviderCount,
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="Asset Value"
                    valueItems={[{
                      prefix: '$',
                      value: genFormattedNumber(multiPoolState.data.assetValue, 0),
                      suffix: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="Liquidity"
                    valueItems={[{
                      prefix: '$',
                      value: genFormattedNumber(multiPoolState.data.liquidity, 0),
                      suffix: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="24H Volume"
                    valueItems={[{
                      prefix: '$',
                      value: genFormattedNumber(multiPoolState.data.volume, 0),
                      suffix: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="24H Fees Earned"
                    valueItems={[{
                      prefix: '$',
                      value: genFormattedNumber(multiPoolState.data.feesEarned, 2),
                      suffix: 'USD',
                    }]}
                  />
                </div>
                <div className={classes.card}>
                  <Metric
                    className={classes.metric}
                    label="24H Fees APY"
                    valueItems={[{
                      value: genFormattedNumber(multiPoolState.data.feesApy * 100, 2),
                      suffix: '%',
                    }]}
                  />
                </div>
              </div>
            </div>

            <div className={classes.dashboardRight}>
              <div className={classes.card}>
                <div className={classes.cardTitle}>Assets</div>
                <Chart
                  width={'100%'}
                  height={'200px'}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ['Asset', 'Ratio'],
                    ...multiPoolState.assets.map((item:any) => ([
                      item.ticker,
                      item.proportion,
                    ])),
                  ]}
                  options={{
                    chartArea: {
                      left: 0,
                      top: 10,
                      width: '100%',
                      height: '90%',
                    },
                    legend: 'none',
                    pieSliceText: 'label',
                    fontSize: 13,
                    fontName: 'Inter',
                    tooltip: {
                      trigger: 'selection',
                    },
                    colors: multiPoolState.assets.map((item:any) => item.brandColor),
                  }}
                />
              </div>

              <div className={classes.card}>
                <BalApyMetric />
              </div>
            </div>

          </div>
        </div>

        <div className={classes.wallet}>

        </div>
      </div>
    )
  } else {
    return <Loader />
  }
}

export default MultiPoolPage
