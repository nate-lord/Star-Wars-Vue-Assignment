import Vue from 'vue';

import { starWarsResource } from 'src/util/resources';
import './vehicles.scss';
import template from './vehicles.html';

const animation = 'flipInX';
const animationDelay = 25; // in ms

export default Vue.extend({
  template,

  data() {
    return {
      vehicles: []
    };
  },

  computed: {

  },

  created(){
    this.fetchVehicles();
  },

  methods: {
    fetchVehicles(page){
      if (!page) {
        this.vehicles = [];
      }
      return starWarsResource.get('/vehicles/' + (page ? `?page=${page}`: ''))
        .then((response) => {
          let newVehicles = response.data.results.map(p => Object.assign(p, {id: p.url.slice(-2).slice(0,1)}))
          this.vehicles = this.vehicles.concat(newVehicles);
          if (response.data.next) {
            let nextPage = page ? ++page : 2;
            return this.fetchVehicles(nextPage)
          }
        })
        .catch((errorResponse) => {
          // Handle error...
          console.log('API responded with:', errorResponse);
        });
    },

    // Methods for transitions
    handleBeforeEnter(el) {
      el.style.opacity = 0;
      el.classList.add('animated');
    },

    handleEnter(el) {
      const delay = el.dataset.index * animationDelay;
      setTimeout(() => {
        el.style.opacity = 1;
        el.classList.add(animation);
      }, delay);
    }
  }
});
