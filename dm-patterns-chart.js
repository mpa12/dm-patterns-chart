class DmPatternsChart {
    options = {};
    scene;
    backgroundSector;

    constructor(options) {
        const defaultOptions = {
            container: undefined,
            values: [50, 50, 50],
            titles: ['Оперативный', 'Тактический', 'Стратегический'],
            titlesHidden: false,
            interestHidden: false,
            dottedLinesHidden: false,
            colors: {
                ellipse: '#000',
                background: '#fefab7',
                value: '#F9EC0E',
            },
            sizes: {
                arc: 15,
            }
        };

        this.options = Object.assign(defaultOptions, options);

        if (!this.options.container) {
            throw new Error('Container not specified!');
        }

        this.render();
    }

    render() {
        this.createScene();
        this.renderSector();
        this.renderPoints();
    }

    createScene() {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );

        svg.setAttribute('width', this.options.container.offsetWidth);
        svg.setAttribute('height', this.options.container.offsetHeight);

        this.options.container.appendChild(svg);

        this.scene = svg;

        return svg;
    }

    renderSector() {
        const containerWidth = this.options.container.offsetWidth;
        const containerHeight = this.options.container.offsetHeight;
        const sectorRatio = 1080 / 600;
        let sectorWidth = containerWidth;
        const sectorHeight = containerWidth / sectorRatio;
        const x = 0;
        const y = containerHeight / 2;

        const sector = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sector.setAttribute('d', `M ${x} ${y} L ${x + sectorWidth} ${y - sectorHeight / 2} A ${x + sectorWidth} ${y + sectorHeight / 2} 0 0 1 ${x + sectorWidth} ${y + sectorHeight / 2} Z`);
        sector.setAttribute('fill', this.options.colors.background);

        this.scene.appendChild(sector);

        const rightPoint = [sectorWidth, y];
        sectorWidth -= sector.getBBox().width - containerWidth;
        sectorWidth -= this.options.sizes.arc / 2;

        sector.setAttribute('d', `M ${x} ${y} L ${x + sectorWidth} ${y - sectorHeight / 2} A ${x + sectorWidth} ${y + sectorHeight / 2} 0 0 1 ${x + sectorWidth} ${y + sectorHeight / 2} Z`);

        this.backgroundSector = {
            svg: sector,
            props: {
                sectorWidth,
                startSector: [x, y],
                topPoint: [x + sectorWidth, y + sectorHeight / 2],
                bottomPoint: [x + sectorWidth, y - sectorHeight / 2],
                rightPoint,
                rx: x + sectorWidth,
                ry: y + sectorHeight / 2
            }
        };
    }

    renderPoints() {
        const containerWidth = this.options.container.offsetWidth;
        const pointRadius = containerWidth / 10 / 2;
        const y = this.options.container.offsetHeight / 2;

        // Круг
        const point = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
        );
        point.setAttribute('cx', pointRadius);
        point.setAttribute('cy', y);
        point.setAttribute('r', pointRadius);
        point.setAttribute('fill', this.options.colors.ellipse);
        this.scene.appendChild(point);

        const step = this.backgroundSector.svg.getBBox().width / 3;

        // Дуга 1
        // let movedStart = this.movePointOnCircle(
        //     this.backgroundSector.props.startSector[0],
        //     this.backgroundSector.props.startSector[1],
        //     this.backgroundSector.props.topPoint[0],
        //     this.backgroundSector.props.topPoint[1],
        //     2
        // );
        // let movedEnd = this.movePointOnCircle(
        //     this.backgroundSector.props.startSector[0],
        //     this.backgroundSector.props.startSector[1],
        //     this.backgroundSector.props.bottomPoint[0],
        //     this.backgroundSector.props.bottomPoint[1],
        //     -2
        // );
        // const arc1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // arc1.setAttribute('d', `M ${movedStart[0] - 4} ${movedStart[1]} A ${this.backgroundSector.props.rx - 4} ${this.backgroundSector.props.ry + 4} 0 0 0 ${movedEnd[0] - 4} ${movedEnd[1]}`);
        // arc1.setAttribute('fill', 'none');
        // arc1.setAttribute('stroke', this.options.colors.ellipse);
        // arc1.setAttribute('stroke-width', this.options.sizes.arc);
        // this.scene.appendChild(arc1);
        //
        // // Дуга 2
        // movedStart = this.movePointOnCircle(
        //     this.backgroundSector.props.startSector[0],
        //     this.backgroundSector.props.startSector[1],
        //     this.backgroundSector.props.topPoint[0] - step,
        //     this.backgroundSector.props.topPoint[1],
        //     -4
        // );
        // movedEnd = this.movePointOnCircle(
        //     this.backgroundSector.props.startSector[0],
        //     this.backgroundSector.props.startSector[1],
        //     this.backgroundSector.props.bottomPoint[0] - step,
        //     this.backgroundSector.props.bottomPoint[1],
        //     4
        // );
        // const arc2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // arc2.setAttribute('d', `M ${movedStart[0] - 8} ${movedStart[1]} A ${this.backgroundSector.props.rx - 8} ${this.backgroundSector.props.ry + 8} 0 0 0 ${movedEnd[0] - 8} ${movedEnd[1]}`);
        // arc2.setAttribute('fill', 'none');
        // arc2.setAttribute('stroke', this.options.colors.ellipse);
        // arc2.setAttribute('stroke-width', this.options.sizes.arc);
        // this.scene.appendChild(arc2);
        //
        // // Дуга 3
        // movedStart = this.movePointOnCircle(
        //     this.backgroundSector.props.startSector[0],
        //     this.backgroundSector.props.startSector[1],
        //     this.backgroundSector.props.topPoint[0] - step * 2,
        //     this.backgroundSector.props.topPoint[1],
        //     -25
        // );
        // movedEnd = this.movePointOnCircle(
        //     this.backgroundSector.props.startSector[0],
        //     this.backgroundSector.props.startSector[1],
        //     this.backgroundSector.props.bottomPoint[0] - step * 2,
        //     this.backgroundSector.props.bottomPoint[1],
        //     25
        // );
        // const arc3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // arc3.setAttribute('d', `M ${movedStart[0] - 50} ${movedStart[1]} A ${this.backgroundSector.props.rx + 50} ${this.backgroundSector.props.ry - 50} 0 0 0 ${movedEnd[0] - 50} ${movedEnd[1]}`);
        // arc3.setAttribute('fill', 'none');
        // arc3.setAttribute('stroke', this.options.colors.ellipse);
        // arc3.setAttribute('stroke-width', this.options.sizes.arc);
        // this.scene.appendChild(arc3);
    }

    movePointOnCircle(centerX, centerY, pointX, pointY, deltaAngle) {
        // Переводим угол в радианы
        deltaAngle = deltaAngle * (Math.PI / 180);

        // Вычисляем вектор от центра до точки
        const vectorX = pointX - centerX;
        const vectorY = pointY - centerY;

        // Вычисляем новый угол
        const currentAngle = Math.atan2(vectorY, vectorX);
        const newAngle = currentAngle + deltaAngle;

        // Вычисляем новые координаты точки
        const radius = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        const newX = centerX + radius * Math.cos(newAngle);
        const newY = centerY + radius * Math.sin(newAngle);

        // Возвращаем новые координаты точки
        return [newX, newY]
    }

    renderDottedLines() {
        // TODO: Рендер пунктирной линии
    }
}