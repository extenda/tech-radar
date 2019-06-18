// The MIT License (MIT)

// Copyright (c) 2017 Zalando SE

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import * as selection from 'd3-selection';
import * as force from 'd3-force';

const d3 = {
  ...selection,
  ...force,
};

const fontFamily = '"Raleway", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif';

// ES6 class variant of Zalando's original visualizer. This class supports updating entries after initial rendering
export default class SvgRadar {

  // custom random number builder, to make random sequence reproducible
  // source: https://stackoverflow.com/questions/521295
  #seed = 42;

  // radial_min / radial_max are multiples of PI
  #quadrants = [
    { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
    { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
    { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
    { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 },
  ];

  #rings = [
    { radius: 130 },
    { radius: 220 },
    { radius: 310 },
    { radius: 400 },
  ];

  #footer_offset =
    { x: -675, y: 420 };

  #legend_offset = [
    { x: 450, y: 90 },
    { x: -675, y: 90 },
    { x: -675, y: -310 },
    { x: 450, y: -310 },
  ];

  constructor(config) {
    this.config = config;
    this.radar = null;
    this.rink = null;
  }

  random = () => {
    let x = Math.sin(this.#seed++) * 10000;
    return x - Math.floor(x);
  };

  random_between = (min, max) => {
    return min + this.random() * (max - min);
  };

  normal_between = (min, max) => {
    return min + (this.random() + this.random()) * 0.5 * (max - min);
  };


  polar = (cartesian) => {
    let x = cartesian.x;
    let y = cartesian.y;
    return {
      t: Math.atan2(y, x),
      r: Math.sqrt(x * x + y * y),
    }
  };

  cartesian = (polar) => ({
    x: polar.r * Math.cos(polar.t),
    y: polar.r * Math.sin(polar.t),
  });

  bounded_interval = (value, min, max) => {
    let low = Math.min(min, max);
    let high = Math.max(min, max);
    return Math.min(Math.max(value, low), high);
  };

  bounded_ring = (polar, r_min, r_max) => ({
    t: polar.t,
    r: this.bounded_interval(polar.r, r_min, r_max),
  });

  bounded_box = (point, min, max) => ({
    x: this.bounded_interval(point.x, min.x, max.x),
    y: this.bounded_interval(point.y, min.y, max.y)
  });

  segment = (quadrant, ring) => {
    let polar_min = {
      t: this.#quadrants[quadrant].radial_min * Math.PI,
      r: ring === 0 ? 30 : this.#rings[ring - 1].radius
    };
    let polar_max = {
      t: this.#quadrants[quadrant].radial_max * Math.PI,
      r: this.#rings[ring].radius
    };
    let cartesian_min = {
      x: 15 * this.#quadrants[quadrant].factor_x,
      y: 15 * this.#quadrants[quadrant].factor_y
    };
    let cartesian_max = {
      x: this.#rings[3].radius * this.#quadrants[quadrant].factor_x,
      y: this.#rings[3].radius * this.#quadrants[quadrant].factor_y
    };
    return {
      clipx: (d) => {
        let c = this.bounded_box(d, cartesian_min, cartesian_max);
        let p = this.bounded_ring(this.polar(c), polar_min.r + 15, polar_max.r - 15);
        d.x = this.cartesian(p).x; // adjust data too!
        return d.x;
      },
      clipy: (d) => {
        let c = this.bounded_box(d, cartesian_min, cartesian_max);
        let p = this.bounded_ring(this.polar(c), polar_min.r + 15, polar_max.r - 15);
        d.y = this.cartesian(p).y; // adjust data too!
        return d.y;
      },
      random: () => this.cartesian({
        t: this.random_between(polar_min.t, polar_max.t),
        r: this.normal_between(polar_min.r, polar_max.r),
      }),
    }
  };

  renderEntries = (entries = []) => {

    const { print_layout } = this.config;

    this.rink.selectAll('*').remove();
    this.radar.select('#legend').remove();

    // position each entry randomly in its segment
    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];
      entry.segment = this.segment(entry.quadrant, entry.ring);
      let point = entry.segment.random();
      entry.x = point.x;
      entry.y = point.y;
      entry.color = entry.active || print_layout ?
        this.config.rings[entry.ring].color : this.config.colors.inactive;
    }

    // partition entries according to segments
    this.segmented = new Array(4);
    for (let quadrant = 0; quadrant < 4; quadrant++) {
      this.segmented[quadrant] = new Array(4);
      for (let ring = 0; ring < 4; ring++) {
        this.segmented[quadrant][ring] = [];
      }
    }
    for (let i=0; i < entries.length; i++) {
      const entry = entries[i];
      this.segmented[entry.quadrant][entry.ring].push(entry);
    }

