<?php

declare(strict_types=1);

/*
 * This file is part of the Stooa codebase.
 *
 * (c) 2020 - present Runroom SL
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230327144706 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE fishbowl_topics (fishbowl_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', topic_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', INDEX IDX_7287FD0B72BD0E36 (fishbowl_id), INDEX IDX_7287FD0B1F55203D (topic_id), PRIMARY KEY(fishbowl_id, topic_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE topic (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE users_topics (user_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', topic_id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', INDEX IDX_9E11C8A9A76ED395 (user_id), INDEX IDX_9E11C8A91F55203D (topic_id), PRIMARY KEY(user_id, topic_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE fishbowl_topics ADD CONSTRAINT FK_7287FD0B72BD0E36 FOREIGN KEY (fishbowl_id) REFERENCES fishbowl (id)');
        $this->addSql('ALTER TABLE fishbowl_topics ADD CONSTRAINT FK_7287FD0B1F55203D FOREIGN KEY (topic_id) REFERENCES topic (id)');
        $this->addSql('ALTER TABLE users_topics ADD CONSTRAINT FK_9E11C8A9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE users_topics ADD CONSTRAINT FK_9E11C8A91F55203D FOREIGN KEY (topic_id) REFERENCES topic (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fishbowl_topics DROP FOREIGN KEY FK_7287FD0B72BD0E36');
        $this->addSql('ALTER TABLE fishbowl_topics DROP FOREIGN KEY FK_7287FD0B1F55203D');
        $this->addSql('ALTER TABLE users_topics DROP FOREIGN KEY FK_9E11C8A9A76ED395');
        $this->addSql('ALTER TABLE users_topics DROP FOREIGN KEY FK_9E11C8A91F55203D');
        $this->addSql('DROP TABLE fishbowl_topics');
        $this->addSql('DROP TABLE topic');
        $this->addSql('DROP TABLE users_topics');
    }
}
