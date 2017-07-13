import React, { Component } from 'react'
import utils from "~lib/utils"

export const DropDownListItem = ({item}) => {
  const {description, highlightedDescription, path} = item;
  return <div className="boss-alias">
      <a href={path} className="boss-alias__link">
      <span className="boss-alias__icon boss-alias__icon_type_solid boss-alias__icon_role_venue">{utils.generateQuickMenuAlias(description)}</span>
      <span className="boss-alias__text boss-alias__text_role_venue" dangerouslySetInnerHTML={{__html: highlightedDescription || description}}></span>
    </a>
  </div>
};

export default ({items}) => {
  return <div className="boss-quick-access">
    { items.map( (item, key) => 
      <div className="boss-quick-access__group" key={key}>
        <div className="boss-quick-access__group-header">
          <h4 className="boss-quick-access__group-title"> {item.name} </h4>
        </div>
        <div className="boss-quick-access__aliases">
          { item.items.map( (item, key) => 
            <div key={key} className="boss-quick-access__alias">
              <DropDownListItem item={item} />
            </div>
          )}
        </div>
      </div>
      ) 
    }
  </div>
}