    // assign unique sequential id to each entry
    let id = 1;
    for (let quadrant of [2,3,1,0]) {
      for (let ring = 0; ring < 4; ring++) {
        let entries = this.segmented[quadrant][ring];
        entries.sort((a, b) => a.label.localeCompare(b.label));
        for (let i = 0; i < entries.length; i++) {
          entries[i].id = '' + id++;
        }
      }
    }

    if (print_layout) {
      const legend = this.radar.append('g').attr('id', 'legend');
      for (let quadrant = 0; quadrant < 4; quadrant++) {
        legend.append('text')
          .attr('transform', this.translate(
            this.#legend_offset[quadrant].x,
            this.#legend_offset[quadrant].y - 45
          ))
          .text(this.config.quadrants[quadrant].name)
          .style('font-family', fontFamily)
          .style('font-size', '18');
        for (let ring = 0; ring < 4; ring++) {
          legend.append('text')
            .attr('transform', this.legend_transform(quadrant, ring))
            .text(this.config.rings[ring].name)
            .style('font-family', fontFamily)
            .style('font-size', '12')
            .style('font-weight', 'bold');
          legend.selectAll('.legend' + quadrant + ring)
            .data(this.segmented[quadrant][ring])
            .enter()
              .append('text')
                .attr('transform', (d, i) => this.legend_transform(quadrant, ring, i))
                .attr('class', 'svglink legend' + quadrant + ring)
                .attr('id', d => `legendItem${d.id}`)
                .text(d => `${d.id}. ${d.label}`)
                .style('font-family', fontFamily)
                .style('font-size', '11')
                .on('mouseover', d => { this.showBubble(d); this.highlightLegendItem(d); })
                .on('mouseout', d => { this.hideBubble(d); this.unhighlightLegendItem(d); })
                .on('click', this.followLink);
        }
      }
    }

    const blips = this.rink.selectAll('.blip')
      .data(entries)
      .enter()
        .append('g')
          .attr('class', 'blip svglink')
          .attr('transform', (d, i) => this.legend_transform(d.quadrant, d.ring, i))
          .on('mouseover', d => { this.showBubble(d); this.highlightLegendItem(d); })
          .on('mouseout', d => { this.hideBubble(d); this.unhighlightLegendItem(d); })
          .on('click', this.followLink);

    // configure each blip
    blips.each(function (d) {
      const blip = d3.select(this);

      // blip shape
      if (d.moved) {
        blip.append('path')
          .attr('d', 'M 13,0 -6,11 -6,-11 z') // triangle pointing left
          .style('fill', d.color);
      } else {
        blip.append('circle')
          .attr('r', 9)
          .attr('fill', d.color);
      }

      // blip text
      if (d.active || print_layout) {
        let blip_text = print_layout ? d.id : d.label.match(/[a-z]/i);
        blip.append('text')
          .text(blip_text)
          .attr('y', 3)
          .attr('text-anchor', 'middle')
          .style('fill', '#fff')
          .style('font-family', fontFamily)
          .style('font-size', () => blip_text.length > 2 ? '8' : '9')
          .style('pointer-events', 'none')
          .style('user-select', 'none');
      }
    });

    // make sure that blips stay inside their segment
    const ticked = () => {
      blips.attr("transform", d => this.translate(d.segment.clipx(d), d.segment.clipy(d)));
    };

