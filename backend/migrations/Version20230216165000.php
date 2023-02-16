<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230216165000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE feedback (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', fishbowl_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:uuid)\', participant_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:uuid)\', created_date_time DATETIME NOT NULL, timezone VARCHAR(255) NOT NULL, satisfaction VARCHAR(255) DEFAULT \'neutral\' NOT NULL, comment LONGTEXT DEFAULT NULL, email VARCHAR(255) DEFAULT NULL, origin VARCHAR(255) DEFAULT \'fishbowl\' NOT NULL, INDEX IDX_D229445872BD0E36 (fishbowl_id), INDEX IDX_D22944589D1C3019 (participant_id), UNIQUE INDEX feedback_unique (fishbowl_id, participant_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D229445872BD0E36 FOREIGN KEY (fishbowl_id) REFERENCES fishbowl (id)');
        $this->addSql('ALTER TABLE feedback ADD CONSTRAINT FK_D22944589D1C3019 FOREIGN KEY (participant_id) REFERENCES participant (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE feedback DROP FOREIGN KEY FK_D229445872BD0E36');
        $this->addSql('ALTER TABLE feedback DROP FOREIGN KEY FK_D22944589D1C3019');
        $this->addSql('DROP TABLE feedback');
    }
}
