const Stats = ({ tasks }) => {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const high = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length;

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-num">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-divider" />
      <div className="stat">
        <span className="stat-num todo">{todo}</span>
        <span className="stat-label">To Do</span>
      </div>
      <div className="stat">
        <span className="stat-num in-progress">{inProgress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat">
        <span className="stat-num done">{done}</span>
        <span className="stat-label">Done</span>
      </div>
      {high > 0 && (
        <>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num high">{high}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </>
      )}
    </div>
  );
};

export default Stats;
