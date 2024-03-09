class DmPatternsChart {
    options = {};

    scene;

    bgSector;
    point;
    arc1;
    arc2;
    arc3;

    constructor(options) {
        const defaultOptions = {
            container: undefined,
            values: [50, 50, 50],
            titles: ['Оперативный', 'Тактический', 'Стратегический'],
            titlesHidden: false,
            percentsHidden: false,
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

        this.renderBgSector();
        this.renderValueSector();
        this.renderPoint();
        this.renderArc1();
        this.renderArc2();
        this.renderArc3();

        if (!this.options.dottedLinesHidden) {
            this.renderDottedLines();
        }

        if (!this.options.percentsHidden) {
            this.renderPercents();
        }
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

    renderBgSector() {
        const containerWidth = this.options.container.offsetWidth;

        const sceneRightPadding = this.options.sizes.arc / 2;

        const sectorRadius = containerWidth - sceneRightPadding;

        const sectorHalfHeight = findOppositeSide(sectorRadius, 15);
        const sectorArcHalfHeight = findOppositeSide(sectorRadius, 20);

        const topSectorPointX = findAdjacentSide(sectorRadius, 15) - sceneRightPadding;

        const x = 0;
        const y = sectorArcHalfHeight;

        const sector = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        sector.setAttribute(
            'd',
            `
            M ${x} ${y} 
            L ${x + topSectorPointX} ${y - sectorHalfHeight} 
            A ${sectorRadius} ${sectorRadius} 0 0 1 ${x + topSectorPointX} ${y + sectorHalfHeight} 
            Z
            `
        );
        sector.setAttribute('fill', this.options.colors.background);
        this.scene.appendChild(sector);

        this.bgSector = {
            svg: sector,
            props: {
                sectorHalfHeight,
                sectorArcHalfHeight,
                topSectorPointX,
                x,
                y,
                sectorRadius,
                sceneRightPadding,
            }
        }
    }

    renderPoint() {
        const containerWidth = this.options.container.offsetWidth;

        const pointRadius = containerWidth / 10 / 2;
        const y = this.bgSector.props.y;

        const point = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
        );
        point.setAttribute('cx', pointRadius);
        point.setAttribute('cy', y);
        point.setAttribute('r', pointRadius);
        point.setAttribute('fill', this.options.colors.ellipse);
        this.scene.appendChild(point);

        this.point = {
            svg: point,
            props: {
                pointRadius,
                y,
                x: pointRadius
            },
        };
    }

    renderArc1() {
        const {
            sectorArcHalfHeight,
            sectorRadius,
            y: sectorStartY,
            sceneRightPadding,
        } = this.bgSector.props;

        const topArcPointX = findAdjacentSide(sectorRadius, 20) - sceneRightPadding;

        const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arc.setAttribute(
            'd',
            `
            M ${topArcPointX} ${sectorStartY - sectorArcHalfHeight} 
            A ${sectorRadius} ${sectorRadius} 0 0 1 ${topArcPointX} ${sectorStartY + sectorArcHalfHeight}
            `
        );
        arc.setAttribute('fill', 'none');
        arc.setAttribute('stroke', this.options.colors.ellipse);
        arc.setAttribute('stroke-width', this.options.sizes.arc);
        this.scene.appendChild(arc);

        this.arc1 = {
            svg: arc,
            props: {
                topArcPointX,
                startPoint: [topArcPointX, sectorStartY - sectorArcHalfHeight],
                endPoint: [topArcPointX, sectorStartY + sectorArcHalfHeight],
            },
        };
    }

    renderArc2() {
        const {
            sectorRadius,
            y: sectorStartY,
            sceneRightPadding,
        } = this.bgSector.props;

        const topArcPointX = findAdjacentSide(sectorRadius / 3 * 2, 20) - sceneRightPadding;

        const topArcPointY = findOppositeSide(sectorRadius / 3 * 2, 20);

        const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arc.setAttribute(
            'd',
            `
            M ${topArcPointX} ${sectorStartY - topArcPointY} 
            A ${sectorRadius / 3 * 2} ${sectorRadius / 3 * 2} 0 0 1 ${topArcPointX} ${sectorStartY + topArcPointY}
            `
        );
        arc.setAttribute('fill', 'none');
        arc.setAttribute('stroke', this.options.colors.ellipse);
        arc.setAttribute('stroke-width', this.options.sizes.arc);
        this.scene.appendChild(arc);

        this.arc2 = {
            svg: arc,
            props: {
                topArcPointX,
                startPoint: [topArcPointX, sectorStartY - topArcPointY],
                endPoint: [topArcPointX, sectorStartY + topArcPointY],
            },
        };
    }

    renderArc3() {
        const {
            sectorRadius,
            y: sectorStartY,
            sceneRightPadding,
        } = this.bgSector.props;

        const topArcPointX = findAdjacentSide(sectorRadius / 3, 20) - sceneRightPadding;

        const topArcPointY = findOppositeSide(sectorRadius / 3, 20);

        const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        arc.setAttribute(
            'd',
            `
            M ${topArcPointX} ${sectorStartY - topArcPointY} 
            A ${sectorRadius / 3} ${sectorRadius / 3} 0 0 1 ${topArcPointX} ${sectorStartY + topArcPointY}
            `
        );
        arc.setAttribute('fill', 'none');
        arc.setAttribute('stroke', this.options.colors.ellipse);
        arc.setAttribute('stroke-width', this.options.sizes.arc);
        this.scene.appendChild(arc);

        this.arc3 = {
            svg: arc,
            props: {
                topArcPointX,
                startPoint: [topArcPointX, sectorStartY - topArcPointY],
                endPoint: [topArcPointX, sectorStartY + topArcPointY],
            },
        };
    }

    renderDottedLines() {
        const { sectorRadius, x: sectorStartX } = this.bgSector.props;
        const { x: pointX, y: pointY } = this.point.props;

        const sectorPartWidth = sectorRadius / 3;
        const endY = this.options.container.offsetHeight - 1;

        const linesStarts = [
            [pointX, pointY],
            [sectorStartX + sectorPartWidth, pointY],
            [sectorStartX + sectorPartWidth * 2, pointY],
            [sectorStartX + sectorPartWidth * 3, pointY],
        ];
        const linesEnds = [
            [pointX, endY],
            [sectorStartX + sectorPartWidth, endY],
            [sectorStartX + sectorPartWidth * 2, endY],
            [sectorStartX + sectorPartWidth * 3, endY],
        ];

        // Создаем контейнер для пунктирных линий
        const dottedLinesContainer = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'g'
        );

        // Добавляем линии в контейнер
        for (let i = 0; i < 4; i++) {
            const line = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'line'
            );
            line.setAttribute('x1', linesStarts[i][0]);
            line.setAttribute('y1', linesStarts[i][1]);
            line.setAttribute('x2', linesEnds[i][0]);
            line.setAttribute('y2', linesEnds[i][1]);
            line.setAttribute('stroke', 'black');
            line.setAttribute('stroke-dasharray', '8');
            dottedLinesContainer.appendChild(line);
        }

        // Добавляем контейнер в сцену
        this.scene.appendChild(dottedLinesContainer);
    }

    renderPercents() {
        const { sectorRadius, x: sectorStartX } = this.bgSector.props;
        const { x: pointX } = this.point.props;

        const sectorPartWidth = sectorRadius / 3;
        const endY = this.options.container.offsetHeight - 1;

        const borderCoordinates = [
            [pointX, endY],
            [sectorStartX + sectorPartWidth, endY],
            [sectorStartX + sectorPartWidth * 2, endY],
            [sectorStartX + sectorPartWidth * 3, endY],
        ];

        const fontSize = sectorPartWidth / 4;

        const textCoordinates = [
            this.getMiddlePoint(borderCoordinates[0], borderCoordinates[1]),
            this.getMiddlePoint(borderCoordinates[1], borderCoordinates[2]),
            this.getMiddlePoint(borderCoordinates[2], borderCoordinates[3]),
        ];

        const percentsContainer = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'g'
        );

        for (let i = 0; i < this.options.values.length; i++) {
            const percent = this.options.values[i];

            const text = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'text'
            );
            text.setAttribute('x', textCoordinates[i][0]);
            text.setAttribute('y', textCoordinates[i][1]);
            text.setAttribute('text-anchor', 'middle');
            text.style.fontSize = `${fontSize}px`;
            text.style.fontWeight = '600';

            text.textContent = `${percent}%`;

            percentsContainer.appendChild(text);
        }

        this.scene.appendChild(percentsContainer);
    }

    getMiddlePoint(point1, point2) {
        return [
            (point1[0] + point2[0]) / 2,
            (point1[1] + point2[1]) / 2,
        ];
    }

    renderValueSector() {
        // TODO: Отображение сектора с значениями
    }
}

function findOppositeSide(hypotenuse, angleInDegrees) {
    // Преобразование угла из градусов в радианы
    const angleInRadians = angleInDegrees * (Math.PI / 180);

    // Нахождение противолежащего катета с использованием синуса
    return hypotenuse * Math.sin(angleInRadians);
}

function findAdjacentSide(hypotenuse, angleInDegrees) {
    // Преобразование угла из градусов в радианы
    const angleInRadians = angleInDegrees * (Math.PI / 180);

    // Нахождение прилежащего катета с использованием косинуса
    return hypotenuse * Math.cos(angleInRadians);
}