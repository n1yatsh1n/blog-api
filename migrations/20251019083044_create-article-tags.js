'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ArticleTags', {
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Articles', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Tags', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });
    await queryInterface.addConstraint('ArticleTags', {
      type: 'primary key',
      fields: ['articleId', 'tagId'],
      name: 'PK_ArticleTags'
    });
    await queryInterface.addIndex('ArticleTags', ['tagId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ArticleTags');
  }
};
