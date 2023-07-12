import React from 'react';
import { Pagination } from 'antd';
import "./footer.scss"

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

export default Footer;