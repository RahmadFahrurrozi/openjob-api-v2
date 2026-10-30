exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'cascade',
    },
    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'cascade',
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
      notNull: true,
    },
    job_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    experience_level: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    location_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    location_city: {
      type: 'VARCHAR(255)',
    },
    salary_min: {
      type: 'BIGINT',
    },
    salary_max: {
      type: 'BIGINT',
    },
    is_salary_visible: {
      type: 'BOOLEAN',
      notNull: true,
      default: true,
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'open',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};
