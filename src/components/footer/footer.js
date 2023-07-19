import React from 'react';
import { Pagination } from 'antd';
import PropTypes from 'prop-types';
import './footer.scss';

function Footer({ currentPage, handlePageChange, totalResults }) {
  const maxPages = 500;
  const pageSize = 20;
  const limitedTotalResults = Math.min(totalResults, maxPages * pageSize - 1);

  return (
    <div className="footer-pagination">
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        total={limitedTotalResults}
        pageSize={pageSize}
        showSizeChanger={false}
      />
    </div>
  );
}
Footer.propTypes = {
  currentPage: PropTypes.number,
  handlePageChange: PropTypes.func,
  totalResults: PropTypes.number,
};

Footer.defaultProps = {
  currentPage: 1,
  handlePageChange: () => {},
  totalResults: 0,
};

export default Footer;
