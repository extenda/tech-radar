import { firstBy } from 'thenby';
import { pick } from './utils';

class RadarService {
  models = {};

  loadRadar = (radarPath, jwt) => fetch(radarPath, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    credentials: 'same-origin',
  }).then((response) => response.json())
    .then((radar) => {
      this.model = radar;
      this.models[radar.id] = radar;
    });

  init = (jwt = false) => {
    this.jwt = jwt;
    return this.loadRadar('/js/radar.json', jwt);
  }

  switchRadar = async (id) => {
    if (this.models[id]) {
      this.model = this.models[id];
      return Promise.resolve();
    }
    return this.loadRadar(`/js/${id}.json`, this.jwt).catch(() => {
      // eslint-disable-next-line no-console
      console.error('Unknown model ID:', id);
    });
  }

  getEntry = (filename) => this.model.entries.find((entry) => entry.filename === filename);

  listBlips = (tags = []) => {
    const entryFilter = (entry) => {
      if (!entry.blip.active) {
        return false;
      }

      if (tags && tags.length > 0) {
        // Return true if entry includes all filter tags.
        return tags.every((tag) => entry.tags.includes(tag));
      }

      return true;
    };

    return this.model.entries.filter(entryFilter)
      .map((entry) => pick(entry.blip, 'id', 'label', 'quadrant', 'ring', 'link', 'moved', 'active'));
  };

  listTags = () => {
    const tags = new Set();
    this.model.entries.forEach((entry) => {
      entry.tags.every((tag) => tags.add(tag));
    });

    return [...tags].sort((a, b) => a.localeCompare(b));
  };

  listEntries = (quadrant, ring, active = true) => {
    const filters = [
      (entry) => entry.quadrant.dirname === quadrant,
    ];

    if (active) {
      filters.push((entry) => entry.blip.active === active);
    }

    if (ring !== '*') {
      filters.push((entry) => entry.blip.ring === ring);
    }

    return this.model.entries
      .filter((entry) => filters.every((filter) => filter(entry)))
      .sort(firstBy('name'));
  };

  listEntriesByTag = (tag) => this.model.entries
    .filter((entry) => entry.tags.includes(tag))
    .sort(firstBy('name'));

  getQuadrant = (dirname, onlyActive = false) => {
    const qi = this.model.quadrants.findIndex((q) => q.dirname === dirname);
    if (qi >= 0) {
      const quadrant = { ...this.model.quadrants[qi] };
      this.model.rings.forEach((ring, index) => {
        quadrant[ring.toLowerCase()] = this.listEntries(quadrant.dirname, index, onlyActive)
          .map((entry) => {
            const out = pick(entry, 'name', 'shortname', 'filename');
            const { id, active } = entry.blip;
            return {
              ...out,
              id,
              active,
            };
          });
      });
      return quadrant;
    }
    return undefined;
  };
}

export default new RadarService();
