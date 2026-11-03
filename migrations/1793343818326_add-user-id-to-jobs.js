exports.up = (pgm) => {
  pgm.addColumn('jobs', {
    user_id: {
      type: 'VARCHAR(50)',
      references: '"users"',
      onDelete: 'CASCADE',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('jobs', 'user_id');
};

