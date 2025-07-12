import React from 'react';
import { CModal, CModalBody, CButton } from '@coreui/react';

const TopSlideConfirmModal = (props) => {
  const { visible, text, onConfirm, onClose, confirmValue } = props;
  return (
    <CModal
      alignment="top"
      visible={visible}
      backdrop="static"
      onClose={onClose}
      className="p-3"
    >
      <CModalBody className="text-center">
        <div data-aos="fade-down">
          <p className="fw-bold fs-5 mb-4">{text}</p>
          <div className="d-flex justify-content-center gap-3">
            <CButton color="danger" onClick={() => onConfirm(confirmValue)}>
              Yes
            </CButton>
            <CButton color="secondary" onClick={onClose}>
              No
            </CButton>
          </div>
        </div>
      </CModalBody>
    </CModal>
  );
};

export default TopSlideConfirmModal;
