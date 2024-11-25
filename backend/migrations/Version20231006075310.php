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
final class Version20231006075310 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE attendee (id CHAR(36) NOT NULL COMMENT \'(DC2Type:uuid)\', fishbowl_id CHAR(36) DEFAULT NULL COMMENT \'(DC2Type:uuid)\', created_date_time DATETIME NOT NULL, timezone VARCHAR(255) NOT NULL, email VARCHAR(255) DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, INDEX IDX_1150D56772BD0E36 (fishbowl_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE attendee ADD CONSTRAINT FK_1150D56772BD0E36 FOREIGN KEY (fishbowl_id) REFERENCES fishbowl (id)');
        $this->addSql('ALTER TABLE fishbowl ADD has_invitation_info TINYINT(1) NOT NULL, ADD invitation_title VARCHAR(255) DEFAULT NULL, ADD invitation_subtitle VARCHAR(255) DEFAULT NULL, ADD invitation_text LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE attendee DROP FOREIGN KEY FK_1150D56772BD0E36');
        $this->addSql('DROP TABLE attendee');
        $this->addSql('ALTER TABLE fishbowl DROP has_invitation_info, DROP invitation_title, DROP invitation_subtitle, DROP invitation_text');
    }
}
