import Vue from 'vue';

import { starWarsResource } from 'src/util/resources';
import './person.scss';
import template from './person.html';

export default Vue.extend({
  template,

  data() {
    return {
      person: {},
      vehicles: []
    };
  },

  created(){
    this.fetchPost();
  },

  methods: {

    fetchPost(){
      const id = this.$route.params.id;

      return starWarsResource.get(`people/${id}`)
        .then((response) => {
          this.person = response.data;

          this.fetchVehicles( this.getVehicleIds( response.data.vehicles ) );
        })
        .catch((errorResponse) => {
          // Handle error...
          console.log('API responded with:', errorResponse);
        });
    },

    fetchVehicles( vehicleIds ){
      vehicleIds.forEach( ( vehicleId ) => {
        starWarsResource.get( `vehicles/${vehicleId}` )
          .then( ( response ) => {
            this.vehicles.push( response );
            console.log( 'vehicle response', response );
          }).catch((errorResponse) => {
            // Handle error...
            console.log('API responded with:', errorResponse);
          }
        );
      });
    },

    getVehicleIds( vehicles ) {
      let vehicleIds = [];

      vehicles.forEach( ( vehicle ) => {
        let vehicleId = vehicle.slice( 0, -1 );
        vehicleId = vehicleId.slice( vehicleId.lastIndexOf( '/' ) + 1 );

        vehicleIds.push( vehicleId );
      });

      return vehicleIds;
    }
  }
});
