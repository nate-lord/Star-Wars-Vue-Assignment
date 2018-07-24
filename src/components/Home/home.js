import Vue from 'vue';
import vSelect from 'vue-select';
import template from './home.html';
import './home.scss';
import readme from '../../../README.md'
import VueMarkdown from 'vue-markdown'
import { starWarsResource } from 'src/util/resources';

export default Vue.extend({
  template,
  components: {
    'vue-markdown': VueMarkdown,
    'v-select': vSelect
  },

  data() {
    return {
      readme,
      peopledata: {
        people: [],
        data: {
          isLoaded: false
        },
        currentPersonIndex: 0,
        currentPersonLinkId: 0,
        appearOrder: []
      },
      showUnknownWeights: false,
      dropDown: {
        dropDownOptions: [],
        dropDownSelection: {}
      },
      isInfoHidden: false
    }
  },

  created(){
    this.fetchPeople();
  },

  methods: {
    copyObject( obj ) {
      return JSON.parse( JSON.stringify( obj ) );
    },

    createDropDownOptions() {
      let dropDownOptions = [];

      this.peopledata.people.forEach( ( person, index ) => {
        dropDownOptions.push({ label: person.name, value: index });
      });

      this.dropDown.dropDownOptions = dropDownOptions;
      this.dropDown.dropDownSelection = dropDownOptions[ 0 ];
    },

    createPeopleData() {
      let massMax,
          maxHeight;

      this.sortPeopleByName();
      this.normalizeData();
      this.createDropDownOptions();
      massMax = this.getMax( 'mass' );
      maxHeight = this.getMax( 'height' );
      this.peopledata.data.maxMass = massMax;
      this.peopledata.data.massIncrements = this.getIncrements( massMax );
      this.peopledata.data.maxHeight = maxHeight;
      this.peopledata.data.heightIncrements = this.getIncrements( maxHeight );
      this.setPeopleProportions();
      this.peopledata.data.isLoaded = true;
    },

    fetchPeople(page){
      if (!page) {
        this.peopledata.people = [];
      }
      return starWarsResource.get('/people/' + (page ? `?page=${page}`: ''))
        .then((response) => {
          let newPeople = response.data.results.map(p => Object.assign(p, {id: p.url.slice(-2).slice(0,1)}))
          this.peopledata.people = this.peopledata.people.concat(newPeople);
          if (response.data.next) {
            let nextPage = page ? ++page : 2;
            return this.fetchPeople(nextPage)
          } else {
            this.createPeopleData();
          }
        })
        .catch((errorResponse) => {
          console.log('API responded with:', errorResponse);
        }
      );
    },

    getCurrentPersonLinkId( person ) {
      let personLink = person.url.slice( 0, -1 );
      personLink = personLink.slice( personLink.lastIndexOf( '/' ) + 1 );

      return personLink;
    },

    getIncrements( max ) {
      let divisions = [ 2, 3, 4, 5 ],
          increments = {};
      
      divisions.forEach( ( division ) => {
        let increment = max / division;
        increment = Math.floor( increment / 5 ) * 5;
        increments[ 'sections-' + division ] = {
          increment: increment,
          percentage: increment / max * 100
        };
      });

      return increments;
    },

    getMax( attr ) {
      let max = 0;

      for ( let i = 0; i < this.peopledata.people.length; i++ ) {
        if ( !this.peopledata.people[ i ][ attr ] ) {
          continue;
        }

        let personAttr = this.peopledata.people[ i ][ attr ];

        if ( personAttr > max && personAttr < 1000 ) {
          max = personAttr;
        }
      }
  
      return Math.ceil( ( max + 1 ) / 20 ) * 20;
    },

    hideInfo() {
      this.isInfoHidden = true;
    },

    normalizeData() {
      this.peopledata.people.forEach( ( person ) => {
        if ( person.height === 'unknown' ) {
          person.height = undefined;
        } else {
          person.height = parseInt( person.height.replace( /,/g, '' ) );
        }

        if ( person.mass === 'unknown' ) {
          person.mass = undefined;
        } else {
          person.mass = parseInt( person.mass.replace( /,/g, '' ) );
        }
      });
    },

    range ( start, end, reverse ) {
      let range = Array( end - start + 1 ).fill().map( ( _, idx ) => start + idx );

      if ( reverse ) {
        return range.reverse();
      }
      return range;
    },

    setPeopleProportions() {
      this.peopledata.people.forEach( ( person ) => {
        person.heightPercentOfMax = ( !person.height ? 0 : person.height / this.peopledata.data.maxHeight * 100 );

        if ( !person.mass ) {
          person.massPercentOfMax = 0;
        } else if ( person.mass > 1000 ) {
          person.massPercentOfMax = 'max';
        } else {
          person.massPercentOfMax = person.mass / this.peopledata.data.maxMass * 100;
        }
      });
    },

    showInfo() {
      this.isInfoHidden = false;
    },

    sortPeopleByName() {
      this.peopledata.people.sort( ( a, b ) => {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();

        if ( nameA < nameB ) {
          return -1;
        }
        if ( nameA > nameB ) {
          return 1;
        }
      
        return 0;
      });
    },

    toggleShowUnknownWeights() {
      this.showUnknownWeights = !this.showUnknownWeights;
    },

    update() {
      this.peopledata.currentPersonIndex++;
    },

    updateCurrentPerson( index ) {
      this.showInfo();
      this.peopledata.currentPersonIndex = index;
      this.dropDown.dropDownSelection = this.dropDown.dropDownOptions[ index ];
      this.peopledata.currentPersonLinkId = this.getCurrentPersonLinkId( this.peopledata.people[ index ] );
    },

    updateCurrentPersonByDropDown() {
      this.peopledata.currentPersonIndex = this.dropDown.dropDownSelection.value;
      this.peopledata.currentPersonLinkId =this.getCurrentPersonLinkId( this.peopledata.people[ this.dropDown.dropDownSelection.value ] );
    }
  }
});
