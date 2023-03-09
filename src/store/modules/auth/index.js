import { createStore } from "vuex";
import actions from './actions';
import mutation from './mutation';
import getters from './getters';
const authModule = createStore({
   state:{
      user: {},
   },
   actions,
   mutation,
   getters,
})

export default authModule