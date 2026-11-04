exports.up = (pgm) => {
  pgm.createTable("documents", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    filename: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    original_name: {
      type: "VARCHAR(255)",
      notNull: true,
    },
    size: {
      type: "BIGINT",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "TIMESTAMPTZ",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("documents");
};
