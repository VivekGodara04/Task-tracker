import { ClipboardList } from 'lucide-react';

const EmptyState = ({ filtered, onClear }) => (
  <div className="empty-state">
    <ClipboardList size={48} className="empty-icon" />
    {filtered ? (
      <>
        <h3>No tasks match your filters</h3>
        <p>Try adjusting your search or filters.</p>
        <button className="btn-secondary" onClick={onClear}>Clear filters</button>
      </>
    ) : (
      <>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started.</p>
      </>
    )}
  </div>
);

export default EmptyState;
