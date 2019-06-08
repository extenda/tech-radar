import { firstBy } from 'thenby';
import { pick } from './utils';

class RadarService {
  init = () => fetch('/js/radar.json')
    .then(response => response.json())
    .then((data) => {
      this.model = data;
    });

  getEntry = filename => this.model.entries.find(entry => entry.filename === filename);

  listBlips = () => this.model.entries.filter(entry => entry.blip.active)
    .map(entry => pick(entry.blip, 'label', 'quadrant', 'ring', 'link', 'moved', 'active'));

  listEntries = (quadrant, ring, active = true) => {
    const filters = [
      entry => entry.quadrant.dirname === quadrant,
      entry => entry.blip.active === active,
    ];

    if (ring !== '*') {
      filters.push(entry => entry.blip.ring === ring);
    }

    return this.model.entries
      .filter(entry => filters.every(filter => filter(entry)))
      .sort(firstBy('name'));
  };

  getQuadrant = (dirname) => {
    const qi = this.model.quadrants.findIndex(q => q.dirname === dirname);
    if (qi >= 0) {
      const quadrant = { ...this.model.quadrants[qi] };
      this.model.rings.forEach((ring, index) => {
        quadrant[ring.toLowerCase()] = this.listEntries(quadrant.dirname, index)
          .map(entry => pick(entry, 'name', 'filename'));
      });
      quadrant.inactive = this.listEntries(quadrant.dirname, '*', false);
      return quadrant;
    }
    return undefined;
  };
}

export default new RadarService();
