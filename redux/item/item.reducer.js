import itemActionTypes from './item.types';
import { addItemToitem, removeItemFromitem } from './item.utils';

const INITIAL_STATE = {
  hidden: true,
  item: []
};

const itemReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case itemActionTypes.TOGGLE_ITEM_HIDDEN:
      return {
        ...state,
        hidden: !state.hidden
      };
    case itemActionTypes.ADD_ITEM:
      return {
        ...state,
        itemItems: addItemToitem(state.itemItems, action.payload)
      };
    case itemActionTypes.REMOVE_ITEM:
      return {
        ...state,
        itemItems: removeItemFromitem(state.itemItems, action.payload)
      };
    case itemActionTypes.CLEAR_ITEM_FROM_item:
      return {
        ...state,
        itemItems: state.itemItems.filter(
          itemItem => itemItem.id !== action.payload.id
        )
      };
    default:
      return state;
  }
};

export default itemReducer;