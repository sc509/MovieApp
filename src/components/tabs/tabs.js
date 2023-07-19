import { Component } from 'react';
import './tabs.scss';
import PropTypes from 'prop-types';

export default class Tabs extends Component {
  handleTabClick = (newTab) => {
    const { onTabChange } = this.props;
    onTabChange(newTab);
  };

  render() {
    const { activeTab } = this.props;
    return (
      <section className="tabs">
        <div
          className={activeTab === 'search' ? 'tabs-search active' : 'tabs-search'}
          onClick={() => this.handleTabClick('search')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              this.handleTabClick('search');
            }
          }}
          tabIndex="0"
          role="button"
        >
          Search
        </div>
        <div
          className={activeTab === 'rated' ? 'tabs-rated active' : 'tabs-rated'}
          onClick={() => this.handleTabClick('rated')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              this.handleTabClick('rated');
            }
          }}
          tabIndex="0"
          role="button"
        >
          Rated
        </div>
      </section>
    );
  }
}

Tabs.propTypes = {
  onTabChange: PropTypes.func,
  activeTab: PropTypes.string,
};

Tabs.defaultProps = {
  onTabChange: () => {},
  activeTab: 'search',
};