    // distribute blips, while avoiding collisions
    d3.forceSimulation()
      .nodes(entries)
      .velocityDecay(0.19) // magic number (found by experimentation)
      .force("collision", d3.forceCollide().radius(12).strength(0.85))
      .on("tick", ticked);
  };

  translate = (x, y) => 'translate(' + x + ',' + y + ')';

  viewbox = (quadrant) => [
      Math.max(0, this.#quadrants[quadrant].factor_x * 400) - 420,
      Math.max(0, this.#quadrants[quadrant].factor_y * 400) - 420,
      440,
      440
    ].join(' ');


  renderBackground = () => {
    const svg = d3.select('svg#' + this.config.svg_id)
      .style('background-color', this.config.colors.background)
      .attr('width', this.config.width)
      .attr('height', this.config.height);

    this.radar = svg.append('g');
    if ('zoomed_quadrant' in this.config) {
      svg.attr('viewBox', this.viewbox(this.config.zoomed_quadrant));
    } else {
      this.radar.attr('transform', this.translate(this.config.width / 2, this.config.height / 2));
    }

    const grid = this.radar.append('g');

    // draw grid lines
    grid.append('line')
      .attr('x1', 0).attr('y1', -400)
      .attr('x2', 0).attr('y2', 400)
      .style('stroke', this.config.colors.grid)
      .style('stroke-width', 1);
    grid.append('line')
      .attr('x1', -400).attr('y1', 0)
      .attr('x2', 400).attr('y2', 0)
      .style('stroke', this.config.colors.grid)
      .style('stroke-width', 1);

    // background color. Usage `.attr('filter', 'url(#solid)')`
    // SOURCE: https://stackoverflow.com/a/31013492/2609980
    const defs = grid.append('defs');
    const filter = defs.append('filter')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 1)
      .attr('height', 1)
      .attr('id', 'solid');
    filter.append('feFlood')
      .attr('flood-color', 'rgb(0, 0, 0, 0.8)');
    filter.append('feComposite')
      .attr('in', 'SourceGraphic');

    // draw rings
    for (let i = 0; i < this.#rings.length; i++) {
      grid.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', this.#rings[i].radius)
        .style('fill', 'none')
        .style('stroke', this.config.colors.grid)
        .style('stroke-width', 1);
      if (this.config.print_layout) {
        grid.append('text')
          .text(this.config.rings[i].name)
          .attr('y', -this.#rings[i].radius + 62)
          .attr('text-anchor', 'middle')
          .style('fill', '#e5e5e5')
          .style('font-family', fontFamily)
          .style('font-size', 42)
          .style('font-weight', 'bold')
          .style('pointer-events', 'none')
          .style('user-select', 'none');
      }
    }

    if (this.config.print_layout) {
      // Footer
      this.radar.append('text')
        .attr('transform', this.translate(this.#footer_offset.x, this.#footer_offset.y))
        .text('\u2B24 No change     \u25B6 New or moved')
        .attr('xml:space', 'preserve')
        .style('font-family', fontFamily)
        .style('font-size', '10');
    }

    // layer for entries
    this.rink = this.radar.append('g')
      .attr('id', 'rink');

    // rollover bubble (on top of everything else)
    const bubble = this.radar.append('g')
      .attr('id', 'bubble')
      .attr('x', 0)
      .attr('y', 0)
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('user-select', 'none');
    bubble.append('rect')
      .attr('rx', 4)
      .attr('ry', 4)
      .style('fill', '#333');
    bubble.append('text')
      .style('font-family', fontFamily)
      .style('font-size', '10px')
      .style('fill', '#fff');
    bubble.append('path')
      .attr('d', 'M 0,0 10,0 5,8 z')
      .style('fill', '#333');
  };

  legend_transform = (quadrant, ring, index = null) => {
    let dx = ring < 2 ? 0 : 120;
    let dy = (index == null ? -16 : index * 12);
    if (ring % 2 === 1) {
      dy = dy + 36 + this.segmented[quadrant][ring-1].length * 12;
    }
    return this.translate(
      this.#legend_offset[quadrant].x + dx,
      this.#legend_offset[quadrant].y + dy
    );
  };

  showBubble = (d) => {
    if (d.active || config.print_layout) {
      let tooltip = d3.select('#bubble text')
        .text(d.label);
      let bbox = tooltip.node().getBBox();
      d3.select('#bubble')
        .attr('transform', this.translate(d.x - bbox.width / 2, d.y - 16))
        .style('opacity', 0.8);
      d3.select('#bubble rect')
        .attr('x', -5)
        .attr('y', -bbox.height)
        .attr('width', bbox.width + 10)
        .attr('height', bbox.height + 4);
      d3.select('#bubble path')
        .attr('transform', this.translate(bbox.width / 2 - 5, 3));
    }
  };

  followLink = (d) => {
    if (d.active && d.hasOwnProperty('link') && this.config.linkOnClick) {
      this.config.linkOnClick(d.link);
    }
  };

  hideBubble = () => {
    d3.select('#bubble')
      .attr('transform', this.translate(0,0))
      .style('opacity', 0);
  };

  highlightLegendItem = (d) => {
    const legendItem = document.getElementById(`legendItem${d.id}`);
    legendItem.setAttribute('filter', 'url(#solid)');
    legendItem.setAttribute('fill', 'white');
  };

  unhighlightLegendItem = (d) => {
    const legendItem = document.getElementById(`legendItem${d.id}`);
    if (legendItem) {
      legendItem.removeAttribute('filter');
      legendItem.removeAttribute('fill');
    }
  };
};
