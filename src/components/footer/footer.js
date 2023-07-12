import React from 'react';
import { Pagination } from 'antd';
import "./footer.scss"

function Footer({ currentPage, handlePageChange, totalResults }) {
    return (
        <div className="footer-pagination">
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={totalResults}
                pageSize={20}
                showSizeChanger={false}
            />
        </div>
    );
}

export default Footer;