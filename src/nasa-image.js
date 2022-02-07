import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card/accent-card.js';

class NasaElement extends LitElement {
  constructor() {
    super();
    this.locationEndpoint =
      'http://images-api.nasa.gov/search?q=moon%20landing&media_type=image';
    this.picture = [];
    this.loadData = false;
    // coming from accent card
    this.view = 'card';
    this.page = 1;
  }

  static get properties() {
    return {
      picture: { type: Array },
      loadData: {
        type: Boolean,
        reflect: true,
        attribute: 'load-data',
      },
      page: { type: Number, reflect: true },
      view: { type: String, reflect: true },
    };
  }

  updated(changedProperties) {
    // try to get involved with picture
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'loadData' && this[propName]) {
        this.getData();
      } else if (propName === 'picture') {
        this.dispatchEvent(
          new CustomEvent('results-changed', {
            detail: {
              value: this.picture,
            },
          })
        );
      }
    });
  }

  getData(picture) {
    fetch(
      `https://images-api.nasa.gov/search?q=${this.name}&media_type=image&page=${this.page}`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        console.log(data);
        this.picture = [];

        for (let i = 0; i < picture.length; i += 1) {
          const eventInfo = {
            page: data[i].page,
            desc: data[i].description,
            title: data[i].title,
            photographer: data[i].photographer,
            secondary: data[i].secondary_creator,
          };
          this.picture.push(eventInfo);
          console.log(eventInfo);
        }
      });
  }

  resetData() {
    this.picture = [];
    this.loadData = false;
  }

  // performing a search: GET /search?q={q}
  static get styles() {
    return css`
      :host {
        display: block;
        border: 2px solid black;
        min-height: 100px;
      }

      :host([view='list']) ul {
        margin: 20px;
      }
    `;
  }

  /**
   *
   * @todo going over this.getRootNode: can this be the solution or am i just dumb?
   * possibly both
   */
  render() {
    return html`
      ${this.view === 'list'
        ? html`
            <ul>
              ${this.picture.map(
                item => html`
                  <li>
                    ${item.image} - ${item.page} - ${item.desc} - ${item.title}
                    - ${item.photographer} - ${item.secondary}
                  </li>
                `
              )}
            </ul>
          `
        : html`
            ${this.picture.map(
              item => html`
                <accent-card
                  image-src="${item.image}"
                  page="${item.page}"
                  description="${item.desc}"
                  title="${item.title}"
                  photographer="${item.photographer}"
                  secondary_creator="${item.secondary}"
                ></accent-card>
              `
            )}
          `}
    `;
  }
}

customElements.define('nasa-image-search', NasaElement);
