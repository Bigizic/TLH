import React, {useState} from "react";
import {
  CPagination,
  CPaginationItem
} from '@coreui/react';

const ManagerPagination = (props) => {
    const { 
      isLightMode, 
      data,
      totalPages, 
      startIndex,
      endIndex,
      onPageChange = () => {} 
    } = props;
    const [currentPage, setCurrentPage] = useState(1);
    
    const handlePageChange = (page) => {
      setCurrentPage(page);
      onPageChange(page);
    }
    
    return (
        <div className='mt-4'>
          <div className='w-100 d-flex justify-content-center align-items-center mb-3'>
            <span className={`${isLightMode ? 'p-black' : 'p-white'} fw-bold`}>
              Page {currentPage} of {totalPages} — Viewing {startIndex + 1}-{
                endIndex > data.length ? data.length : endIndex
              } of {data.length} entries
            </span>
          </div>
          <CPagination align='center'>
            {[...Array(totalPages)].map((_, index) => (
              <CPaginationItem
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => {
                  handlePageChange(index + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ cursor: 'pointer' }}
              >
                {index + 1}
              </CPaginationItem>
            ))}
          </CPagination>
        </div>
    )
}

export default ManagerPagination;
