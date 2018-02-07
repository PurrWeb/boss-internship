import React from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { List, Map } from 'immutable';

class BossFormTagInput extends React.Component {
  handleDelete = (index, tags) => {
    const newTags = tags.filter((item, tagIndex) => tagIndex !== index)
    this.props.input.onChange(newTags);
  }

  handleAddition = (tag, tags) => {
    const id = Math.floor(Math.random() * 1000000000) + 1;
    const newTags = [...tags, {id: id, name: tag}];
    this.props.input.onChange(newTags);
  }

  handleDrag = (tag, currPos, newPos, tags) => {
    let newTags = [...tags];
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    this.props.input.onChange(newTags);
  }

  removeTagButton = ({onClick}) => {
    return (
      <span onClick={onClick} className="boss-tags-input__tag-cancel"></span>
    );
  }

  render() {
    const {
      label,
      meta: { touched, error, warning },
      input: { onBlur, value, onChange, name },
    } = this.props;
    const tags = List.isList(value) ? value.toJS() : value;
    return (
      <div className="boss-form__field">
        <p className="boss-form__label">
          <span className="boss-form__label-text">{label}</span>
        </p>
        <ReactTags tags={tags || []}
          classNames={{
            tags: 'boss-tags-input__tags',
            tag: 'boss-tags-input__tag',
            tagInput: 'boss-tags-input__control',
            tagInputField: `boss-tags-input__input ${(touched && error) ? 'boss-form__input_state_error' : ''}`,
            selected: 'boss-tags-input__tags-inner'
          }}
          removeComponent={this.removeTagButton}
          handleDelete={(i) => this.handleDelete(i, tags)}
          handleAddition={(tag) => this.handleAddition(tag, tags)}
          handleDrag={(tag, currPos, newPos) => this.handleDrag(tag, currPos, newPos, tags)}
          labelField={'name'}
        />
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </div>
    )
  }
}

export default BossFormTagInput;
