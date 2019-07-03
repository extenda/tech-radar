import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTags from 'react-tag-autocomplete';
import '../../assets/css/react-tags.css';

export default class TagsInput extends Component {
  static propTypes = {
    onFilter: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  constructor(props) {
    super(props);

    const { tags } = props;

    let i = 0;
    const id = () => {
      i += 1;
      return i;
    };

    this.state = {
      tags: [],
      suggestions: tags.map(t => ({ id: id(), name: t })),
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
      />
    );
  };
}
