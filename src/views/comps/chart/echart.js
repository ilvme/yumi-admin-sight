import * as echarts from 'echarts/core'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout, UniversalTransition } from 'echarts/features'

echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  PieChart,
  LineChart,
  CanvasRenderer,
  DatasetComponent,
  LabelLayout,
  UniversalTransition,
  TransformComponent,
])

export default echarts
