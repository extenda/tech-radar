import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTags from 'react-tag-autocomplete';
import '../../assets/css/react-tags.css';

class TagsInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: [],
    };
  }

  updateFilter = () => {
    const { onFilter } = this.props;
    const { tags } = this.state;
    onFilter(tags);
  };

  handleDelete = (i) => {
    let { tags } = this.state;
    tags = tags.slice(0);
    tags.splice(i, 1);
    this.setState({
      tags,
    }, this.updateFilter);
  };

  handleAddition = (tag) => {
    const { tags } = this.state;
    tags.push(tag);
    this.setState({
      tags,
    }, this.updateFilter);
  };

  render = () => {
    const { tags, suggestions } = this.state;

    return (
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        placeholder="Filter radar by tags"
        inputAttributes={{ spellCheck: 'false', autoCorrect: 'off' }}
      />
    );
  };
};

TagsInput.getDerivedStateFromProps = (props, state) => {
  const { tags } = props;
  if (tags.length !== state.suggestions.length) {
    let i = 0;
    const id = () => {
      i += 1;
      return i;
    };
    return {
      tags: [],
      suggestions: tags.map((t) => ({id: id(), name: t})),
    };
  }
  return null;
};

TagsInput.propTypes = {
  onFilter: PropTypes.func.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagsInput;
