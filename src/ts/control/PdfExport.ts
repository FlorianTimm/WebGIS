import Map from '../openLayers/Map'
import jsPdf from "jspdf";


export class PdfExport {
    public static exportPDF(map: Map): void {
        const resolution = 72;
        const format = [190, 267]
        const width = Math.round((format[0] * resolution) / 25.4);
        const height = Math.round((format[1] * resolution) / 25.4);

        const size = map.getSize() ?? [0, 0];
        const viewResolution = map.getView().getResolution() ?? 10;

        map.once('rendercomplete', () => {

            const mapCanvas = document.createElement('canvas');
            mapCanvas.width = width;
            mapCanvas.height = height;

            const mapContext = mapCanvas.getContext('2d');

            if (!mapContext) return;

            document.querySelectorAll('.ol-layer canvas').forEach((canvasAny) => {
                let canvas = <HTMLCanvasElement>canvasAny
                console.log(canvas)
                if (canvas.width > 0) {
                    const opacity = (<HTMLDivElement>canvas.parentNode).style?.opacity;
                    mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                    mapContext.drawImage(canvas, 0, 0);
                }
            });
            mapContext.globalAlpha = 1;
            mapContext.setTransform(1, 0, 0, 1, 0, 0);

            let pdf = new jsPdf('portrait', undefined, 'a4');
            pdf.addImage(
                mapCanvas.toDataURL('image/jpeg'),
                'JPEG',
                10,
                20,
                format[0],
                format[1]
            );
            pdf.text('UAV-Flugplanung', 10, 18)
            pdf.save('map.pdf');
            // Reset original map size
            map.setSize(size);
            map.getView().setResolution(viewResolution);
            document.body.style.cursor = 'auto';
        });

        const printSize = [width, height];
        map.setSize(printSize);
        const scaling = Math.min(width / size[0], height / size[1]);
        map.getView().setResolution(viewResolution / scaling);
    }
}