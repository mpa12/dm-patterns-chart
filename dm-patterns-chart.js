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
                dottedLine: '#000',
                percents: '#000',
                titles: '#000',
            },
            sizes: {
                arc: 10,
                pointRadius: undefined,
                titleFontSize: undefined,
            }
        };

        this.options = Object.assign(defaultOptions, options);

        if (!this.options.container) {
            throw new Error('Container not specified!');
        }

        this.render();

        window.addEventListener('resize', this.rerender.bind(this));
    }

    render() {
        this.createScene();

        this.renderBgSector();
        this.createPoint();
        this.createArc1();
        this.createArc2();
        this.createArc3();
        this.renderValueSector();

        if (!this.options.dottedLinesHidden) {
            this.renderDottedLines();
        }

        if (!this.options.percentsHidden) {
            this.renderPercents();
        }

        if (!this.options.titlesHidden) {
            this.renderTitles();
        }

        this.renderPoint();
        this.renderArc1();
        this.renderArc2();
        this.renderArc3();
    }

    rerender() {
        this.options.container.innerHTML = '';

        this.render();
    }

    createScene() {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        );

        svg.setAttribute('width', this.getElementContentWidth(this.options.container));
        svg.setAttribute('height', this.getElementContentHeight(this.options.container));

        this.options.container.appendChild(svg);

        this.scene = svg;

        return svg;
    }

    renderBgSector() {
        const containerWidth = this.getElementContentWidth(this.options.container);

        const sceneRightPadding = this.options.sizes.arc / 2;

        const sectorRadius = containerWidth - sceneRightPadding;

        const sectorHalfHeight = this.findOppositeSide(sectorRadius, 15);
        const sectorArcHalfHeight = this.findOppositeSide(sectorRadius, 20);

        const topSectorPointX = this.findAdjacentSide(sectorRadius, 15) - sceneRightPadding;

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
                sectorStart: [x, y],
            }
        }
    }

    createPoint() {
        const containerWidth = this.getElementContentWidth(this.options.container);

        const pointRadius = this.options.sizes.pointRadius || containerWidth / 10 / 2;
        const y = this.bgSector.props.y;

        const point = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'circle'
        );
        point.setAttribute('cx', pointRadius);
        point.setAttribute('cy', y);
        point.setAttribute('r', pointRadius);
        point.setAttribute('fill', this.options.colors.ellipse);

        this.point = {
            svg: point,
            props: {
                pointRadius,
                y,
                x: pointRadius
            },
        };
    }
    renderPoint() {
        this.scene.appendChild(this.point.svg);
    }

    createArc1() {
        const {
            sectorArcHalfHeight,
            sectorRadius,
            y: sectorStartY,
            sceneRightPadding,
        } = this.bgSector.props;

        const topArcPointX = this.findAdjacentSide(sectorRadius, 20) - sceneRightPadding;

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
                arcCenter: [sectorRadius, sectorStartY],
            },
        };
    }
    renderArc1() {
        this.scene.appendChild(this.arc1.svg);
    }

    createArc2() {
        const {
            sectorRadius,
            y: sectorStartY,
            sceneRightPadding,
        } = this.bgSector.props;

        const topArcPointX = this.findAdjacentSide(sectorRadius / 3 * 2, 20) - sceneRightPadding;

        const topArcPointY = this.findOppositeSide(sectorRadius / 3 * 2, 20);

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
                arcCenter: [sectorRadius / 3 * 2, sectorStartY],
            },
        };
    }
    renderArc2() {
        this.scene.appendChild(this.arc2.svg);
    }

    createArc3() {
        const {
            sectorRadius,
            y: sectorStartY,
            sceneRightPadding,
        } = this.bgSector.props;

        const topArcPointX = this.findAdjacentSide(sectorRadius / 3, 20) - sceneRightPadding;

        const topArcPointY = this.findOppositeSide(sectorRadius / 3, 20);

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
                arcCenter: [sectorRadius / 3, sectorStartY],
            },
        };
    }
    renderArc3() {
        this.scene.appendChild(this.arc3.svg);
    }

    renderDottedLines() {
        const { sectorRadius, x: sectorStartX } = this.bgSector.props;
        const { x: pointX, y: pointY } = this.point.props;

        const sectorPartWidth = sectorRadius / 3;
        const endY = this.getElementContentHeight(this.options.container) - 1;

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
            line.setAttribute('stroke', this.options.colors.dottedLine);
            line.setAttribute('stroke-dasharray', '8');
            dottedLinesContainer.appendChild(line);
        }

        // Добавляем контейнер в сцену
        this.scene.appendChild(dottedLinesContainer);
    }

    renderPercents() {
        const TOP_SHIFT = -2;

        const { sectorRadius, x: sectorStartX } = this.bgSector.props;
        const { x: pointX } = this.point.props;

        const sectorPartWidth = sectorRadius / 3;
        const endY = this.getElementContentHeight(this.options.container) - 1;

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
            text.setAttribute('y', textCoordinates[i][1] + TOP_SHIFT);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', this.options.colors.percents);
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
        const { values } = this.options;

        const { sectorStart, sceneRightPadding } = this.bgSector.props;
        const { arcCenter: arc3Center } = this.arc3.props;
        const { arcCenter: arc2Center } = this.arc2.props;
        const { arcCenter: arc1Center } = this.arc1.props;

        const arc3Height = this.findOppositeSide(arc3Center[0], 15 * values[0] / 100);
        const arc3Width = this.findAdjacentSide(arc3Center[0], 15 * values[0] / 100) - sceneRightPadding;

        const arc2Height = this.findOppositeSide(arc2Center[0], 15 * values[1] / 100);
        const arc2Width = this.findAdjacentSide(arc2Center[0], 15 * values[1] / 100) - sceneRightPadding;

        const arc1Height = this.findOppositeSide(arc1Center[0], 15 * values[2] / 100);
        const arc1Width = this.findAdjacentSide(arc1Center[0], 15 * values[2] / 100) - sceneRightPadding;

        const coordinates = [
            sectorStart,
            [arc3Width, arc3Center[1] - arc3Height],
            [arc2Width, arc2Center[1] - arc2Height],
            [arc1Width, arc1Center[1] - arc1Height],
            [arc1Width, arc1Center[1] + arc1Height],
            [arc2Width, arc2Center[1] + arc2Height],
            [arc3Width, arc3Center[1] + arc3Height],
        ];

        // Создаем элемент дуги
        const arcPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        const dAttribute = `
        M ${coordinates[0].join(' ')} 
        L ${coordinates[1].join(' ')} 
        L ${coordinates[2].join(' ')} 
        L ${coordinates[3].join(' ')}
        A ${arc1Center[0]} ${arc1Center[0]} 0 0 1 ${coordinates[4].join(' ')}
        L ${coordinates[4].join(' ')} 
        L ${coordinates[5].join(' ')} 
        L ${coordinates[6].join(' ')} 
        L ${coordinates[0].join(' ')} 
        Z`;
        arcPath.setAttribute('d', dAttribute);
        arcPath.setAttribute('fill', this.options.colors.value);

        this.scene.appendChild(arcPath);
    }

    renderTitles() {
        const { sectorRadius, x: sectorStartX, y: sectorStartY } = this.bgSector.props;
        const { x: pointX, pointRadius } = this.point.props;

        const sectorPartWidth = sectorRadius / 3;

        const borderCoordinates = [
            [pointX + pointRadius, sectorStartY],
            [sectorStartX + sectorPartWidth, sectorStartY],
            [sectorStartX + sectorPartWidth * 2, sectorStartY],
            [sectorStartX + sectorPartWidth * 3, sectorStartY],
        ];

        const fontSize = this.options.sizes.titleFontSize || sectorPartWidth / 13;

        const textCoordinates = [
            this.getMiddlePoint(borderCoordinates[0], borderCoordinates[1]),
            this.getMiddlePoint(borderCoordinates[1], borderCoordinates[2]),
            this.getMiddlePoint(borderCoordinates[2], borderCoordinates[3]),
        ];

        const titleContainer = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'g'
        );

        for (let i = 0; i < this.options.values.length; i++) {
            const text = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'text'
            );
            text.setAttribute('x', textCoordinates[i][0]);
            text.setAttribute('y', textCoordinates[i][1]);
            text.setAttribute('fill', this.options.colors.titles);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'central');
            text.style.fontSize = `${fontSize}px`;
            text.style.fontWeight = '600';

            text.textContent = this.options.titles[i] || '';

            titleContainer.appendChild(text);
        }

        this.scene.appendChild(titleContainer);
    }

    findOppositeSide(hypotenuse, angleInDegrees) {
        // Преобразование угла из градусов в радианы
        const angleInRadians = angleInDegrees * (Math.PI / 180);

        // Нахождение противолежащего катета с использованием синуса
        return hypotenuse * Math.sin(angleInRadians);
    }

    findAdjacentSide(hypotenuse, angleInDegrees) {
        // Преобразование угла из градусов в радианы
        const angleInRadians = angleInDegrees * (Math.PI / 180);

        // Нахождение прилежащего катета с использованием косинуса
        return hypotenuse * Math.cos(angleInRadians);
    }

    getElementContentWidth(element) {
        const styles = window.getComputedStyle(element);
        const padding = parseFloat(styles.paddingLeft) +
            parseFloat(styles.paddingRight);

        return element.clientWidth - padding;
    }

    getElementContentHeight(element) {
        const styles = window.getComputedStyle(element);
        const padding = parseFloat(styles.paddingTop) +
            parseFloat(styles.paddingBottom);

        return element.clientHeight - padding;
    }
}
