import React from 'react';
import { Route } from 'react-router-dom';
import ReProposalContent from './re-proposal-content';

const ReProposalRoute: React.FC = () => {
  return (
    <Route path="/" element={<ReProposalContent />} />
  );
};

export default ReProposalRoute;