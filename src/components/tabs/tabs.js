import { Component } from "react";
import './tabs.scss'

export default class Tabs extends Component {
    handleTabClick = (newTab) => {
        this.props.onTabChange(newTab);
    }

    render() {
        const { activeTab } = this.props;
        return (
            <section className="tabs">
                <div className={activeTab === 'search' ? 'tabs-search active' : 'tabs-search'} onClick={() => this.handleTabClick('search')}>Search</div>
                <div className={activeTab === 'rated' ? 'tabs-rated active' : 'tabs-rated'} onClick={() => this.handleTabClick('rated')}>Rated</div>
            </section>
        )
    }
}