import { Component, onMounted, onWillUpdateProps, useRef, xml } from "@odoo/owl";
import { Chart as ChartJS } from "chart.js";
import { PropsType } from "../UtilityTypes";

const props = {
  width: { type: Number, optional: true },
  height: { type: Number, optional: true },
  type: { type: String },
  options: { type: Object, optional: true },
  data: { type: Object },
};

type Props = PropsType<typeof props>;

class Chart extends Component<Props> {

  static template = xml`
    <div t-ref="chart-container" class="w-full h-full">
      <canvas t-ref="canvas" />
    </div>
  `;

  static props = props;

  canvas = useRef<HTMLCanvasElement>('canvas');
  container = useRef<HTMLDivElement>('chart-container');

  chart: ChartJS | undefined; 

  setup(): void {
    const {
      width,
      height,
      data,
      options,
      type,
    } = this.props;

    onMounted(() => {
      // Find dimensions if not provided
      const container = this.container.el as HTMLDivElement;
      const canvas = this.canvas.el as HTMLCanvasElement;

      const chartWidth = width ?? container.clientWidth;
      const chartHeight = height ?? container.clientHeight;

      // Assign width and height
      canvas.style.width = `${chartWidth}px`;
      canvas.style.height = `${chartHeight}px`;

      this.chart = new ChartJS(canvas.getContext('2d') as CanvasRenderingContext2D, {
        type: type as any, // Its ok, look away.
        data,
        options,
      });
    });

    onWillUpdateProps((nextProps) => {
      if (this.chart) {
        this.chart.data = nextProps.data;
        this.chart.update();
      }
    });
  }
};

export default Chart;