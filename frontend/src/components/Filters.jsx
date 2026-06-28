import { Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

const Filters = ({ filters, onChange, total }) => {
  const [searchVal, setSearchVal] = useState(filters.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange('search', searchVal);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchVal]);

  return (
    <div className="filters-bar">
      <div className="search-wrap">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks…"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-selects">
        <SlidersHorizontal size={16} className="filter-icon" />
        <select value={filters.status} onChange={(e) => onChange('status', e.target.value)}>
          <option value="">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select value={filters.priority} onChange={(e) => onChange('priority', e.target.value)}>
          <option value="">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={filters.sort} onChange={(e) => onChange('sort', e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="due-asc">Due: soonest</option>
          <option value="priority">Priority</option>
        </select>
      </div>

      <span className="task-count">{total} task{total !== 1 ? 's' : ''}</span>
    </div>
  );
};

export default Filters;
