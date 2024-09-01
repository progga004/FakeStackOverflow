
import React from 'react';
import Sidebarelements from './sidebarelements';

/**
 * @function this will render the a sidebar with elements
 * @params none
 * @returns A sidebar used for the client
 */
export default function Sidebar({onDisplayChange,onHideForm,onSortChange, isGuest}) {
  return(
    <Sidebarelements onDisplayChange={onDisplayChange} onHideForm={onHideForm} onSortChange={onSortChange} isGuest={isGuest}/>
  )
}
