import React from 'react'
import { SearchTitleFlexible } from 'vtex.search-result'
import Richtext from 'vtex.rich-text/index'
import style from './style.css'


const CategoryHeading = props => {
  return (
    <div>
      {props.title ? (
        <div className={style.categoryHeading}>
          <Richtext text={props.title} />
        </div>
      ) : (
        <SearchTitleFlexible />
      )}
    </div>
  )
}

CategoryHeading.schema = {
  name: 'category-heading',
  title: 'Category Heading',
  description: 'Category Heading',
  type: 'object',
  properties: {
    title: {
      title: 'H1 Customizado',
      type: 'string',
    },
  },
}

export default CategoryHeading
