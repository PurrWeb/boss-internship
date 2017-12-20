import React, { Component } from 'react'
import utils from "~/lib/utils"

export const DropDownListItem = ({item, color}) => {
  const {description, highlightedDescription, path} = item;
  return <div className="boss-alias">
    <a href={path} className="boss-alias__link">
      <span className="boss-alias__icon boss-alias__icon_type_solid" style={{backgroundColor: color, borderColor: color}}>{utils.generateQuickMenuAlias(description)}</span>
      <span className="boss-alias__text" style={{color}} dangerouslySetInnerHTML={{__html: highlightedDescription || description}}></span>
    </a>
  </div>
};

export default ({items}) => {
  return <div className="boss-quick-access">
    { items.map( (item, key) =>
      <div className="boss-quick-access__group" key={key}>
        <div className="boss-quick-access__group-header">
          <h4 className="boss-quick-access__group-title" dangerouslySetInnerHTML={{__html: item.highlightedName || item.name}}></h4>
        </div>
        <div className="boss-quick-access__aliases">
          { item.items.map( (childItem, key) =>
            <div key={key} className="boss-quick-access__alias">
              <DropDownListItem item={childItem} color={item.color} />
            </div>
          )}
        </div>
      </div>
      )
    }
  </div>
}
